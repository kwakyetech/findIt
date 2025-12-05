import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    // Default to a central location (e.g., London or just 0,0 if unknown)
    // Ideally, we could ask for browser geolocation here.
    const [position, setPosition] = useState(initialLocation || null);
    const defaultCenter = [51.505, -0.09]; // Default: London

    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        }
    }, [position, onLocationSelect]);

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-300 z-0">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            <div className="text-xs text-slate-500 mt-1 text-center">
                Click on the map to pin the location.
            </div>
        </div>
    );
};

export default LocationPicker;
