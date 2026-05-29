import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, LocateFixed } from "lucide-react";

// Fix Leaflet default marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Bobo-Dioulasso center
const DEFAULT_CENTER: [number, number] = [11.1771, -4.2979];
const DEFAULT_ZOOM = 13;

type LatLng = { lat: number; lng: number };

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=fr`,
      { headers: { "Accept-Language": "fr" } }
    );
    const data = await res.json();
    if (data?.display_name) {
      // Shorten: remove country suffix
      const parts = (data.display_name as string).split(", ");
      return parts.slice(0, Math.min(parts.length - 1, 4)).join(", ");
    }
  } catch (_) {}
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

// Bobo-Dioulasso bounding box (viewbox: minLon,maxLat,maxLon,minLat)
const BOBO_VIEWBOX = "-4.5500,11.2800,-4.0500,11.0500";

async function forwardGeocode(query: string): Promise<NominatimResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + " Bobo-Dioulasso")}&limit=5&countrycodes=bf&viewbox=${BOBO_VIEWBOX}&bounded=0&accept-language=fr`
    );
    return await res.json();
  } catch (_) {
    return [];
  }
}

function ClickHandler({ onPick }: { onPick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ target }: { target: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

export interface MapPickerValue {
  address: string;
  lat: number;
  lng: number;
}

interface MapPickerProps {
  label: string;
  value?: string;
  onSelect: (val: MapPickerValue) => void;
  "data-testid"?: string;
}

export default function MapPicker({ label, value, onSelect, "data-testid": testId }: MapPickerProps) {
  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const handlePick = useCallback(async (latlng: LatLng) => {
    setMarker(latlng);
    setSearchResults([]);
    setLoading(true);
    const addr = await reverseGeocode(latlng.lat, latlng.lng);
    setAddress(addr);
    setLoading(false);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await forwardGeocode(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const handleSelectResult = (result: NominatimResult) => {
    const latlng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setMarker(latlng);
    setFlyTarget(latlng);
    const parts = result.display_name.split(", ");
    setAddress(parts.slice(0, Math.min(parts.length - 1, 4)).join(", "));
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMarker(latlng);
        setFlyTarget(latlng);
        setLoading(true);
        const addr = await reverseGeocode(latlng.lat, latlng.lng);
        setAddress(addr);
        setLoading(false);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleConfirm = () => {
    if (!marker || !address) return;
    onSelect({ address, lat: marker.lat, lng: marker.lng });
    setOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          readOnly
          value={value ?? ""}
          placeholder={`Tapez ou choisissez sur la carte…`}
          className="flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
          data-testid={testId}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="shrink-0 border-primary/40 text-primary hover:bg-primary/5"
          title="Choisir sur la carte"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {label}
            </DialogTitle>
          </DialogHeader>

          {/* Search bar */}
          <div className="px-5 pb-3 space-y-2">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Rechercher une adresse, un quartier…"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={handleSearch} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={handleLocateMe} disabled={locating} title="Ma position">
                {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              </Button>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="border rounded-xl overflow-hidden shadow-md bg-white z-50 relative">
                {searchResults.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    onClick={() => handleSelectResult(r)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 border-b last:border-0 transition-colors"
                  >
                    {r.display_name.split(", ").slice(0, 4).join(", ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="relative" style={{ height: 360 }}>
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <ClickHandler onPick={handlePick} />
              <FlyTo target={flyTarget} />
              {marker && <Marker position={[marker.lat, marker.lng]} />}
            </MapContainer>

            {/* Tap hint overlay */}
            {!marker && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none z-[1000]">
                Appuyez sur la carte pour placer un repère
              </div>
            )}
          </div>

          {/* Selected address */}
          <div className="px-5 py-3 bg-muted/30 min-h-[52px] flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Identification de l'adresse…
              </div>
            ) : address ? (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{address}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun lieu sélectionné</p>
            )}
          </div>

          <DialogFooter className="px-5 py-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="button" onClick={handleConfirm} disabled={!marker || !address || loading} className="gap-2">
              <MapPin className="h-4 w-4" />
              Confirmer ce lieu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
