"use client";

import { useState } from "react";
import { MapPin, Store, Menu, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MapPicker from "@/components/MapPicker";
import StoreManager from "@/components/StoreManager";
import { toast } from "sonner";

interface ServiceableStore {
  $id: string;
  name: string;
  location: [number, number];
  distance?: number;
}

export default function Home() {
  const [deliveryLocation, setDeliveryLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [serviceableStores, setServiceableStores] = useState<
    ServiceableStore[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleLocationSelect = (lat: number, lon: number) => {
    setDeliveryLocation({ lat, lon });
    setHasChecked(false);
    setServiceableStores([]);
  };

  const checkServiceableStores = async () => {
    if (!deliveryLocation) {
      toast.error("Select a delivery location first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/check?lat=${deliveryLocation.lat}&lon=${deliveryLocation.lon}`
      );
      const data = await response.json();
      setServiceableStores(data.serviceableStores);
      setHasChecked(true);

      if (data.serviceableStores.length === 0) {
        toast.error("No stores in your area");
      } else {
        toast.success(`${data.serviceableStores.length} stores available`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to check stores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 py-8 w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">
              Store Locator
            </h1>
            <p className="text-sm text-zinc-500">
              Find stores that deliver to your location
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] border-zinc-800 bg-zinc-950 p-0">
              <div className="p-8">
                <SheetHeader className="pb-8">
                  <SheetTitle className="text-xl font-medium text-white">
                    Settings
                  </SheetTitle>
                </SheetHeader>
                <StoreManager />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-sm font-medium text-white mb-1">
                  Select delivery location
                </h2>
                <p className="text-xs text-zinc-500">
                  Click anywhere on the map
                </p>
              </div>

              <MapPicker
                onLocationSelect={handleLocationSelect}
                selectedLocation={deliveryLocation}
                height="500px"
              />

              {deliveryLocation && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Selected coordinates
                    </p>
                    <p className="text-sm text-white font-mono mt-0.5">
                      {deliveryLocation.lat.toFixed(6)},{" "}
                      {deliveryLocation.lon.toFixed(6)}
                    </p>
                  </div>

                  <Button
                    onClick={checkServiceableStores}
                    disabled={!deliveryLocation || loading}
                    className="bg-white hover:bg-zinc-100 text-black font-medium h-9 px-6"
                  >
                    {loading ? "Checking..." : "Check availability"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stores List */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900 rounded-lg p-6 h-full">
              <h2 className="text-sm font-medium text-white mb-4">
                Available stores
              </h2>

              <div className="space-y-3">
                {!hasChecked ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                      <p className="text-sm text-zinc-500">
                        Select location to see stores
                      </p>
                    </div>
                  </div>
                ) : serviceableStores.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Store className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                      <p className="text-sm text-zinc-500">
                        No stores available
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Try a different location
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {serviceableStores.map((store) => (
                      <div
                        key={store.$id}
                        className="p-4 bg-zinc-800 hover:bg-zinc-800/70 rounded-lg transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-white">
                              {store.name}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">
                              {store.distance !== undefined
                                ? store.distance >= 1000
                                  ? `${(store.distance / 1000).toFixed(
                                      1
                                    )} km away`
                                  : `${store.distance} m away`
                                : "Calculating..."}
                            </p>
                          </div>
                          <Circle className="w-2 h-2 text-green-500 fill-green-500 mt-1.5" />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 mt-4 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500">
                        {serviceableStores.length}{" "}
                        {serviceableStores.length === 1 ? "store" : "stores"}{" "}
                        can deliver
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
