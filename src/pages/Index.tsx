import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import CategoryTabs from "@/components/CategoryTabs";
import ProductSection from "@/components/ProductSection";
import PolicySection from "@/components/PolicySection";
import TopUpGuide from "@/components/TopUpGuide";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  category: string;
  account_info: string | null;
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false });
      setProducts((data as Product[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const grouped: Record<string, Product[]> = {};
  products.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const categoryMap: Record<string, string> = {
    "Blox Fruits": "bloxfruits",
    "Random": "random",
    "Robux": "robux",
    "Gamepass": "gamepass",
    "Khác": "other",
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <AnnouncementBanner />
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">Chưa có sản phẩm nào.</div>
        ) : (
          Object.entries(grouped).map(([category, prods]) => {
            const catKey = categoryMap[category] || category.toLowerCase();
            if (activeCategory !== "all" && activeCategory !== catKey) return null;
            return (
              <ProductSection
                key={category}
                title={category.toUpperCase()}
                products={prods.map((p) => ({
                  id: p.id,
                  name: p.name,
                  price: p.price.toLocaleString("vi-VN") + "đ",
                  numericPrice: p.price,
                  stock: p.stock,
                  description: p.description || "",
                  category: p.category,
                  accountInfo: p.account_info || undefined,
                }))}
              />
            );
          })
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <PolicySection />
          <TopUpGuide />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
