import { Navigate, Route, Routes } from "react-router-dom";

import Footer from "@/components/Footer";
import { Loading } from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { useUserData } from "@/context/userContext.js";
import AdminDashboard from "@/pages/AdminDashboard";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderPage from "@/pages/OrderPage";
import OrderProcessing from "@/pages/OrderProcessing";
import Orders from "@/pages/Orders";
import Payment from "@/pages/Payment";
import ProductPage from "@/pages/ProductPage";
import Products from "@/pages/Products";
import Register from "@/pages/Register";

function App() {
  const { isAuth, loading } = useUserData();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Products />} path="/products" />
          <Route element={<ProductPage />} path="/product/:id" />
          <Route
            element={isAuth ? <Navigate replace to="/" /> : <Login />}
            path="/login"
          />
          <Route
            element={isAuth ? <Navigate replace to="/" /> : <Register />}
            path="/register"
          />
          <Route
            element={isAuth ? <Cart /> : <Navigate replace to="/login" />}
            path="/cart"
          />
          <Route
            element={isAuth ? <Checkout /> : <Navigate replace to="/login" />}
            path="/checkout"
          />
          <Route
            element={isAuth ? <Payment /> : <Navigate replace to="/login" />}
            path="/payment/:id"
          />
          <Route
            element={
              isAuth ? <OrderProcessing /> : <Navigate replace to="/login" />
            }
            path="/order-processing"
          />
          <Route
            element={isAuth ? <Orders /> : <Navigate replace to="/login" />}
            path="/orders"
          />
          <Route
            element={isAuth ? <OrderPage /> : <Navigate replace to="/login" />}
            path="/order/:id"
          />
          <Route
            element={
              isAuth ? <AdminDashboard /> : <Navigate replace to="/login" />
            }
            path="/admin/dashboard"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
