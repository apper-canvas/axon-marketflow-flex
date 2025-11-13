import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const Categories = lazy(() => import("@/components/pages/Categories"));
const Orders = lazy(() => import("@/components/pages/Orders"));
const Reviews = lazy(() => import("@/components/pages/Reviews"));
const SellerDashboard = lazy(() => import("@/components/pages/SellerDashboard"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingSuspense = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <LoadingSuspense><Home /></LoadingSuspense>
  },
  {
    path: "categories",
    element: <LoadingSuspense><Categories /></LoadingSuspense>
  },
{
    path: "orders",
    element: <LoadingSuspense><Orders /></LoadingSuspense>
  },
  {
    path: "reviews",
    element: <LoadingSuspense><Reviews /></LoadingSuspense>
  },
{
    path: "sell",
    element: <LoadingSuspense><SellerDashboard /></LoadingSuspense>
  },
  {
    path: "checkout",
    element: <LoadingSuspense><Checkout /></LoadingSuspense>
  },
  {
    path: "order-confirmation/:orderId",
    element: <LoadingSuspense><OrderConfirmation /></LoadingSuspense>
  },
  {
    path: "*",
    element: <LoadingSuspense><NotFound /></LoadingSuspense>
  }
];

// Create router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);