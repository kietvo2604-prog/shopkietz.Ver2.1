import { useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import CategoryTabs from "@/components/CategoryTabs";
import ProductSection from "@/components/ProductSection";
import PolicySection from "@/components/PolicySection";
import TopUpGuide from "@/components/TopUpGuide";
import Footer from "@/components/Footer";

const products = {
  bloxfruits: [
    { name: "GOD + SGT + CDK + RACE CYBORG V4 FULL GEAR (IP GLOBAL)", price: "42.000đ", stock: 18, description: "Định dạng: Tk/Mk/Cookie (Warranty 7 Day)", category: "Blox Fruits" },
    { name: "God_Skin Fiend Yeti (IP GLOBAL)", price: "110.000đ", stock: 1, description: "Format: Username:Password:Cookie | Warranty 7 Days", category: "Blox Fruits" },
    { name: "Level 2800 + Godhuman + CDK + Race Cyborg Full Gear + 1 Fruit Mythical", price: "40.000đ", stock: 5, description: "Username:Pass:Cookie | Bảo hành 72h", category: "Blox Fruits" },
    { name: "Acc Blox Fruits Max Level + Full Mastery + Dragon", price: "85.000đ", stock: 12, description: "Full vật phẩm hiếm | Bảo hành 7 ngày", category: "Blox Fruits" },
    { name: "Acc Blox Fruits Race V4 + CDK + Godhuman", price: "55.000đ", stock: 8, description: "Tài khoản chất lượng cao | Bảo hành 72h", category: "Blox Fruits" },
    { name: "Acc Blox Fruits Full Gear + Kitsune + Leopard", price: "120.000đ", stock: 3, description: "Siêu VIP | Warranty 7 Days", category: "Blox Fruits" },
  ],
  random: [
    { name: "Acc Random Blox Fruits - Vận May Cao", price: "15.000đ", stock: 50, description: "Cơ hội nhận acc VIP | Tỉ lệ trúng cao", category: "Random" },
    { name: "Acc Random VIP - Tỉ Lệ God 30%", price: "25.000đ", stock: 30, description: "Tỉ lệ trúng God Human, CDK, Race V4 cao", category: "Random" },
    { name: "Acc Random Premium - Cam Kết Giá Trị", price: "50.000đ", stock: 20, description: "Giá trị tối thiểu 100k | Bảo hành đổi trả", category: "Random" },
    { name: "Acc Random Siêu Rẻ - Dành Cho Học Sinh", price: "10.000đ", stock: 100, description: "Giá rẻ nhất thị trường | Chất lượng ổn", category: "Random" },
  ],
  robux: [
    { name: "Nạp 100 Robux (Sạch 100%)", price: "25.000đ", stock: 999, description: "Robux sạch, an toàn tuyệt đối", category: "Robux" },
    { name: "Nạp 400 Robux (Sạch 100%)", price: "90.000đ", stock: 999, description: "Robux sạch, giao tự động", category: "Robux" },
    { name: "Nạp 800 Robux (Sạch 100%)", price: "170.000đ", stock: 999, description: "Robux sạch, uy tín hàng đầu", category: "Robux" },
    { name: "Nạp 1700 Robux (Sạch 100%)", price: "340.000đ", stock: 999, description: "Robux sạch, giá tốt nhất", category: "Robux" },
  ],
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Announcement */}
        <AnnouncementBanner />

        {/* Categories */}
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        {/* Products */}
        {(activeCategory === "all" || activeCategory === "bloxfruits") && (
          <ProductSection title="ACC BLOX FRUITS" products={products.bloxfruits} />
        )}
        {(activeCategory === "all" || activeCategory === "random") && (
          <ProductSection title="ACC RANDOM - VẬN MAY CAO" products={products.random} />
        )}
        {(activeCategory === "all" || activeCategory === "robux") && (
          <ProductSection title="NẠP ROBUX SẠCH 100%" products={products.robux} />
        )}

        {/* Policy & TopUp */}
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
