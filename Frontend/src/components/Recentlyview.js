export const addToRecentlyViewed = (productId) => {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter(id => id !== productId);

  viewed.unshift(productId);

  if (viewed.length > 10) {
    viewed = viewed.slice(0, 10);
  }

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
};

export const getRecentlyViewed = () => {
  return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
};
