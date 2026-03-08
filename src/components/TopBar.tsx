import { Shield, HelpCircle, Phone } from "lucide-react";

const TopBar = () => {
  return (
    <div className="gradient-accent py-2 px-4">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <p className="font-semibold tracking-wide text-accent-foreground">
          🎮 ShopKietZ - Thiên đường ACC Roblox uy tín hàng đầu!
        </p>
        <div className="hidden md:flex items-center gap-6 text-accent-foreground">
          <a href="#policy" className="flex items-center gap-1 hover:underline">
            <Shield className="w-3.5 h-3.5" /> Chính sách
          </a>
          <a href="#faq" className="flex items-center gap-1 hover:underline">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </a>
          <a href="#contact" className="flex items-center gap-1 hover:underline">
            <Phone className="w-3.5 h-3.5" /> Liên hệ
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
