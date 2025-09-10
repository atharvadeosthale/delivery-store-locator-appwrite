import { tablesdb } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function GET() {
  const stores = await tablesdb.listRows({
    databaseId: "ecommerce",
    tableId: "stores",
  });

  console.log(JSON.stringify(stores.rows, null, 2));

  return NextResponse.json(stores.rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, location } = body;

  if (
    !name ||
    !location ||
    location.lat === undefined ||
    location.lon === undefined
  ) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }

  const store = await tablesdb.createRow({
    databaseId: "ecommerce",
    tableId: "stores",
    rowId: ID.unique(),
    data: { name, location: [location.lat, location.lon] },
  });

  return NextResponse.json({
    success: true,
    message: "Store created (dummy)",
    data: { $id: store.$id, name, location },
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }

  const store = await tablesdb.deleteRow({
    databaseId: "ecommerce",
    tableId: "stores",
    rowId: id,
  });

  return NextResponse.json({
    success: true,
    message: `Store ${id} deleted (dummy)`,
  });
}
