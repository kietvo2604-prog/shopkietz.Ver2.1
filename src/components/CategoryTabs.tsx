import { useState } from "react";
import { Swords, Dices, Gem, Crown, Skull, Flame, Star, Package } from "lucide-react";

const categories = [
  { id: "all", name: "Tất cả sản phẩm", icon: Package },
  { id: "bloxfruits", name: "Acc Blox Fruits", icon: Swords },
  { id: "random", name: "Acc Random", icon: Dices },
  { id: "robux", name: "Nạp Robux", icon: Gem },
  { id: "maxlevel", name: "Max Level", icon: Crown },
  { id: "godrace", name: "God + Race V4", icon: Skull },
  { id: "fruit", name: "Fruit Inventory", icon: Flame },
  { id: "vip", name: "VIP Acc", icon: Star },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "gradient-primary text-primary-foreground neon-border"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border"
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
