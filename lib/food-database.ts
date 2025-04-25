// Food database API utilities using Open Food Facts (free and open source)

export interface FoodItem {
  id: string
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  serving_size?: string
  image_url?: string
  barcode?: string
}

export interface SearchResult {
  items: FoodItem[]
  total: number
}

const API_URL = "https://world.openfoodfacts.org/api/v0"

export async function searchFoodByName(query: string): Promise<SearchResult> {
  try {
    const response = await fetch(`${API_URL}/search?search_terms=${encodeURIComponent(query)}&json=true`)

    if (!response.ok) {
      throw new Error("Failed to fetch food data")
    }

    const data = await response.json()

    // Transform the Open Food Facts data to our FoodItem format
    const items: FoodItem[] = data.products.map((product: any) => ({
      id: product._id || product.code,
      name: product.product_name || "Unknown Food",
      brand: product.brands,
      calories: Number.parseFloat(product.nutriments["energy-kcal_100g"] || "0"),
      protein: Number.parseFloat(product.nutriments.proteins_100g || "0"),
      carbs: Number.parseFloat(product.nutriments.carbohydrates_100g || "0"),
      fat: Number.parseFloat(product.nutriments.fat_100g || "0"),
      fiber: Number.parseFloat(product.nutriments.fiber_100g || "0"),
      serving_size: product.serving_size,
      image_url: product.image_url,
      barcode: product.code,
    }))

    return {
      items,
      total: data.count,
    }
  } catch (error) {
    console.error("Error searching food:", error)
    return { items: [], total: 0 }
  }
}

export async function getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const response = await fetch(`${API_URL}/product/${barcode}.json`)

    if (!response.ok) {
      throw new Error("Failed to fetch food data")
    }

    const data = await response.json()

    if (!data.product) {
      return null
    }

    const product = data.product

    return {
      id: product._id || product.code,
      name: product.product_name || "Unknown Food",
      brand: product.brands,
      calories: Number.parseFloat(product.nutriments["energy-kcal_100g"] || "0"),
      protein: Number.parseFloat(product.nutriments.proteins_100g || "0"),
      carbs: Number.parseFloat(product.nutriments.carbohydrates_100g || "0"),
      fat: Number.parseFloat(product.nutriments.fat_100g || "0"),
      fiber: Number.parseFloat(product.nutriments.fiber_100g || "0"),
      serving_size: product.serving_size,
      image_url: product.image_url,
      barcode: product.code,
    }
  } catch (error) {
    console.error("Error fetching food by barcode:", error)
    return null
  }
}

// Mock data for common foods (as a fallback)
export const commonFoods: FoodItem[] = [
  {
    id: "1",
    name: "Apple",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    serving_size: "1 medium (182g)",
    image_url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=320",
  },
  {
    id: "2",
    name: "Banana",
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    serving_size: "1 medium (118g)",
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=320",
  },
  {
    id: "3",
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving_size: "100g",
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=320",
  },
  {
    id: "4",
    name: "Oatmeal",
    calories: 68,
    protein: 2.5,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    serving_size: "100g cooked",
    image_url: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=320",
  },
  {
    id: "5",
    name: "Avocado",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    serving_size: "1/2 medium (68g)",
    image_url: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=320",
  },
]
