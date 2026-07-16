import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle, Search } from "lucide-react";

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

// Hàm format ngày giờ giống định dạng trong ảnh (HH:mm:ss DD/MM/YYYY)
const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const pad = (num: number) => String(num).padStart(2, '0');
  
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
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

  // Đếm số lượng đơn hàng theo từng trạng thái để hiển thị lên các Tab
  const countByStatus = (status: string) => orders.filter(o => o.status === status).length;

  // Lọc dữ liệu theo Search và theo Tab đang chọn
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
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tiêu đề trang */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="p-1.5 bg-[#00a2e8] text-white rounded">📋</span> Đơn hàng của tôi
              </h1>
              <p className="text-xs text-gray-500 mt-1">Tổng cộng {orders.length} đơn hàng</p>
            </div>

            {/* Thanh tìm kiếm bên phải tiêu đề */}
            <div className="flex items-center">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn hàng, tên sản phẩm"
                className="border border-gray-300 rounded-l-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#00a2e8]"
              />
              <button className="bg-[#00a2e8] text-white px-4 py-1.5 rounded-r-md text-sm font-medium hover:bg-[#008cc8] transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" /> Tìm kiếm
              </button>
            </div>
          </div>

          {/* Hàng các nút Tabs Trạng thái đơn hàng */}
          <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "all" ? "bg-[#00a2e8] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Tất cả <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{orders.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "pending" ? "bg-[#00a2e8] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Chờ xử lý <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "pending" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{countByStatus("pending")}</span>
            </button>
            <button 
              onClick={() => setActiveTab("processing")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "processing" ? "bg-[#00a2e8] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Đang xử lý <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "processing" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{countByStatus("processing")}</span>
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "completed" ? "bg-[#00a2e8] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Hoàn thành <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "completed" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{countByStatus("completed")}</span>
            </button>
            <button 
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === "cancelled" ? "bg-[#00a2e8] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Đã hủy <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "cancelled" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{countByStatus("cancelled")}</span>
            </button>
          </div>

          {/* Bảng danh sách đơn hàng */}
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#00a2e8]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#00a2e8] text-white font-medium">
                    <th className="text-left px-4 py-3 border-r border-[#008cc8] w-24">CHI TIẾT</th>
                    <th className="text-left px-4 py-3 border-r border-[#008cc8]">SẢN PHẨM</th>
                    <th className="text-left px-4 py-3 border-r border-[#008cc8] w-28">GIÁ</th>
                    <th className="text-left px-4 py-3 border-r border-[#008cc8] w-32">TRẠNG THÁI</th>
                    <th className="text-left px-4 py-3 border-r border-[#008cc8] w-40">MÃ ĐƠN HÀNG</th>
                    <th className="text-left px-4 py-3 w-44">THỜI GIAN</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 bg-white">
                        Không tìm thấy đơn hàng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors bg-white">
                        {/* Cột Chi tiết */}
                        <td className="px-4 py-3 text-center border-r border-gray-100">
                          <Link to={`/don-hang/${o.id}`} className="text-[#00a2e8] hover:underline font-medium text-xs">
                            Xem chi tiết
                          </Link>
                        </td>
                        
                        {/* Cột Sản phẩm kèm số lượng x1 */}
                        <td className="px-4 py-3 text-gray-700 font-medium border-r border-gray-100">
                          <div className="flex justify-between items-center">
                            <span>{o.product_name}</span>
                            <span className="text-xs text-gray-400 mr-2">x1</span>
                          </div>
                        </td>
                        
                        {/* Cột Giá */}
                        <td className="px-4 py-3 font-semibold text-gray-800 border-r border-gray-100">
                          {formatVND(o.price)}
                        </td>
                        
                        {/* Cột Trạng thái */}
                        <td className="px-4 py-3 border-r border-gray-100">
                          {o.status === "completed" && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#28a745] font-medium">
                              <span className="w-2 h-2 rounded-full bg-[#28a745]"></span> Hoàn thành
                            </span>
                          )}
                          {o.status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Chờ xử lý
                            </span>
                          )}
                          {o.status === "processing" && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Đang xử lý
                            </span>
                          )}
                          {o.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span> Đã hủy
                            </span>
                          )}
                        </td>
                        
                        {/* Cột Mã đơn hàng */}
                        <td className="px-4 py-3 font-mono text-xs text-gray-600 border-r border-gray-100">
                          {o.order_code || "—"}
                        </td>
                        
                        {/* Cột Thời gian mua */}
                        <td className="px-4 py-3 text-xs text-gray-600">
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