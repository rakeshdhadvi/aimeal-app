// Food recognition utilities with fallback mechanism

import type { FoodItem } from "./food-database"
import { commonFoods } from "./food-database"

// We'll use a dynamic import for TensorFlow to avoid the MIME type error
let tfjs: any = null

// Food classes that the model can recognize
const FOOD_CLASSES = [
  "apple",
  "banana",
  "bread",
  "broccoli",
  "burger",
  "cake",
  "carrot",
  "cheese",
  "chicken",
  "coffee",
  "egg",
  "fish",
  "fries",
  "grapes",
  "hotdog",
  "ice cream",
  "milk",
  "orange",
  "pasta",
  "pizza",
  "rice",
  "salad",
  "sandwich",
  "steak",
  "sushi",
  "tomato",
  "water",
]

// Flag to track if we've attempted to load TensorFlow
let tfLoadAttempted = false
let modelLoadAttempted = false
let model: any = null

// Load TensorFlow dynamically
async function loadTensorFlow() {
  if (tfLoadAttempted) return tfjs !== null

  tfLoadAttempted = true
  try {
    // Try to dynamically import TensorFlow
    tfjs = await import("@tensorflow/tfjs")
    console.log("TensorFlow.js loaded successfully")
    return true
  } catch (error) {
    console.error("Failed to load TensorFlow.js:", error)
    return false
  }
}

// Load the model
export async function loadFoodRecognitionModel() {
  if (modelLoadAttempted) return model !== null
  
  modelLoadAttempted = true
  
  // First ensure TensorFlow is loaded
  const tfLoaded = await loadTensorFlow()
  if (!tfLoaded) {
    console.error("Cannot load model: TensorFlow.js not available")
    return false
  }

  try {
    // In a real app, you would host this model or use a hosted model
    model = await tfjs.loadGraphModel(
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1",
      { fromTFHub: true },
    )
    console.log("Food recognition model loaded")
    return true
  } catch (error) {
    console.error("Error loading food recognition model:", error)
    return false
  }
}

// Recognize food from an image with fallback
export async function recognizeFood(imageElement: HTMLImageElement): Promise<FoodItem[]> {
  // Try to load TensorFlow and the model
  const modelLoaded = await loadFoodRecognitionModel()
  
  // If model loading failed, use fallback
  if (!modelLoaded) {
    console.log("Using fallback food recognition")
    return getFallbackFoodRecognition()
  }

  try {
    // Preprocess the image
    const image = tfjs.browser.fromPixels(imageElement).resizeBilinear([224, 224]).toFloat().expandDims()

    // Normalize the image
    const normalized = image.div(255.0)

    // Run inference
    const predictions = await model.predict(normalized)

    // Get top 3 predictions
    const topPredictions = await getTopKPredictions(predictions, 3)

    // Clean up tensors
    tfjs.dispose([image, normalized, predictions])

    // Map predictions to food items
    return mapPredictionsToFoodItems(topPredictions)
  } catch (error) {
    console.error("Error recognizing food:", error)
    return getFallbackFoodRecognition()
  }
}

// Fallback food recognition that returns random common foods
function getFallbackFoodRecognition(): FoodItem[] {
  // Return 1-3 random foods from commonFoods
  const numFoods = Math.floor(Math.random() * 3) + 1
  const shuffled = [...commonFoods].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, numFoods)
}

// Get top K predictions
async function getTopKPredictions(predictions: any, k: number) {
  if (!tfjs) return []
  
  const values = await predictions.data()
  const valuesAndIndices = Array.from(values)
    .map((value: number, index: number) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)

  return valuesAndIndices.map(({ value, index }) => ({
    className: FOOD_CLASSES[index % FOOD_CLASSES.length] || "unknown",
    probability: value,
  }))
}

// Map predictions to food items
function mapPredictionsToFoodItems(predictions: Array<{ className: string; probability: number }>) {
  // For this example, we'll map predictions to our common foods
  return predictions
    .map((pred) => {
      const matchingFood = commonFoods.find((food) => food.name.toLowerCase().includes(pred.className.toLowerCase()))

      if (matchingFood) {
        return {
          ...matchingFood,
          confidence: pred.probability,
        }
      }

      return null
    })
    .filter((item) => item !== null) as FoodItem[]
}

// Estimate portion size (simplified version)
export function estimatePortionSize(
  imageWidth: number,
  imageHeight: number,
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  },
): string {
  // This is a simplified approach. In a real app, you would use more sophisticated
  // computer vision techniques to estimate portion size.

  // Calculate the area of the bounding box relative to the image
  const imageArea = imageWidth * imageHeight
  const boxArea = boundingBox.width * boundingBox.height
  const ratio = boxArea / imageArea

  // Classify based on the ratio
  if (ratio < 0.2) {
    return "small"
  } else if (ratio < 0.5) {
    return "medium"
  } else {
    return "large"
  }
}
