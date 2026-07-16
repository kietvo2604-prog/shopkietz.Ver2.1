import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShoppingCart, Loader2, AlertTriangle, Minus, Plus, Tag, CheckCircle, XCircle, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  price: string;
  numericPrice: number;
  stock: number;
  onConfirm: (quantity: number, discountCode?: string) => void;
  buying: boolean;
}

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const PurchaseConfirmDialog = ({ 
  open, 
  onOpenChange, 
  productName, 
  price, 
  numericPrice, 
  stock, 
  onConfirm, 
  buying 
}: PurchaseConfirmDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<any>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setDiscountCode("");
      setDiscountInfo(null);
      setCodeError("");
      setCodeSuccess(false);
    }
  }, [open]);

  const totalBeforeDiscount = numericPrice * quantity;
  let discountAmount = 0;
  let discountPercent = 0;
  
  if (discountInfo) {
    if (discountInfo.discount_percent > 0) {
      discountPercent = discountInfo.discount_percent;
      discountAmount += Math.floor(totalBeforeDiscount * discountPercent / 100);
    }
    if (discountInfo.discount_amount > 0) {
      discountAmount += discountInfo.discount_amount;
    }
  }
  
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountAmount);
  const isDiscountApplied = discountAmount > 0;

  const handleApplyCode = async () => {
    if (!discountCode.trim()) return;
    setCheckingCode(true);
    setCodeError("");
    setDiscountInfo(null);
    setCodeSuccess(false);

    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", discountCode.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    setCheckingCode(false);

    if (error || !data) {
      setCodeError("❌ Mã giảm giá không hợp lệ");
      return;
    }

    if (data.max_uses && data.used_count >= data.max_uses) {
      setCodeError("❌ Mã giảm giá đã hết lượt sử dụng");
      return;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCodeError("❌ Mã giảm giá đã hết hạn");
      return;
    }

    if (data.min_order_amount > 0 && totalBeforeDiscount < data.min_order_amount) {
      setCodeError(`❌ Đơn tối thiểu ${formatVND(data.min_order_amount)}`);
      return;
    }

    setDiscountInfo(data);
    setCodeSuccess(true);
  };

  const handleRemoveCode = () => {
    setDiscountInfo(null);
    setDiscountCode("");
    setCodeSuccess(false);
    setCodeError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/30 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-xl font-bold">
                Xác nhận đơn hàng
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Kiểm tra thông tin trước khi thanh toán
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin sản phẩm */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
              🛍️ Sản phẩm
            </p>
            <p className="text-base font-semibold text-foreground">{productName}</p>
            <p className="text-sm text-primary font-bold mt-1">{price}</p>
          </div>

          {/* Chọn số lượng */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                📦 Số lượng
              </p>
              <p className="text-xs text-muted-foreground">Tối đa: {stock}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-30"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(stock, Number(e.target.value) || 1));
                  setQuantity(v);
                }}
                min={1}
                max={stock}
                className="w-20 text-center bg-card border border-border rounded-xl py-2 text-foreground font-bold text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all disabled:opacity-30"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Mã giảm giá */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Mã giảm giá
              </p>
              {isDiscountApplied && (
                <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  ✅ Đã áp dụng
                </span>
              )}
            </div>
            
            {!isDiscountApplied ? (
              <div className="flex gap-2">
                <input
                  value={discountCode}
                  onChange={(e) => { 
                    setDiscountCode(e.target.value.toUpperCase()); 
                    setDiscountInfo(null); 
                    setCodeError("");
                    setCodeSuccess(false);
                  }}
                  placeholder="Nhập mã giảm giá..."
                  className="flex-1 bg-card border border-border rounded-lg py-2.5 px-3 text-foreground text-sm uppercase tracking-wider focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={handleApplyCode}
                  disabled={checkingCode || !discountCode.trim()}
                  className="px-4 py-2.5 gradient-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {checkingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "Áp dụng"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {discountInfo.code}
                  </span>
                  <span className="text-xs text-primary font-bold">
                    Giảm {discountInfo.discount_percent > 0 ? `${discountInfo.discount_percent}%` : ""}
                    {discountInfo.discount_percent > 0 && discountInfo.discount_amount > 0 ? " + " : ""}
                    {discountInfo.discount_amount > 0 ? formatVND(discountInfo.discount_amount) : ""}
                  </span>
                </div>
                <button
                  onClick={handleRemoveCode}
                  className="text-xs text-destructive hover:text-destructive/70 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            
            {codeError && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-destructive">
                <XCircle className="w-3.5 h-3.5" />
                <span>{codeError}</span>
              </div>
            )}
          </div>

          {/* Tổng tiền */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                💰 Tổng thanh toán
              </p>
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            {isDiscountApplied ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground line-through">{formatVND(totalBeforeDiscount)}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-display font-bold text-primary">{formatVND(totalAfterDiscount)}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    Tiết kiệm {formatVND(discountAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-2xl font-display font-bold text-destructive">{formatVND(totalBeforeDiscount)}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {quantity} x {formatVND(numericPrice)}
              {isDiscountApplied && ` - Giảm ${formatVND(discountAmount)}`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={() => onOpenChange(false)}
            disabled={buying}
            className="w-full sm:w-auto px-6 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-border transition-all disabled:opacity-50"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={() => onConfirm(quantity, discountInfo ? discountInfo.code : undefined)}
            disabled={buying || stock <= 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 gradient-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            {buying ? "Đang xử lý..." : `Mua ngay (${quantity})`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmDialog;