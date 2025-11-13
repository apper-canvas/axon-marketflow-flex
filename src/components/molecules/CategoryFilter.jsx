import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  className 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  
  const handleCategorySelect = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    onCategoryChange(Array.from(newSelected));
  };
  
  const renderCategory = (category, level = 0) => {
    const hasChildren = categories.some(cat => cat.parentId === category.Id);
    const isExpanded = expandedCategories.has(category.Id);
    const isSelected = selectedCategories.includes(category.Id);
    const children = categories.filter(cat => cat.parentId === category.Id);
    
    return (
      <div key={category.Id}>
        <div 
          className={cn(
            "flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors",
            isSelected && "bg-primary/10 text-primary"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div 
            className="flex items-center flex-1"
            onClick={() => handleCategorySelect(category.Id)}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </div>
          
          {hasChildren && (
            <button
              onClick={() => toggleCategory(category.Id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ApperIcon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                className="w-4 h-4" 
              />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const rootCategories = categories.filter(cat => !cat.parentId);
  
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
        Categories
      </h3>
      
      <div className="space-y-1">
        {rootCategories.map(category => renderCategory(category))}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onCategoryChange([])}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;