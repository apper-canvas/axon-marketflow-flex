import categoriesData from "@/services/mockData/categories.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for categories (simulates database)
let categories = [...categoriesData];

export const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },
  
  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return { ...category };
  },
  
  async create(categoryData) {
    await delay(300);
    
    // Find the highest existing ID and add 1
    const maxId = Math.max(...categories.map(c => c.Id), 0);
    const newCategory = {
      Id: maxId + 1,
      ...categoryData
    };
    
    categories.push(newCategory);
    return { ...newCategory };
  },
  
  async update(id, categoryData) {
    await delay(250);
    
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      Id: id // Ensure ID is not changed
    };
    
    return { ...categories[index] };
  },
  
  async delete(id) {
    await delay(200);
    
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    // Check if category has children
    const hasChildren = categories.some(c => c.parentId === id);
    if (hasChildren) {
      throw new Error("Cannot delete category that has subcategories");
    }
    
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    return { ...deletedCategory };
  },
  
  async getRootCategories() {
    await delay(150);
    return categories.filter(c => !c.parentId).map(c => ({ ...c }));
  },
  
  async getSubcategories(parentId) {
    await delay(150);
    return categories.filter(c => c.parentId === parentId).map(c => ({ ...c }));
  }
};