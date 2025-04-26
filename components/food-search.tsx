"use client";

import { debounce } from "lodash"; 
import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type FoodItem, commonFoods } from "@/lib/food-database";

// Cache for API results - will persist between renders
const apiCache: Record<string, {timestamp: number, data: FoodItem[]}> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface FoodSearchProps {
  onFoodSelected: (food: FoodItem) => void;
  selectedFoods?: FoodItem[];
  onRemoveFood?: (foodId: string) => void;
}

export function FoodSearch({ 
  onFoodSelected, 
  selectedFoods = [], 
  onRemoveFood 
}: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    setResults(commonFoods);
  }, []);

  // Perform local search
  const performLocalSearch = useCallback((searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) return commonFoods;
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    return commonFoods.filter((food) =>
      food.name.toLowerCase().includes(normalizedTerm)
    );
  }, []);

  // Check cache for existing results
  const checkCache = (searchTerm: string): FoodItem[] | null => {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    const cachedResult = apiCache[normalizedTerm];
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      console.log("Using cached result for:", normalizedTerm);
      return cachedResult.data;
    }
    
    return null;
  };

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults(commonFoods);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const normalizedQuery = query.trim();

    try {
      console.log("Searching for:", normalizedQuery);
      
      // First check cache
      const cachedResults = checkCache(normalizedQuery);
      if (cachedResults) {
        setResults(cachedResults);
        setIsLoading(false);
        return;
      }
      
      // Then try local search
      const localResults = performLocalSearch(normalizedQuery);
      
      // If we have local results, use them immediately
      if (localResults.length > 0) {
        // Cache the local results too
        apiCache[normalizedQuery.toLowerCase()] = {
          timestamp: Date.now(),
          data: localResults
        };
        
        setResults(localResults);
        setIsLoading(false);
        return;
      }

      // We only get here if no local results were found
      // Just return an empty array instead of making API call that would fail
      setResults([]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching foods:", error);
      // Fallback to local search
      const localResults = performLocalSearch(normalizedQuery);
      setResults(localResults);
      setIsLoading(false);
    }
  }, [query, performLocalSearch]);

  // Debounce the search to reduce unnecessary processing
  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300), 
    [handleSearch]
  );

  // Cancel debounced search when component unmounts
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (!e.target.value.trim()) {
      setResults(commonFoods);
      setError(null);
    } else {
      debouncedHandleSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      debouncedHandleSearch.cancel(); // Cancel pending debounced calls
      handleSearch();
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setJustAdded(food.id);
    onFoodSelected(food);
    
    // Clear the "just added" state after animation finishes
    setTimeout(() => {
      setJustAdded(null);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Display selected foods as removable badges */}
      {selectedFoods && selectedFoods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFoods.map((food) => (
            <Badge 
              key={food.id} 
              variant="secondary"
              className={`pl-2 pr-1 py-1 flex items-center gap-1 transition-all duration-300 ${
                justAdded === food.id ? "animate-fade-in" : ""
              }`}
            >
              {food.name}
              {onRemoveFood && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 rounded-full hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFood(food.id);
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-9 pr-20"
        />
        <Button
          size="sm"
          onClick={() => {
            debouncedHandleSearch.cancel(); // Cancel pending debounced calls
            handleSearch();
          }}
          disabled={isLoading}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {results.length > 0 ? (
          results.map((food) => (
            <div
              key={food.id}
              className="animate-fade-in"
            >
              <Card
                className="border-none shadow-sm cursor-pointer hover:bg-accent transition-colors duration-200"
                onClick={() => handleFoodSelect(food)}
              >
                <CardContent className="p-3 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={food.image_url || "/placeholder.jpg"}
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{food.name}</p>
                    {food.brand && (
                      <p className="text-xs text-muted-foreground truncate">{food.brand}</p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">{food.calories}</span> kcal
                      {food.serving_size && (
                        <span className="text-xs text-muted-foreground ml-1">
                          per {food.serving_size}
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          query.trim() !== "" && (
            <div className="text-center py-6 text-muted-foreground">
              No foods found. Try a different search term.
            </div>
          )
        )}
      </div>

      {/* Add required CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}