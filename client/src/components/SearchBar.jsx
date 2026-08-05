import "../styles/SearchBar.css";

function SearchBar({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  inStock,
  setInStock,
}) {
  return (
    <div className="search-panel">

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Cosmetics">Cosmetics</option>
        <option value="Grocery">Grocery</option>
        <option value="Paints">Paints</option>
        <option value="Stationery">Stationery</option>
        <option value="Household">Household</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
        <option value="name">Name (A–Z)</option>
      </select>

      <label className="stock-filter">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        In Stock Only
      </label>

    </div>
  );
}

export default SearchBar;