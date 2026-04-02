import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Clock, CheckCircle, Loader2, AlertCircle, FileText } from "lucide-react";

type Order = {
  id: string;
  order_code: string | null;
  product_name: string;
  product_category: string;
  price: number;
  status: string;
  created_at: string;
};

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const PurchaseHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem lịch sử mua hàng.</p>
          <a href="/dang-nhap" className="inline-block px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg text-sm">Đăng nhập</a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary neon-text text-center">LỊCH SỬ MUA HÀNG</h1>
        <p className="text-center text-muted-foreground text-sm">Danh sách các tài khoản đã mua</p>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Chưa có lịch sử mua hàng.</p>
          </div>
        ) : (
          <div className="space-y-3 animate-slide-up">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-primary/20 rounded-xl p-4 neon-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{o.product_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">{o.product_category}</span>
                      {o.order_code && <span className="font-mono text-[10px] text-primary font-bold">{o.order_code}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(o.created_at).toLocaleString("vi-VN")}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/don-hang/${o.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors shrink-0">
                  <FileText className="w-3.5 h-3.5" />Chi tiết
                </Link>
                <div className="text-right shrink-0">
                  <p className="font-bold text-destructive text-sm">-{formatVND(o.price)}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-primary/10 border-primary/30 text-primary">
                    <CheckCircle className="w-3 h-3" /> Thành công
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
