import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice, formatDateTime } from "@/utils/formatters";
import { orderService } from "@/services/api/orderService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await orderService.getById(parseInt(orderId));
      setOrder(orderData);
    } catch (err) {
      setError("Failed to load order details. Please try again.");
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <ErrorView
        title="Failed to load order"
        message={error}
        onRetry={loadOrder}
      />
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find an order with ID #{orderId}
        </p>
        <Link to="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Thank you for your purchase
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 inline-block">
          <p className="text-green-800 font-medium">
            Order #{order.Id}
          </p>
          <p className="text-sm text-green-600">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
      </motion.div>
      
      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Order Items */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Package" className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Product #{item.productId}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shipping Address */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
            <p className="text-gray-600">{order.shippingAddress.email}</p>
            {order.shippingAddress.phone && (
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
            )}
            <div className="mt-2 text-gray-600">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">{formatPrice(order.total * 0.85)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-800">{formatPrice(order.total * 0.07)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">{formatPrice(order.total * 0.08)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span className="text-gray-800">Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <h3 className="font-semibold text-blue-800 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start space-x-2">
            <ApperIcon name="Mail" className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>You'll receive an email confirmation shortly</span>
          </li>
          <li className="flex items-start space-x-2">
            <ApperIcon name="Package" className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>We'll start processing your order within 24 hours</span>
          </li>
          <li className="flex items-start space-x-2">
            <ApperIcon name="Truck" className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>You'll get tracking information once your order ships</span>
          </li>
        </ul>
      </motion.div>
      
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
      >
<Link to="/orders">
          <Button variant="primary" className="w-full sm:w-auto">
            <ApperIcon name="Package" className="w-4 h-4 mr-2" />
            View All Orders
          </Button>
        </Link>
        <Link to="/reviews">
          <Button variant="outline" className="w-full sm:w-auto">
            <ApperIcon name="Star" className="w-4 h-4 mr-2" />
            Leave Reviews
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full sm:w-auto">
            <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;