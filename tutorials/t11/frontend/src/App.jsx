import { useState } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import './styles.css';

function App() {
  const [debouncedSearch, setDebouncedSearch] = useState('');

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <SearchBar onSearch={setDebouncedSearch} />
        <ProductList searchTerm={debouncedSearch} />
      </main>
    </div>
  );
}

export default App;
