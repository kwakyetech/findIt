import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ items }) => {
    // Filter items that have coordinates
    const itemsWithLocation = items.filter(item => item.coordinates && item.coordinates.lat && item.coordinates.lng);

    // Default center
    const defaultCenter = [51.505, -0.09];

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={3}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {itemsWithLocation.map(item => (
                    <Marker
                        key={item.id}
                        position={[item.coordinates.lat, item.coordinates.lng]}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-600 line-clamp-2 my-1">{item.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {item.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {itemsWithLocation.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg shadow-lg z-[1000] text-center">
                    <p className="text-slate-600 font-medium">No items with location data found.</p>
                </div>
            )}
        </div>
    );
};

export default MapView;
