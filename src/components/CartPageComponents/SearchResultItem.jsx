import React from 'react';
import './SearchResultItem.css';

const SearchResultItem = ({ label, onAdd }) => {
  return (
    <div className="search-result-item">
      <span className="result-label">{label}</span>
      <button className="add-button" onClick={() => onAdd(label)}>
        Add
      </button>
    </div>
  );
};

export default SearchResultItem;
