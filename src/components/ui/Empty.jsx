import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "Package",
  title = "No items found",
  message = "It looks like there's nothing here yet.",
  actionText = "Browse Products",
  onAction,
  showAction = true 
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-8", className)}>
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {showAction && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-accent to-orange-500 text-white rounded-lg hover:from-accent/90 hover:to-orange-500/90 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
          >
            <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;