const API_BASE = 'http://localhost:8080';

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        if (data.success) {
            return data.products;
        }
        throw new Error(data.message || 'Failed to fetch products');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (category) => {
    try {
        const response = await fetch(`${API_BASE}/products/category/${category}`);
        const data = await response.json();
        if (data.success) {
            return data.products;
        }
        throw new Error(data.message || 'Failed to fetch products');
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// Get product by ID
export const getProductById = async (productId) => {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        const data = await response.json();
        if (data.success) {
            return data.product;
        }
        throw new Error(data.message || 'Product not found');
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Search products
export const searchProducts = async (query) => {
    try {
        const products = await getAllProducts();
        return products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
