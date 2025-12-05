import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
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

// Component to update map center when position changes via search
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [position, map]);
    return null;
}

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
    const [position, setPosition] = useState(initialLocation || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const defaultCenter = [51.505, -0.09]; // Default: London

    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        }
    }, [position, onLocationSelect]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
                setPosition(newPos);
            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error("Search failed:", error);
            alert('Error searching for location');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a location..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                >
                    <Search size={20} />
                </button>
            </div>

            <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-300 z-0 relative">
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
                    <MapUpdater position={position} />
                </MapContainer>
                <div className="text-xs text-slate-500 mt-1 text-center bg-white py-1">
                    Click on the map or search to pin the location.
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
