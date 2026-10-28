import { useState } from 'react';

function ProductItem({ product }) {
  const [isLiked, setIsLiked] = useState(product.likes);

  const handleLikeToggle = async () => {
    // Save the current state so we can roll back if the request fails
    const previousState = isLiked;

    // Optimistic update: change the UI immediately
    setIsLiked(!isLiked);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}/like`,
        { method: 'PATCH' }
      );

      if (!response.ok) throw new Error('Sync failed');
    } catch (err) {
      console.error(err);
      alert('Sync error: could not update your like. Reverting.');
      // Rollback so the UI matches the database
      setIsLiked(previousState);
    }
  };

  return (
    <div className="product-card">
      <h3 style={{ margin: 0 }}>{product.name}</h3>
      <button
        className={`btn-like ${isLiked ? 'liked' : ''}`}
        onClick={handleLikeToggle}
      >
        {isLiked ? '♥ Liked' : '♡ Like'}
      </button>
    </div>
  );
}

export default ProductItem;
