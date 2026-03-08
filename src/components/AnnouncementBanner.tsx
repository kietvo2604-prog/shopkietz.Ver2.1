import { Shield, MessageCircle, Users, ArrowRight } from "lucide-react";

const AnnouncementBanner = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 neon-card">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">CHÍNH SÁCH BẢO HÀNH</span>
          <a href="#policy" className="text-primary font-bold hover:underline flex items-center gap-1">
            TẠI ĐÂY <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-secondary" />
          <span className="font-semibold text-foreground">FAQ NHỮNG CÂU HỎI THƯỜNG GẶP</span>
          <a href="#faq" className="text-secondary font-bold hover:underline flex items-center gap-1">
            TẠI ĐÂY <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-neon-orange" />
          <span className="font-semibold text-foreground">LIÊN HỆ HỖ TRỢ QUA ZALO</span>
          <a href="#contact" className="text-neon-orange font-bold hover:underline flex items-center gap-1">
            TẠI ĐÂY <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-lg font-bold">
          <span className="text-primary font-display neon-text">SHOPKIETZ</span>
          <span className="text-muted-foreground"> - SHOP </span>
          <span className="text-neon-cyan neon-cyan-text">ACC BLOX FRUITS</span>
          <span className="text-muted-foreground">, </span>
          <span className="text-neon-orange">ACC RANDOM</span>
          <span className="text-muted-foreground">, </span>
          <span className="text-neon-red">ROBUX</span>
          <span className="text-muted-foreground"> UY TÍN</span>
        </p>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>🔥 Giao dịch tự động 24/7 – Mua là có ngay</p>
          <p>🛡️ Bảo mật tuyệt đối – Cam kết uy tín</p>
          <p>💰 Giá cả học sinh – Chất lượng hàng đầu</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
