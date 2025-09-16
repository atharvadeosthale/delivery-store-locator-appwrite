import { NextRequest, NextResponse } from "next/server";
import { tablesdb } from "@/lib/appwrite";
import { Query } from "node-appwrite";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  const serviceableStores = await tablesdb.listRows({
    databaseId: "ecommerce",
    tableId: "stores",
    queries: [Query.distanceLessThan("location", [lon, lat], 16000, true)],
  });

  console.log("Serviceable stores:", serviceableStores);

  // Add distance calculation to each store
  const storesWithDistance = serviceableStores.rows.map(
    (store): { name?: string; location?: number[]; distance?: number } => ({
      ...store,
      distance: Math.round(
        calculateDistance(
          userLat,
          userLon,
          store.location[1],
          store.location[0]
        )
      ),
    })
  );

  return NextResponse.json({
    deliveryLocation: { lat, lon },
    serviceableStores: storesWithDistance,
    totalStores: serviceableStores.total,
  });
}
