import reviewsData from "@/services/mockData/reviews.json";

// Mock data storage
let reviews = [...reviewsData];
let nextId = Math.max(...reviews.map(r => r.Id), 0) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  // Get all reviews
  getAll: async () => {
    await delay(300);
    return reviews.map(review => ({ ...review }));
  },

  // Get review by ID
  getById: async (id) => {
    await delay(200);
    const review = reviews.find(r => r.Id === id);
    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }
    return { ...review };
  },

  // Get reviews by product ID
  getByProductId: async (productId) => {
    await delay(250);
    return reviews
      .filter(r => r.productId === productId)
      .map(review => ({ ...review }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get reviews by buyer ID
  getByBuyerId: async (buyerId) => {
    await delay(250);
    return reviews
      .filter(r => r.buyerId === buyerId)
      .map(review => ({ ...review }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get average rating for a product
  getProductRating: async (productId) => {
    await delay(200);
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const average = total / productReviews.length;
    
    return {
      average: Math.round(average * 10) / 10,
      count: productReviews.length
    };
  },

  // Create new review
  create: async (reviewData) => {
    await delay(500);
    
    // Validation
    if (!reviewData.productId || !reviewData.buyerId) {
      throw new Error("Product ID and Buyer ID are required");
    }
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      throw new Error("Review comment must be at least 10 characters long");
    }

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      r => r.productId === reviewData.productId && r.buyerId === reviewData.buyerId
    );
    
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const newReview = {
      Id: nextId++,
      productId: parseInt(reviewData.productId),
      buyerId: parseInt(reviewData.buyerId),
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment.trim(),
      buyerName: reviewData.buyerName || "Anonymous Buyer",
      buyerEmail: reviewData.buyerEmail || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpful: 0,
      verified: true // Assuming all reviews are from verified purchases
    };

    reviews.push(newReview);
    return { ...newReview };
  },

  // Update existing review
  update: async (id, updateData) => {
    await delay(400);
    
    const index = reviews.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    // Validation
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (updateData.comment && updateData.comment.trim().length < 10) {
      throw new Error("Review comment must be at least 10 characters long");
    }

    const updatedReview = {
      ...reviews[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    reviews[index] = updatedReview;
    return { ...updatedReview };
  },

  // Delete review
  delete: async (id) => {
    await delay(300);
    
    const index = reviews.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    const deletedReview = { ...reviews[index] };
    reviews.splice(index, 1);
    return deletedReview;
  },

  // Mark review as helpful
  markHelpful: async (id) => {
    await delay(250);
    
    const index = reviews.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    reviews[index].helpful += 1;
    return { ...reviews[index] };
  },

  // Check if user can review a product (has purchased it)
  canReview: async (productId, buyerId) => {
    await delay(200);
    
    // This would typically check against order history
    // For now, we'll return true to allow reviews
    const existingReview = reviews.find(
      r => r.productId === productId && r.buyerId === buyerId
    );
    
    return !existingReview;
  },

  // Get review statistics for a product
  getProductStats: async (productId) => {
    await delay(250);
    
    const productReviews = reviews.filter(r => r.productId === productId);
    
    if (productReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    productReviews.forEach(review => {
      ratingDistribution[review.rating]++;
      totalRating += review.rating;
    });

    return {
      totalReviews: productReviews.length,
      averageRating: Math.round((totalRating / productReviews.length) * 10) / 10,
      ratingDistribution
    };
  }
};