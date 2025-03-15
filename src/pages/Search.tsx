
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>
      <p className="text-gray-600">This page is under construction</p>
    </div>
  );
};

export default Search;
