import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
  const [q, setQ] = useState('');
  const results = useSearch(q);
  return (
    <section className="search-panel">
      <div className="toolbar">
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search products, brands and more" />
        <button>Search</button>
      </div>
      <div className="search-results">
        {results.map((item) => <div className="mini-card" key={item.id}>{item.name}</div>)}
      </div>
    </section>
  );
}
