import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatters";
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ 
  item, 
  className 
}) => {
  const dispatch = useDispatch();
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(item.productId));
      toast.info("Item removed from cart");
    } else {
      dispatch(updateQuantity({ productId: item.productId, quantity: newQuantity }));
    }
  };
  
  const handleRemove = () => {
    dispatch(removeFromCart(item.productId));
    toast.info("Item removed from cart");
  };
  
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 truncate">
            {item.title}
          </h4>
          <p className="text-sm text-gray-600">
            {formatPrice(item.price)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 p-0"
          >
            <ApperIcon name="Minus" className="w-4 h-4" />
          </Button>
          
          <span className="w-8 text-center font-medium">
            {item.quantity}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 p-0"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-gray-800">
            {formatPrice(item.price * item.quantity)}
          </div>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;