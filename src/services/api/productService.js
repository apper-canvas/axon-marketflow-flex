import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for products (simulates database)
let products = [...productsData];

export const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },
  
  async getById(id) {
    await delay(200);
    const product = products.find(p => p.Id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return { ...product };
  },
  
  async create(productData) {
    await delay(500);
    
    // Find the highest existing ID and add 1
    const maxId = Math.max(...products.map(p => p.Id), 0);
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    return { ...newProduct };
  },
  
  async update(id, productData) {
    await delay(400);
    
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      Id: id // Ensure ID is not changed
    };
    
    return { ...products[index] };
  },
  
  async delete(id) {
    await delay(300);
    
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const deletedProduct = products[index];
    products.splice(index, 1);
    return { ...deletedProduct };
  },
  
  async getByCategory(category) {
    await delay(250);
    return products.filter(p => p.category === category).map(p => ({ ...p }));
  },
  
  async getBySeller(sellerId) {
    await delay(250);
    return products.filter(p => p.sellerId === sellerId).map(p => ({ ...p }));
  },
  
  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  }
};