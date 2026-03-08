import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const PolicySection = () => {
  return (
    <div id="policy" className="bg-card border border-border rounded-xl p-6 neon-card">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-7 h-7 text-primary" />
        <h2 className="font-display text-xl font-bold text-primary neon-text">CHÍNH SÁCH BẢO HÀNH</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Đổi trả 1-1</h3>
              <p className="text-sm text-muted-foreground">Nếu tài khoản bị sai mật khẩu hoặc không đúng như mô tả khi vừa mua xong.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Hỗ trợ 24h</h3>
              <p className="text-sm text-muted-foreground">Tiếp nhận khiếu nại trong vòng 24h kể từ thời điểm giao dịch thành công.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-neon-orange" />
            <h3 className="font-semibold text-neon-orange">Từ chối bảo hành khi:</h3>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Sử dụng phần mềm thứ 3 (Hack/Cheat) sau khi mua.</p>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Tự làm lộ thông tin hoặc không đổi mật khẩu sau khi nhận.</p>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Chia sẻ tài khoản cho nhiều người dùng chung.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySection;
