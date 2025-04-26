import { NextResponse } from "next/server";
import { searchFoodByName, commonFoods } from "@/lib/food-database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ items: commonFoods, total: commonFoods.length });
  }

  try {
    const result = await searchFoodByName(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching food:", error);
    return NextResponse.json({ error: "Failed to search food" }, { status: 500 });
  }
}
