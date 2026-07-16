import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  Clock, 
  User, 
  Lock, 
  Calendar,
  CreditCard,
  Package,
  FileText,
  Download,
  ChevronRight
} from "lucide-react";

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      setOrder(data);
      setLoading(false);
    };
    fetch();
  }, [user, id]);

  const handleCopy = async (text: string, index?: number) => {
    await navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập.</p>
          <a href="/dang-nhap" className="inline-block px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg text-sm">
            Đăng nhập
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng.</p>
          <Link to="/lich-su?tab=orders" className="inline-block px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg text-sm">
            Quay lại lịch sử
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const accountInfo = order.account_info || "";
  const lines = accountInfo.split("\n").filter((l: string) => l.trim());
  const quantity = lines.length || 1;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-5">
        {/* Quay lại */}
        <Link
          to="/lich-su?tab=orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>

        {/* Card chính */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          {/* Header - Mã đơn hàng */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-foreground">Chi tiết đơn hàng</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>#{order.order_code || order.id.slice(0, 10).toUpperCase()}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleTimeString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <span className="text-xs font-semibold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Thành công
                </span>
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-6 space-y-6">
            {/* Thông tin sản phẩm */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thông tin sản phẩm
              </h2>
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-base">{order.product_name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {order.product_category}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">
                        ✓ Giao ngay
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Số lượng</p>
                    <p className="font-bold text-lg text-foreground">x{quantity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Thông tin thanh toán
              </h2>
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex justify-between py-1.5">
                  <span className="text-sm text-muted-foreground">Giá gốc</span>
                  <span className="text-sm text-foreground">{formatVND(order.price)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-t border-border/50">
                  <span className="text-sm font-semibold text-foreground">Tổng thanh toán</span>
                  <span className="text-lg font-bold text-primary">{formatVND(order.price)}</span>
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Thông tin tài khoản
                </h2>
                <span className="text-xs text-muted-foreground">{quantity} tài khoản</span>
              </div>

              {accountInfo ? (
                <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
                  <div className="space-y-2">
                    {lines.map((line: string, i: number) => (
                      <div 
                        key={i} 
                        className="bg-background/80 border border-border rounded-lg p-3 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs font-bold text-primary shrink-0 w-6">
                            #{i + 1}
                          </span>
                          <span className="text-sm font-mono text-foreground truncate">
                            {line}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(line, i)}
                          className="p-1.5 rounded-md hover:bg-primary/10 transition-colors shrink-0"
                          title="Sao chép"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <button
                      onClick={() => handleCopy(accountInfo)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedAll ? "Đã sao chép tất cả!" : "Sao chép tất cả"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-border transition-colors">
                      <Download className="w-4 h-4" />
                      Xuất TXT
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-border transition-colors">
                      <Download className="w-4 h-4" />
                      Xuất CSV
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-6 text-center border border-border">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Chưa có thông tin tài khoản</p>
                  <p className="text-xs text-muted-foreground mt-1">Vui lòng liên hệ admin để được hỗ trợ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;