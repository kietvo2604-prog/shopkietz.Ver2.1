import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShoppingCart, Loader2, AlertTriangle } from "lucide-react";

interface PurchaseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  price: string;
  onConfirm: () => void;
  buying: boolean;
}

const PurchaseConfirmDialog = ({ open, onOpenChange, productName, price, onConfirm, buying }: PurchaseConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Xác nhận mua hàng
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn mua sản phẩm này không? Số dư sẽ bị trừ ngay lập tức.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1 font-semibold">Sản phẩm:</p>
            <p className="text-sm text-foreground font-medium">{productName}</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1 font-semibold">Số tiền bị trừ:</p>
            <p className="text-lg font-display font-bold text-destructive">{price}</p>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <button
            onClick={() => onOpenChange(false)}
            disabled={buying}
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-border transition-colors"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={() => { onConfirm(); onOpenChange(false); }}
            disabled={buying}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            {buying ? "Đang xử lý..." : "Xác nhận mua"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmDialog;
