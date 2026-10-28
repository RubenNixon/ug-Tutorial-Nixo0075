import { useState, useEffect } from 'react';
import ProductItem from './ProductItem.jsx';

function ProductList({ searchTerm }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  if (isLoading) {
    return (
      <>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
      </>
    );
  }

  if (error) {
    return <div className="error-banner"><p>{error}</p></div>;
  }

  if (products.length === 0) {
    return <div className="empty-state"><h3>No results found</h3></div>;
  }

  return (
    <div>
      {products.map(p => (
        <ProductItem key={p._id} product={p} />
      ))}
    </div>
  );
}

export default ProductList;
