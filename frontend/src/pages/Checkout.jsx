import axios from "axios";
import jsCookie from "js-cookie";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_SERVER_URL } from "@/context/userContext.js";

function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    phoneNumber: "",
  });

  const fetchAddress = useCallback(async () => {
    try {
      const token = jsCookie.get("token");
      const { data } = await axios.get(`${USER_SERVER_URL}/api/address/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(data);
    } catch {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address.trim() || !newAddress.phoneNumber.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const token = jsCookie.get("token");
      await axios.post(`${USER_SERVER_URL}/api/address/new`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Thêm địa chỉ thành công");
      setNewAddress({ address: "", phoneNumber: "" });
      setModalOpen(false);
      fetchAddress();
    } catch {
      toast.error("Thêm địa chỉ thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này?");
    if (!confirmed) return;

    try {
      const token = jsCookie.get("token");
      await axios.delete(`${USER_SERVER_URL}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa địa chỉ thành công");
      fetchAddress();
    } catch {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          Chọn địa chỉ giao hàng
        </h1>

        <Dialog onOpenChange={setModalOpen} open={modalOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-1.5"
              onClick={() => setModalOpen(true)}
              size="lg"
            >
              <Plus className="h-4 w-4" />
              Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAddress}>
              <DialogHeader>
                <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin địa chỉ giao hàng của bạn.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    name="address"
                    onChange={handleOnChange}
                    placeholder="Nhập địa chỉ giao hàng"
                    value={newAddress.address}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={handleOnChange}
                    placeholder="Nhập số điện thoại"
                    type="number"
                    value={newAddress.phoneNumber}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button disabled={submitting} type="submit">
                  {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <MapPin className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-semibold text-xl">Chưa có địa chỉ</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Bạn chưa có địa chỉ giao hàng nào. Hãy thêm địa chỉ mới để tiếp tục
            thanh toán.
          </p>
          <Button
            className="gap-1.5"
            onClick={() => setModalOpen(true)}
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {addresses.map((addr) => (
            <div
              className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              key={addr._id}
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-relaxed">
                    {addr.address}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    SĐT: {addr.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-2">
                <Button asChild className="flex-1" size="sm">
                  <Link to={`/payment/${addr._id}`}>Dùng địa chỉ này</Link>
                </Button>
                <Button
                  onClick={() => deleteHandler(addr._id)}
                  size="icon-sm"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Xóa địa chỉ</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Checkout;
