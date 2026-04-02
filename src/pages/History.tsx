import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ShoppingBag, Wallet, TrendingUp, Loader2, AlertCircle } from "lucide-react";

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redirect old tab URLs to new pages
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders" || tab === "history") navigate("/lich-su-mua", { replace: true });
    else if (tab === "activity") navigate("/lich-su-nap", { replace: true });
    else if (tab === "balance") navigate("/bien-dong-so-du", { replace: true });
  }, [searchParams, navigate]);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem lịch sử giao dịch.</p>
          <a href="/dang-nhap" className="inline-block px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-lg text-sm">Đăng nhập</a>
        </main>
        <Footer />
      </div>
    );
  }

  const pages = [
    { to: "/lich-su-nap", icon: Wallet, title: "Lịch sử nạp tiền", desc: "Xem tất cả giao dịch nạp tiền" },
    { to: "/lich-su-mua", icon: ShoppingBag, title: "Lịch sử mua hàng", desc: "Xem danh sách tài khoản đã mua" },
    { to: "/bien-dong-so-du", icon: TrendingUp, title: "Biến động số dư", desc: "Theo dõi chi tiết biến động số dư" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary neon-text text-center">LỊCH SỬ GIAO DỊCH</h1>
        <p className="text-center text-muted-foreground text-sm">Chọn mục bạn muốn xem</p>

        <div className="grid gap-4 md:grid-cols-3">
          {pages.map((p) => (
            <Link key={p.to} to={p.to} className="bg-card border border-border rounded-xl p-6 neon-card text-center hover:border-primary/50 transition-all group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <p.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
