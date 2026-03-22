import axios from "axios";
import jsCookie from "js-cookie";
import { CheckCircle2, Loader2, ShoppingBag, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SERVER_URL, useCartData } from "@/context/cartContext.js";

function OrderProcessing() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCart } = useCartData();

  const [status, setStatus] = useState("processing");
  const sessionId = searchParams.get("session_id");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      toast.error("Không tìm thấy phiên thanh toán");
      navigate("/cart");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const token = jsCookie.get("token");
        const { data } = await axios.post(
          `${SERVER_URL}/api/order/verify/payment?sessionId=${sessionId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setStatus("success");
        toast.success(data.message);
        fetchCart();
        setTimeout(() => navigate("/orders"), 10000);
      } catch (error) {
        setStatus("fail");
        toast.error(error.response?.data?.message || "Xác minh thất bại");
      }
    };

    verifyPayment();
  }, [sessionId, fetchCart, navigate]);

  if (status === "processing") {
    return (
      <div className="flex flex-col justify-center items-center mx-auto px-4 py-24 max-w-7xl">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
        <h2 className="mb-2 font-bold text-2xl">Đang xử lý đơn hàng</h2>
        <p className="text-muted-foreground text-center">
          Vui lòng chờ trong khi hệ thống xác nhận thanh toán của bạn...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col justify-center items-center mx-auto px-4 py-24 max-w-7xl">
        <CheckCircle2 className="mb-4 w-16 h-16 text-green-500" />
        <h2 className="mb-2 font-bold text-2xl">Đặt hàng thành công!</h2>
        <p className="mb-2 text-muted-foreground text-center">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
        </p>
        <p className="mb-8 text-muted-foreground text-sm">
          Tự động chuyển về trang đơn hàng sau 10 giây...
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/orders")} size="lg">
            <ShoppingBag className="mr-2 w-4 h-4" />
            Xem đơn hàng
          </Button>
          <Button onClick={() => navigate("/")} size="lg" variant="outline">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="flex flex-col justify-center items-center mx-auto px-4 py-24 max-w-7xl">
        <XCircle className="mb-4 w-16 h-16 text-destructive" />
        <h2 className="mb-2 font-bold text-2xl">Thanh toán thất bại</h2>
        <p className="mb-8 text-muted-foreground text-center">
          Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/cart")} size="lg">
            Về giỏ hàng
          </Button>
          <Button onClick={() => navigate("/")} size="lg" variant="outline">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }
}

export default OrderProcessing;
