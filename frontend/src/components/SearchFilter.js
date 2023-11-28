import React, { useState } from 'react';

const SearchFilterComponent = ({ onSearchResult }) => {
  const [searchInput, setSearchInput] = useState('');
  const [filterInput, setFilterInput] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:8000/Patient/getMedicine2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: searchInput }),
      });

      const jsonData = await response.json();
      console.log(jsonData);

      // Invoke the onSearchResult prop with the search result
      onSearchResult && onSearchResult(jsonData.Result);

      // If needed, perform other actions with the result
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch('http://localhost:8000/Patient/filterMedical2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ MedicalUse: filterInput }),
      });

      const jsonData = await response.json();
      console.log(jsonData);
      // Update state or handle the response as needed
    } catch (error) {
      console.error('Error filtering:', error);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <textarea
        placeholder="Filter..."
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default SearchFilterComponent;
