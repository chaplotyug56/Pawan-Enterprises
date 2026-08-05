const KEY = "recentlyViewedProducts";
const MAX_ITEMS = 8;

export const saveRecentlyViewed = (product) => {
    console.log("Saving product:", product);
  if (!product?._id) return;

  const existing =
    JSON.parse(localStorage.getItem(KEY)) || [];

  const filtered = existing.filter(
    (item) => item._id !== product._id
  );

  filtered.unshift(product);

  localStorage.setItem(
    KEY,
    JSON.stringify(filtered.slice(0, MAX_ITEMS))
  );
};

export const getRecentlyViewed = () => {
  return (
    JSON.parse(localStorage.getItem(KEY)) || []
  );
};