import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

/**
 * Wishlist Context Provider
 * Manages wishlist state in localStorage.
 */
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (room) => {
    setWishlist((prev) => {
      if (prev.find((r) => r._id === room._id)) return prev;
      return [...prev, room];
    });
  };

  const removeFromWishlist = (roomId) => {
    setWishlist((prev) => prev.filter((r) => r._id !== roomId));
  };

  const isInWishlist = (roomId) => {
    return wishlist.some((r) => r._id === roomId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
