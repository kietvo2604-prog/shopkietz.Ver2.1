import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, ShoppingBag, Clock, Eye, X, Save, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Order = {
  id: string;
  order_code: string | null;
  user_id: string;
  product_name: string;
  product_category: string;
  price: number;
  status: string;
  account_info: string | null;
  created_at: string;
};

type OrderGroup = {
  order_code: string;
  orders: Order[];
  totalPrice: number;
};

const formatVND = (n: number) => n.toLocaleString("vi-VN") + "đ";

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<OrderGroup | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [accInfoDraft, setAccInfoDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // Group orders by order_code
  const groupedOrders = useMemo(() => {
    const groups: Record<string, Order[]> = {};
    orders.forEach(o => {
      const key = o.order_code || o.id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    
    let result = Object.entries(groups).map(([code, ords]) => ({
      order_code: code,
      orders: ords,
      totalPrice: ords.reduce((sum, o) => sum + o.price, 0),
    }));

    // Filter
    if (search.trim()) {
      const q = search.toUpperCase();
      result = result.filter(g =>
        g.order_code.toUpperCase().includes(q) ||
        g.orders.some(o => o.product_name.toUpperCase().includes(q) || o.user_id.toUpperCase().includes(q))
      );
    }

    return result;
  }, [orders, search]);

  const handleSaveAccInfo = async (orderId: string) => {
    setSaving(true);
    const { error } = await supabase.from("orders").update({ account_info: accInfoDraft } as any).eq("id", orderId);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi", description: "Không thể cập nhật.", variant: "destructive" });
    } else {
      toast({ title: "✅ Đã cập nhật thông tin tài khoản!" });
      setEditingOrderId(null);
      fetchOrders();
      // Update selectedGroup locally
      if (selectedGroup) {
        setSelectedGroup({
          ...selectedGroup,
          orders: selectedGroup.orders.map(o => o.id === orderId ? { ...o, account_info: accInfoDraft } : o)
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-primary neon-text">QUẢN LÝ ĐƠN HÀNG</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn VAK, tên sản phẩm..."
            className="bg-muted border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground text-sm focus:outline-none focus:border-primary focus:neon-border transition-all w-72"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden neon-card">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Mã đơn</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Sản phẩm</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">SL</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Tổng giá</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Thời gian</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Đang tải...</td></tr>
              ) : groupedOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng"}
                </td></tr>
              ) : (
                groupedOrders.map((group) => (
                  <tr key={group.order_code} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary text-xs">{group.order_code}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium max-w-[200px] truncate">{group.orders[0].product_name}</td>
                    <td className="px-4 py-3 text-foreground font-bold">{group.orders.length}</td>
                    <td className="px-4 py-3 text-destructive font-mono font-bold">{formatVND(group.totalPrice)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(group.orders[0].created_at).toLocaleString("vi-VN")}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelectedGroup(group); setEditingOrderId(null); }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order group detail modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedGroup(null)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full neon-card animate-slide-up space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">Chi tiết đơn hàng</h2>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="p-1 rounded hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Mã đơn</span>
                <span className="font-mono font-bold text-primary">{selectedGroup.order_code}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Sản phẩm</span>
                <span className="font-medium text-foreground">{selectedGroup.orders[0].product_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Số lượng</span>
                <span className="font-bold text-foreground">{selectedGroup.orders.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Tổng giá</span>
                <span className="font-bold text-destructive">{formatVND(selectedGroup.totalPrice)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs text-muted-foreground">{selectedGroup.orders[0].user_id.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Thời gian</span>
                <span className="text-xs text-muted-foreground">{new Date(selectedGroup.orders[0].created_at).toLocaleString("vi-VN")}</span>
              </div>
            </div>

            {/* Account infos - each order separated */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-semibold">Thông tin tài khoản ({selectedGroup.orders.length} tài khoản):</p>
              {selectedGroup.orders.map((order, idx) => (
                <div key={order.id} className="bg-muted border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Tài khoản {idx + 1}:</p>
                    {editingOrderId !== order.id && (
                      <button onClick={() => { setEditingOrderId(order.id); setAccInfoDraft(order.account_info || ""); }}
                        className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Pencil className="w-3 h-3" /> Sửa
                      </button>
                    )}
                  </div>
                  {editingOrderId === order.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={accInfoDraft}
                        onChange={(e) => setAccInfoDraft(e.target.value)}
                        rows={2}
                        placeholder="VD: username:password"
                        className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveAccInfo(order.id)} disabled={saving}
                          className="flex items-center gap-1.5 px-3 py-1.5 gradient-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50">
                          <Save className="w-3 h-3" /> {saving ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button onClick={() => setEditingOrderId(null)}
                          className="px-3 py-1.5 bg-background text-muted-foreground rounded-lg text-xs font-semibold hover:bg-border transition-colors">
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    order.account_info ? (
                      <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-all">{order.account_info}</pre>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Chưa có thông tin.</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
