import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import locationPin from "../assets/location-pin.png";
import taxiApp from "../assets/taxi-app.png";

const CustomMarker = React.memo(({ trip, onMarkerClick }) => {
  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: trip.vendor_id === "CMT" ? locationPin : taxiApp,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    [trip.vendor_id]
  );

  const pickupPosition = useMemo(
    () => [
      parseFloat(trip.pickup_latitude),
      parseFloat(trip.pickup_longitude),
    ],
    [trip.pickup_latitude, trip.pickup_longitude]
  );

  return (
    <Marker
      position={pickupPosition}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(trip),
      }}
    >
      <Popup>
        <div>
          <h4>Vendor: {trip.vendor_id}</h4>
          <h4>Fare: ${parseFloat(trip.fare_amount).toFixed(2)}</h4>          
          <h4>Payment: {trip.payment_type}</h4>          
          <p>Distance: {parseFloat(trip.trip_distance).toFixed(2)} km</p>
          <p>Pickup Time: {new Date(trip.pickup_datetime).toLocaleString()}</p>
          <p>Dropoff Time: {new Date(trip.dropoff_datetime).toLocaleString()}</p>
        </div>
      </Popup>
    </Marker>
  );
});

const RouteLayer = React.memo(({ trip }) => {
  const map = useMap();
  const routingControlRef = React.useRef(null);

  useEffect(() => {
    if (!trip || !map) return;

    const pickupLatLng = L.latLng(
      parseFloat(trip.pickup_latitude),
      parseFloat(trip.pickup_longitude)
    );
    const dropoffLatLng = L.latLng(
      parseFloat(trip.dropoff_latitude),
      parseFloat(trip.dropoff_longitude)
    );

    const cleanupRouting = () => {
      try {
        if (routingControlRef.current) {
          routingControlRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      } catch (error) {
        console.warn("Error during routing cleanup:", error);
      }
    };

    cleanupRouting();

    const newRoutingControl = L.Routing.control({
      waypoints: [pickupLatLng, dropoffLatLng],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          {
            color: "blue",
            opacity: 0.7,
            weight: 5,
          },
        ],
      },
      createMarker: () => null,
    });

    newRoutingControl.addTo(map);
    routingControlRef.current = newRoutingControl;

    return () => {
      cleanupRouting();
    };
  }, [trip, map]);

  return null;
});

const Map = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleMarkerClick = useCallback((trip) => {
    setSelectedTrip((prevTrip) => (prevTrip === trip ? null : trip));
  }, []);

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      style={{ width: "100%", height: "500px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {trips.map((trip, index) => (
        <CustomMarker
          key={index}
          trip={trip}
          onMarkerClick={handleMarkerClick}
        />
      ))}

      {selectedTrip && <RouteLayer trip={selectedTrip} />}
    </MapContainer>
  );
};

export default React.memo(Map);
