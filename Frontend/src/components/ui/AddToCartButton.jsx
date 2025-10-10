import React, { useState, useEffect } from 'react';
import './AddToCartButton.css';

const AddToCartButton = ({ product, cart, setCart, isAuthenticated, onShowAuth }) => {
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Check if product is in cart and update state
  useEffect(() => {
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
      setQuantity(cartItem.qty);
      setShowQuantityControls(true);
    } else {
      setQuantity(0);
      setShowQuantityControls(false);
    }
  }, [cart, product.id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }

    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setShowQuantityControls(true);
  };

  const handleIncrement = () => {
    setCart(prev => prev.map(i => 
      i.id === product.id ? { ...i, qty: i.qty + 1 } : i
    ));
  };

  const handleDecrement = () => {
    setCart(prev => {
      const item = prev.find(i => i.id === product.id);
      if (item && item.qty > 1) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty - 1 } : i);
      } else {
        // Remove item if quantity becomes 0
        return prev.filter(i => i.id !== product.id);
      }
    });
  };

  if (showQuantityControls && quantity > 0) {
    return (
      <div className="quantity-controls">
        <button 
          className={`quantity-btn ${quantity === 1 ? 'delete-btn' : 'minus-btn'}`}
          onClick={handleDecrement}
          title={quantity === 1 ? "Remove item" : "Remove one item"}
        >
          {quantity === 1 ? '🗑️' : '−'}
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          className="quantity-btn plus-btn" 
          onClick={handleIncrement}
          title="Add one more"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button 
      className="add-to-cart-btn" 
      onClick={handleAddToCart}
    >
      Add to cart
    </button>
  );
};

export default AddToCartButton;
