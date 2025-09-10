'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MapPicker from './MapPicker';
import { toast } from 'sonner';

interface Store {
  $id: string;
  name: string;
  location: [number, number];
}

export default function StoreManager() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/store');
      const data = await response.json();
      setStores(data);
    } catch (error) {
      toast.error('Failed to fetch stores');
    }
  };

  const handleAddStore = async () => {
    if (!newStoreName || !selectedLocation) {
      toast.error('Name and location required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStoreName,
          location: selectedLocation
        })
      });

      if (response.ok) {
        toast.success('Store added');
        setIsAddDialogOpen(false);
        setNewStoreName('');
        setSelectedLocation(null);
        fetchStores();
      }
    } catch (error) {
      toast.error('Failed to add store');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      const response = await fetch(`/api/store?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Store removed');
        fetchStores();
      }
    } catch (error) {
      toast.error('Failed to delete store');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Store locations</h3>
          <p className="text-sm text-zinc-500 mt-1">Manage delivery stores</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm"
              variant="outline"
              className="h-10 px-4 text-sm border-zinc-800 bg-transparent hover:bg-zinc-900 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-950">
            <DialogHeader>
              <DialogTitle className="text-white font-medium">Add store location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="store-name" className="text-xs text-zinc-400">Store name</Label>
                <Input
                  id="store-name"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Enter name"
                  className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-zinc-400">Location</Label>
                <div className="mt-1.5">
                  <MapPicker
                    onLocationSelect={(lat, lon) => setSelectedLocation({ lat, lon })}
                    selectedLocation={selectedLocation}
                    height="280px"
                  />
                </div>
                {selectedLocation && (
                  <p className="text-xs text-zinc-500 mt-2 font-mono">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleAddStore} 
                disabled={loading || !newStoreName || !selectedLocation}
                className="w-full bg-white hover:bg-zinc-100 text-black font-medium h-9"
              >
                {loading ? 'Adding...' : 'Add store'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {stores.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-500">No stores configured</p>
          </div>
        ) : (
          stores.map((store) => (
            <div 
              key={store.$id} 
              className="flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <div>
                <p className="text-base text-white font-medium">{store.name}</p>
                <p className="text-sm text-zinc-500 mt-1 font-mono">
                  {store.location[0].toFixed(4)}, {store.location[1].toFixed(4)}
                </p>
              </div>
              <button
                onClick={() => handleDeleteStore(store.$id)}
                className="p-2.5 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500 hover:text-white" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}