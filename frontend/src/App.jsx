import { Navigate, Route, Routes } from "react-router-dom";

import Footer from "@/components/Footer";
import { Loading } from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { useUserData } from "@/context/userContext.js";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
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
          <Route
            element={isAuth ? <Navigate replace to="/" /> : <Login />}
            path="/login"
          />
          <Route
            element={isAuth ? <Navigate replace to="/" /> : <Register />}
            path="/register"
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
