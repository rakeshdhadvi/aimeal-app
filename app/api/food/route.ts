import { NextResponse } from "next/server";
import { searchFoodByName, commonFoods } from "@/lib/food-database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.length < 3) {
    // If no query or very short query, return local foods
    return NextResponse.json({ items: commonFoods, total: commonFoods.length });
  }

  try {
    const result = await searchFoodByName(query);

    // If API search returns empty, fallback to commonFoods
    if (result.items.length === 0) {
      return NextResponse.json({ items: commonFoods, total: commonFoods.length });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching food:", error);
    return NextResponse.json({ items: commonFoods, total: commonFoods.length });
  }
}
