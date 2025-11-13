import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import CartSidebar from "@/components/organisms/CartSidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="pb-16">
        <Outlet />
      </main>
      <CartSidebar />
    </div>
  );
};

export default Layout;