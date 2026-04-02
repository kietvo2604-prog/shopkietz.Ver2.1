import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Loader2, AlertCircle } from "lucide-react";

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const BalanceHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileBalance, setProfileBalance] = useState(0);
  const [totalTopup, setTotalTopup] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [balanceEvents, setBalanceEvents] = useState<{ id: string; type: "topup" | "purchase"; label: string; amount: number; date: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [topupRes, profileRes, ordersRes] = await Promise.all([
        supabase.from("topup_requests").select("*").eq("user_id", user.id).eq("status", "approved").order("created_at", { ascending: false }),
        supabase.from("profiles").select("balance").eq("user_id", user.id).single(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      const topups = topupRes.data || [];
      const orders = ordersRes.data || [];

      setProfileBalance(profileRes.data?.balance || 0);
      setTotalTopup(topups.reduce((s: number, t: any) => s + t.amount, 0));
      setTotalSpent(orders.reduce((s: number, o: any) => s + o.price, 0));

      const events = [
        ...topups.map((t: any) => ({ id: t.id, type: "topup" as const, label: t.method, amount: t.amount, date: t.created_at })),
        ...orders.map((o: any) => ({ id: o.id, type: "purchase" as const, label: o.product_name, amount: o.price, date: o.created_at })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setBalanceEvents(events);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem biến động số dư.</p>
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
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary neon-text text-center">BIẾN ĐỘNG SỐ DƯ</h1>
        <p className="text-center text-muted-foreground text-sm">Theo dõi chi tiết biến động số dư tài khoản</p>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 neon-card text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"><Wallet className="w-6 h-6 text-primary" /></div>
                <p className="text-xs text-muted-foreground mb-1">Số dư hiện tại</p>
                <p className="font-display text-xl font-bold text-primary neon-text">{formatVND(profileBalance)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 neon-card text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3"><ArrowDownLeft className="w-6 h-6 text-secondary" /></div>
                <p className="text-xs text-muted-foreground mb-1">Tổng nạp thành công</p>
                <p className="font-display text-xl font-bold text-secondary neon-cyan-text">{formatVND(totalTopup)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 neon-card text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3"><ArrowUpRight className="w-6 h-6 text-accent" /></div>
                <p className="text-xs text-muted-foreground mb-1">Tổng chi tiêu</p>
                <p className="font-display text-xl font-bold text-accent">{formatVND(totalSpent)}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 neon-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Biến động gần đây</h3>
              </div>
              {balanceEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Chưa có biến động nào.</p>
              ) : (
                <div className="space-y-0">
                  {balanceEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        {event.type === "topup" ? <ArrowDownLeft className="w-4 h-4 text-primary" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
                        <div>
                          <p className="text-sm text-foreground">{event.label}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(event.date).toLocaleString("vi-VN")}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm ${event.type === "topup" ? "text-primary" : "text-destructive"}`}>
                        {event.type === "topup" ? `+${formatVND(event.amount)}` : `-${formatVND(event.amount)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BalanceHistory;
