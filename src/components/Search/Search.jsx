
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./Search.module.css";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState(""); 

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query); 
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Axtar..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        <FaSearch />
      </button>
    </form>
  );
};

export default Search;
