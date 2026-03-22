import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { USER_SERVER_URL, UserContext } from "./userContext";

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const loadUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${USER_SERVER_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setIsAuth(true);
    } catch {
      Cookies.remove("token");
      setUser([]);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginUser = async (email, password) => {
    setBtnLoading(true);
    try {
      const res = await axios.post(`${USER_SERVER_URL}/api/user/login`, {
        email,
        password,
      });

      const { token, user: userData } = res.data;
      Cookies.set("token", token, {
        expires: 15,
        secure: window.location.protocol === "https:",
      });

      setUser(userData);
      setIsAuth(true);
      toast.success(res.data.message ?? "Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message ?? "Đăng nhập thất bại";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setBtnLoading(true);
    try {
      const res = await axios.post(`${USER_SERVER_URL}/api/user/register`, {
        email,
        name,
        password,
      });

      toast.success(res.data.message ?? "Đăng ký thành công");
      navigate("/login");
    } catch (error) {
      const message = error?.response?.data?.message ?? "Đăng ký thất bại";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setBtnLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.put(
        `${USER_SERVER_URL}/api/user/me/update`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUser((prev) => ({ ...prev, ...res.data.user }));
      toast.success(res.data.message ?? "Cập nhật thành công");
    } catch (error) {
      const message = error?.response?.data?.message ?? "Cập nhật thất bại";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setBtnLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.put(
        `${USER_SERVER_URL}/api/user/me/password`,
        { newPassword, oldPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message ?? "Đổi mật khẩu thành công");
    } catch (error) {
      const message = error?.response?.data?.message ?? "Đổi mật khẩu thất bại";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser([]);
    setIsAuth(false);
    navigate("/login");
    toast.success("Đăng xuất thành công");
  };

  const value = {
    btnLoading,
    changePassword,
    isAuth,
    loading,
    loginUser,
    logout,
    registerUser,
    updateProfile,
    user,
  };

  return (
    <UserContext.Provider value={value}>
      <Toaster position="top-right" />
      {children}
    </UserContext.Provider>
  );
}
