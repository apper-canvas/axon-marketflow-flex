import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatPrice, formatDateTime, getStatusColor, getStatusText } from "@/utils/formatters";
import { orderService } from "@/services/api/orderService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await orderService.getAll();
      // Sort orders by date, newest first
      const sortedOrders = orderData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "Clock";
      case "processing":
        return "Package";
      case "shipped":
        return "Truck";
      case "delivered":
        return "CheckCircle";
      case "cancelled":
        return "XCircle";
      default:
        return "Package";
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <ErrorView
        title="Failed to load orders"
        message={error}
        onRetry={loadOrders}
      />
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="Package"
          title="No orders yet"
          message="You haven't placed any orders yet. Start shopping to see your order history here."
          actionText="Start Shopping"
          onAction={() => window.location.href = "/"}
        />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order History</h1>
        <p className="text-gray-600">
          Track and manage your {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </motion.div>
      
      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, index) => {
          const isExpanded = expandedOrders.has(order.Id);
          
          return (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderExpansion(order.Id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <ApperIcon 
                          name={getStatusIcon(order.status)} 
                          className="w-6 h-6 text-white" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.Id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>
                    
                    <Badge variant="default" className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    
                    <ApperIcon
                      name={isExpanded ? "ChevronUp" : "ChevronDown"}
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Order Details */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ApperIcon name="Package" className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">Product #{item.productId}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="font-semibold text-gray-800">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Order Total Breakdown */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">{formatPrice(order.total * 0.9)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-gray-800">{formatPrice(order.total * 0.1)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                          <span className="text-gray-800">Total</span>
                          <span className="text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;