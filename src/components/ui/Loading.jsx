import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gradient-to-r from-primary/20 to-primary/30 rounded w-1/3"></div>
                  <div className="h-8 bg-gradient-to-r from-accent/20 to-accent/30 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Loading MarketFlow</h3>
          <p className="text-gray-600">Please wait while we prepare your shopping experience...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;