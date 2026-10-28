import { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            onSearch(inputValue);
        }, 500);
        return () => clearTimeout(timerId);
    }, [inputValue, onSearch]);

    return (
        <input
            type="text"
            className="search-input"
            placeholder="Search (type 'error' or 'zebra' to test UI)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    );
}

export default SearchBar;
