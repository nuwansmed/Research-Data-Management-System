import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// SetViewToFitAll component defined outside of MapView
const SetViewToFitAll = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations && locations.length > 0) {
      const group = new L.featureGroup(locations.map(loc => 
        L.marker([loc.latitude, loc.longitude])
      ));
      map.fitBounds(group.getBounds(), {
        padding: [50, 50] // adjust map padding
      });
    }
  }, [locations, map]);

  return null;
};

const MapView = ({ locations }) => {

  const mapStyle = {
    height: 'calc(80vh - 50px)',
    width: '100%'
  };

  return (
    <MapContainer className="map-container" center={[7.8731, 80.7718]} zoom={7} style={mapStyle}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map(location => (
        <Marker key={location.location_id} position={[location.latitude, location.longitude]}>
          <Popup>Location ID: {location.location_id}</Popup>
        </Marker>
      ))}
      <SetViewToFitAll locations={locations} />
    </MapContainer>
  );
};

export default MapView;
