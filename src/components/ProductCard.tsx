import { ShoppingCart, Eye, Package } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  stock: number;
  description: string;
  category: string;
}

const ProductCard = ({ name, price, stock, description, category }: ProductCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:neon-card transition-all duration-300 group">
      {/* Header badge */}
      <div className="gradient-primary px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">{category}</span>
        <div className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5 text-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground">Kho: {stock}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-display text-lg font-bold text-neon-orange">{price}</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-muted hover:bg-border transition-colors" title="Chi tiết">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 gradient-primary rounded-lg text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity">
              <ShoppingCart className="w-3.5 h-3.5" />
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
