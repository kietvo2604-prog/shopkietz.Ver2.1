import { useState } from "react";
import { ShoppingCart, Eye, Package, Loader2, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PurchaseConfirmDialog from "./PurchaseConfirmDialog";

interface ProductCardProps {
  id?: string;
  name: string;
  price: string;
  numericPrice?: number;
  stock: number;
  description: string;
  category: string;
  accountInfo?: string;
}

const ProductCard = ({ id, name, price, numericPrice, stock, description, category, accountInfo }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buying, setBuying] = useState(false);
  const [showAccDialog, setShowAccDialog] = useState(false);
  const [purchasedAccInfo, setPurchasedAccInfo] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const parsePrice = (p: string): number => parseInt(p.replace(/[^\d]/g, ""), 10) || 0;
  const finalPrice = numericPrice ?? parsePrice(price);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(purchasedAccInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = async () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
      return;
    }
    if (stock <= 0) {
      toast({ title: "Hết hàng", variant: "destructive" });
      return;
    }
    setBuying(true);

    const { data: profile } = await supabase.from("profiles").select("balance").eq("user_id", user.id).single();
    if (!profile || profile.balance < finalPrice) {
      setBuying(false);
      toast({ title: "❌ Số dư không đủ", description: "Vui lòng nạp thêm!", variant: "destructive" });
      return;
    }

    const { error: balanceError } = await supabase.from("profiles").update({ balance: profile.balance - finalPrice }).eq("user_id", user.id);
    if (balanceError) { setBuying(false); toast({ title: "Lỗi", variant: "destructive" }); return; }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const orderCode = "VAK" + Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: user.id, product_name: name, product_category: category,
      price: finalPrice, account_info: accountInfo || null, order_code: orderCode,
    } as any);

    if (orderError) {
      await supabase.from("profiles").update({ balance: profile.balance }).eq("user_id", user.id);
      setBuying(false);
      toast({ title: "Lỗi", description: "Đã hoàn tiền.", variant: "destructive" });
      return;
    }
    setBuying(false);

    if (accountInfo) {
      setPurchasedAccInfo(accountInfo);
      setShowAccDialog(true);
    } else {
      toast({ title: "✅ Mua hàng thành công!", description: `Mã đơn: ${orderCode}` });
      window.location.href = "/lich-su?tab=orders";
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:neon-card transition-all duration-300 group">
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
              {id && (
                <Link to={`/san-pham/${id}`} className="p-2 rounded-lg bg-muted hover:bg-border transition-colors" title="Chi tiết">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={buying || stock <= 0}
                className="flex items-center gap-1.5 px-3 py-2 gradient-primary rounded-lg text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {buying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                {buying ? "Đang mua..." : stock <= 0 ? "Hết hàng" : "Mua ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <PurchaseConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        productName={name}
        price={price}
        onConfirm={handleBuy}
        buying={buying}
      />

      {/* Account Info Dialog */}
      <Dialog open={showAccDialog} onOpenChange={(open) => {
        if (!open) { setShowAccDialog(false); window.location.href = "/lich-su?tab=orders"; }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">✅ Mua hàng thành công!</DialogTitle>
            <DialogDescription>Thông tin tài khoản của bạn. Hãy sao chép và lưu lại ngay!</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Sản phẩm:</p>
              <p className="text-sm text-foreground font-medium">{name}</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Thông tin tài khoản:</p>
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-all">{purchasedAccInfo}</pre>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 gradient-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Đã sao chép!" : "Sao chép"}
            </button>
            <button onClick={() => { setShowAccDialog(false); window.location.href = "/lich-su?tab=orders"; }}
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-border transition-colors">
              Đến lịch sử đơn hàng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
