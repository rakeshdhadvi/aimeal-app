import { NextResponse } from "next/server"
import { getFoodByBarcode } from "@/lib/food-database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const barcode = searchParams.get("barcode")

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 })
  }

  try {
    const food = await getFoodByBarcode(barcode)

    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 })
    }

    return NextResponse.json(food)
  } catch (error) {
    console.error("Error fetching food by barcode:", error)
    return NextResponse.json({ error: "Failed to fetch food" }, { status: 500 })
  }
}
