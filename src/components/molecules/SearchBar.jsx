import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  className,
  placeholder = "Search products...",
  onSearch,
  defaultValue = ""
}) => {
  const [query, setQuery] = useState(defaultValue);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };
  
  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button type="submit" className="ml-2 px-6">
        <ApperIcon name="Search" className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default SearchBar;