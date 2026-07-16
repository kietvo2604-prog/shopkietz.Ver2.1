import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle, Search, ClipboardList } from "lucide-react";

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

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const PurchaseHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00a2e8]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem lịch sử mua hàng.</p>
          <a href="/dang-nhap" className="inline-block px-6 py-3 bg-[#00a2e8] text-white font-semibold rounded-lg text-sm hover:bg-[#008cc8] transition-colors">
            Đăng nhập
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const countStatus = (status: string) => orders.filter(o => o.status === status).length;

  let filtered = orders;
  if (activeTab !== "all") {
    filtered = filtered.filter(o => o.status === activeTab);
  }
  if (searchQuery.trim()) {
    filtered = filtered.filter(
      o =>
        o.order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <TopBar />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00a2e8] text-white rounded-lg">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Đơn hàng của tôi</h1>
                <p className="text-xs text-gray-500 mt-0.5">Tổng cộng {orders.length} đơn hàng</p>
              </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="flex items-center w-full md:w-auto">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn hàng, tên sản phẩm..."
                className="bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#00a2e8] focus:bg-white w-full md:w-64 transition-all"
              />
              <button className="bg-[#00a2e8] text-white px-5 py-2 rounded-r-lg text-sm font-semibold hover:bg-[#008cc8] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <Search className="w-4 h-4" /> Tìm kiếm
              </button>
            </div>
          </div>

          {/* Hàng Tabs Trạng thái */}
          <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tất cả", count: orders.length },
              { id: "pending", label: "Chờ xử lý", count: countStatus("pending") },
              { id: "processing", label: "Đang xử lý", count: countStatus("processing") },
              { id: "completed", label: "Hoàn thành", count: countStatus("completed") },
              { id: "cancelled", label: "Đã hủy", count: countStatus("cancelled") },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  activeTab === tab.id
                    ? "bg-[#00a2e8] text-white border-[#00a2e8] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Bảng danh sách đơn hàng */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#00a2e8]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#00a2e8] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="text-center px-4 py-3.5 border-r border-[#008cc8] w-28">Chi tiết</th>
                    <th className="text-left px-5 py-3.5 border-r border-[#008cc8]">Sản phẩm</th>
                    <th className="text-left px-5 py-3.5 border-r border-[#008cc8] w-32">Giá</th>
                    <th className="text-left px-5 py-3.5 border-r border-[#008cc8] w-36">Trạng thái</th>
                    <th className="text-left px-5 py-3.5 border-r border-[#008cc8] w-44">Mã đơn hàng</th>
                    <th className="text-left px-5 py-3.5 w-48">Thời gian mua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 bg-white">
                        Không tìm thấy lịch sử đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors bg-white">
                        
                        {/* Cột Chi tiết */}
                        <td className="px-4 py-4 text-center border-r border-gray-100">
                          <Link 
                            to={`/don-hang/${o.id}`} 
                            className="text-[#00a2e8] hover:text-[#008cc8] hover:underline font-bold text-xs"
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                        
                        {/* Cột Sản phẩm kèm ô Số lượng nền màu xanh */}
                        <td className="px-5 py-4 border-r border-gray-100 text-gray-800 font-medium">
                          <div className="flex justify-between items-center gap-2">
                            <span className="truncate max-w-[320px]" title={o.product_name}>
                              {o.product_name}
                            </span>
                            <span className="text-xs text-[#00a2e8] font-bold bg-[#e6f6fd] px-2 py-0.5 rounded border border-[#bce4f7]">
                              x1
                            </span>
                          </div>
                        </td>
                        
                        {/* Cột Giá */}
                        <td className="px-5 py-4 border-r border-gray-100 font-bold text-gray-900">
                          {formatVND(o.price)}
                        </td>
                        
                        {/* Cột Trạng thái */}
                        <td className="px-5 py-4 border-r border-gray-100">
                          {o.status === "completed" && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Hoàn thành
                            </span>
                          )}
                          {o.status === "pending" && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Chờ xử lý
                            </span>
                          )}
                          {o.status === "processing" && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-blue-500 font-bold">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Đang xử lý
                            </span>
                          )}
                          {o.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-red-500 font-bold">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span> Đã hủy
                            </span>
                          )}
                        </td>
                        
                        {/* Cột Mã đơn hàng */}
                        <td className="px-5 py-4 border-r border-gray-100 font-mono text-xs text-gray-600 font-semibold">
                          {o.order_code || "—"}
                        </td>
                        
                        {/* Cột Thời gian */}
                        <td className="px-5 py-4 text-xs text-gray-500 font-medium">
                          {formatDateTime(o.created_at)}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PurchaseHistory;
