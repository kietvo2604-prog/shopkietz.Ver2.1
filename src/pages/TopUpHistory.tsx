import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, CheckCircle, XCircle, Loader2, AlertCircle, Wallet } from "lucide-react";

type TopupRequest = {
  id: string;
  amount: number;
  method: string;
  status: string;
  note: string | null;
  created_at: string;
};

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const TopUpHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTopups = async () => {
      setLoading(true);
      const { data } = await supabase.from("topup_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setTopups(data || []);
      setLoading(false);
    };
    fetchTopups();
  }, [user]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-accent/10 border-accent/30 text-accent"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case "approved":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-primary/10 border-primary/30 text-primary"><CheckCircle className="w-3 h-3" /> Đã duyệt</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-destructive/10 border-destructive/30 text-destructive"><XCircle className="w-3 h-3" /> Từ chối</span>;
      default:
        return null;
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem lịch sử nạp tiền.</p>
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
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary neon-text text-center">LỊCH SỬ NẠP TIỀN</h1>
        <p className="text-center text-muted-foreground text-sm">Theo dõi tất cả các giao dịch nạp tiền</p>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : topups.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Chưa có hoạt động nạp tiền nào.</p>
          </div>
        ) : (
          <div className="space-y-3 animate-slide-up">
            {topups.map((t) => (
              <div key={t.id} className={`bg-card border rounded-xl p-4 neon-card flex items-center justify-between gap-4 ${t.status === "approved" ? "border-primary/30" : t.status === "rejected" ? "border-destructive/30" : "border-border"}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.status === "approved" ? "bg-primary/10" : t.status === "rejected" ? "bg-destructive/10" : "bg-accent/10"}`}>
                    {t.status === "approved" ? <CheckCircle className="w-5 h-5 text-primary" /> : t.status === "rejected" ? <XCircle className="w-5 h-5 text-destructive" /> : <Clock className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">{t.method}</p>
                    {t.note && <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px] md:max-w-[350px]">{t.note}</p>}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" />{new Date(t.created_at).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-sm ${t.status === "approved" ? "text-primary" : t.status === "rejected" ? "text-destructive line-through" : "text-accent"}`}>
                    {t.status === "rejected" ? "" : "+"}{formatVND(t.amount)}
                  </p>
                  {statusBadge(t.status)}
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

export default TopUpHistory;
