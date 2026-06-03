import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

type Category = { id: string; name: string; slug: string; sort_order: number; image_url: string | null };

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => {
      setCategories((data as Category[]) || []);
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange("all")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
          activeCategory === "all"
            ? "bg-yellow-400 text-yellow-950 border-yellow-500 shadow-md"
            : "bg-foreground text-background border-foreground hover:opacity-80"
        }`}
      >
        <Package className="w-4 h-4" />
        Tất cả sản phẩm
      </button>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
              isActive
                ? "bg-yellow-400 text-yellow-950 border-yellow-500 shadow-md"
                : "bg-foreground text-background border-foreground hover:opacity-80"
            }`}
          >
            {cat.image_url ? (
              <div className="w-6 h-6 rounded overflow-hidden shrink-0 bg-background flex items-center justify-center border border-border">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </div>
            ) : (
              <div className="w-6 h-6 rounded bg-background/20 flex items-center justify-center shrink-0">
                <Package className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="uppercase">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
