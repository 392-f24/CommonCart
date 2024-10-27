import React from 'react';
import './AddedItem.css'; 

const AddedItem = ({ name, onDelete }) => {
  return (
    <div className="added-item">
      <span className="added-item-name">{name}</span>
      <button className="delete-button" onClick={() => onDelete(name)}>
        ×
      </button>
    </div>
  );
};

export default AddedItem;
