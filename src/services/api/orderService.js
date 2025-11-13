import ordersData from "@/services/mockData/orders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for orders (simulates database)
let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await delay(400);
    return [...orders];
  },
  
  async getById(id) {
    await delay(250);
    const order = orders.find(o => o.Id === id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return { ...order };
  },
  
  async create(orderData) {
    await delay(600);
    
    // Find the highest existing ID and add 1
    const maxId = Math.max(...orders.map(o => o.Id), 0);
    const newOrder = {
      Id: maxId + 1,
...orderData,
      createdAt: new Date().toISOString(),
      reviewable: false // Reviews allowed after delivery
    };
    
    orders.push(newOrder);
    return { ...newOrder };
  },
  
  async update(id, orderData) {
    await delay(400);
    
    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    orders[index] = {
      ...orders[index],
      ...orderData,
      Id: id // Ensure ID is not changed
    };
    
    return { ...orders[index] };
  },
  
  async delete(id) {
    await delay(300);
    
    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    const deletedOrder = orders[index];
    orders.splice(index, 1);
    return { ...deletedOrder };
  },
  
  async getByBuyer(buyerId) {
    await delay(350);
    return orders.filter(o => o.buyerId === buyerId).map(o => ({ ...o }));
  },
  
  async getByStatus(status) {
    await delay(300);
    return orders.filter(o => o.status === status).map(o => ({ ...o }));
  },
  
  async updateStatus(id, status) {
    await delay(200);
    
    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
orders[index].status = status;
    // Enable reviews when order is delivered
    if (status === 'delivered') {
      orders[index].reviewable = true;
    }
    return { ...orders[index] };
  }
};