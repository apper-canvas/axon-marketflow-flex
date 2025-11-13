import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatPrice } from "@/utils/formatters";
import { clearCart } from "@/store/slices/cartSlice";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });
  const [errors, setErrors] = useState({});
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          icon="ShoppingCart"
          title="Your cart is empty"
          message="Add some products to your cart before checking out."
          actionText="Start Shopping"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      // Shipping validation
      const requiredFields = ["firstName", "lastName", "email", "address", "city", "state", "zipCode"];
      requiredFields.forEach(field => {
        if (!formData[field].trim()) {
          newErrors[field] = "This field is required";
        }
      });
      
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = "Please enter a valid ZIP code";
      }
    }
    
    if (stepNumber === 2) {
      // Payment validation
      const requiredFields = ["cardNumber", "expiryDate", "cvv", "cardName"];
      requiredFields.forEach(field => {
        if (!formData[field].trim()) {
          newErrors[field] = "This field is required";
        }
      });
      
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        status: "pending",
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      };
      
      const order = await orderService.create(orderData);
      
      // Clear cart
      dispatch(clearCart());
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.Id}`);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };
  
  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order in just a few steps</p>
      </motion.div>
      
      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center space-x-8">
          {steps.map((stepItem) => (
            <div key={stepItem.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= stepItem.number
                    ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > stepItem.number ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  <ApperIcon name={stepItem.icon} className="w-5 h-5" />
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= stepItem.number ? "text-primary" : "text-gray-400"
                }`}
              >
                {stepItem.title}
              </span>
              {stepItem.number < steps.length && (
                <div
                  className={`w-16 h-0.5 ml-4 ${
                    step > stepItem.number ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    error={errors.lastName}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={errors.email}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    error={errors.phone}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      error={errors.address}
                    />
                  </div>
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    error={errors.city}
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    error={errors.state}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    error={errors.zipCode}
                  />
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Cardholder Name"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange("cardName", e.target.value)}
                    error={errors.cardName}
                  />
                  <Input
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      error={errors.cvv}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Shield" className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Secure Payment</p>
                      <p className="text-xs text-green-600 mt-1">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Order Review */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Order</h2>
                
                {/* Shipping Info Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>
                
                {/* Payment Info Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                  <p className="text-sm text-gray-600">
                    **** **** **** {formData.cardNumber.slice(-4)}<br />
                    {formData.cardName}
                  </p>
                </div>
                
                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Order Items</h3>
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {step > 1 && (
                  <Button variant="ghost" onClick={handlePrevStep}>
                    <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              
              <div>
                {step < 3 ? (
                  <Button onClick={handleNextStep}>
                    Continue
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    variant="accent"
                    className="px-8"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-800">Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            
            {/* Free shipping notice */}
            {shipping > 0 && subtotal < 100 && (
              <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-accent">
                  Add {formatPrice(100 - subtotal)} more to get free shipping!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;