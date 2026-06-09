import Leaflet from "leaflet";
import { LocationData } from "../../../../../shared/schema/experience";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
const MarkerIcon = Leaflet.icon({
  iconUrl: "/map-marker.webp",
  iconSize: [41, 41],
  iconAnchor: [20, 41],
});

type LocationDisplayProps = {
  location: Omit<LocationData, "displayName"> & { displayName?: string };
  zoom?: number;
};
const LocationDisplay = ({ location, zoom = 18 }: LocationDisplayProps) => {
  return (
    <div className="space-y-4">
      {location?.displayName && (
        <div className="flex flex-row items-center gap-2">
          <MapPin className="text-primary-500 h-6 w-6" />
          <span className="flex-1 text-neutral-500 dark:text-neutral-400">
            {location.displayName}
          </span>
        </div>
      )}

      <div
        className="h-[300px] w-full overflow-hidden rounded-md"
        style={{ height: "300px", width: "100%" }}
      >
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={zoom}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker icon={MarkerIcon} position={[location.lat, location.lon]} />
          <MapUpdater location={location} zoom={zoom} />
        </MapContainer>
      </div>
    </div>
  );
};

function MapUpdater({ location, zoom }: LocationDisplayProps) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.setView([location.lat, location.lon], zoom);
    }, 100);
  }, [location, zoom, map]);

  return null;
}
export default LocationDisplay;
