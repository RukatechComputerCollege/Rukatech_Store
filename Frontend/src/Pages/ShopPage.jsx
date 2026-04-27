import React, { useContext, useEffect, useMemo, useState } from "react";
import { CategoryContext } from "../CategoryContext";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { IoFilter } from "react-icons/io5";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Cart";

const ShopPage = () => {
  const { allCategory, allProduct } = useContext(CategoryContext);
  const dispatch = useDispatch();
  const [productShowName, setProductShowName] = useState("All Product");
  const [productPrice, setProductPrice] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const { categoryName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 40;

  const displayedCategories = useMemo(() => {
    if (!allCategory) return [];
    if (productShowName === "All Product") {
      return [{ name: "All Products", allProducts: true }];
    }
    return allCategory.filter((cat) => cat.name === productShowName);
  }, [allCategory, productShowName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (categoryName) {
      setProductShowName(categoryName);
    }
    document.title = `${categoryName || "Shop All Product"} - Fastcart`;
  }, [categoryName]);

  const filterByPrice = (priceRange, product) => {
    const price = Number(product.price) || 0;
    switch (priceRange) {
      case "under10k":
        return price < 10000;
      case "11k-49k":
        return price >= 11000 && price <= 49000;
      case "50k-100k":
        return price >= 50000 && price <= 100000;
      case "101k-500k":
        return price >= 101000 && price <= 500000;
      case "501k-1m":
        return price >= 501000 && price <= 1000000;
      case "1m-10m":
        return price >= 1000000 && price <= 10000000;
      case "over10m":
        return price > 10000000;
      default:
        return true;
    }
  };

  const filteredProducts = useMemo(() => {
    return allProduct?.filter((product) => {
      const matchesCategory =
        productShowName === "All Product" ||
        product.category?.some((cat) => cat.name === productShowName) ||
        (categoryName &&
          product.category?.some((cat) => cat.name === categoryName));

      const matchesSearchQuery =
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase());

      const matchesPrice = filterByPrice(productPrice, product);
      return matchesCategory && matchesSearchQuery && matchesPrice;
    });
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter panel state
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  const openFilterPanel = () => setShowFilterMobile(true);
  const closeFilterPanel = () => setShowFilterMobile(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [productShowName, productPrice, debouncedQuery]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  return (
    <div className="w-full font-inter" style={{ padding: "2% 6%" }}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* <!-- Left Column: Sidebar Filters --> */}

        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div className="rounded-4xl shadow-sm border border-gray-100 flex flex-col py-2 max-h-[50dvh] overflow-y-scroll">
            <h2 className="px-4 uppercase">Categories</h2>
            <div className="flex items-center px-4 py-1 text-sm">
              <input
                type="radio"
                id="category-all-aside"
                onChange={() => setProductShowName("All Product")}
                checked={productShowName === "All Product"}
                name="category-aside"
              />
              <label htmlFor="category-all-aside">All Product</label>
            </div>
            {allCategory?.map((cat) => (
              <div
                className="flex space-x-1 items-center px-4 py-1 text-sm"
                key={cat.name}
              >
                <input
                  type="radio"
                  id={`category-aside-${cat.name}`}
                  onChange={() => setProductShowName(cat.name)}
                  checked={productShowName === cat.name}
                  name="category-aside"
                />
                <span className="material-symbols-outlined text-primary">
                  category
                </span>
                <label htmlFor={`category-aside-${cat.name}`}>{cat.name}</label>
              </div>
            ))}
          </div>
        </aside>
        {/* <!-- Right Column: Main Content --> */}
        <div className="flex-1 space-y-8">
          {/* <!-- Category Banner --> */}
          <section className="relative h-[450px] rounded-4xl overflow-hidden shadow-lg group">
            <img
              alt="Flagship Phones"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="high-end flagship smartphones arranged artistically on a glass surface with neon blue and pink ambient lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBc6EUWuBRaZRWt2aRVAqG_tNyWeCIbN8W2z_8jGDvuncyuqL-ZdMBCGya_yJkmgZfmGTxjgIoquOhZOmx0VVtaqClzIKNpc3dqwcFmTz-RtjqSaqbj_TWuLi8Z2lVXHDvTquJATTW78rqIoP2A52w-bg3yjeDsNSTWD-Df3-9dSCo9UY6CKBZl4zG15Y1iX9arqqdTf6z1HJCj7rXRESDLafgji0BCeX-frO0TtKCmLmE50PBuLzQyR706reVEyyMCkRcTwo3OlqI"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-12">
              <span className="text-primary-light font-bold tracking-widest text-sm uppercase mb-2">
                Exclusive Deals
              </span>
              <h1 className="font-display-lg text-display-lg text-white mb-4">
                Ultimate Mobility
              </h1>
              <p className="text-white/80 max-w-sm font-body-lg text-body-lg mb-6">
                Upgrade to the latest 5G devices. Up to 40% off on flagship
                models.
              </p>
              <button className="w-fit bg-primary-light text-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider active:scale-95 transition-all">
                Shop Now
              </button>
            </div>
          </section>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-15">
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">
            <h3 className="font-inter text-label-lg mb-4 text-on-background uppercase tracking-wider">
              Brand
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Samsung
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Apple
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Xiaomi
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Infinix
                </span>
              </label>
            </div>
            <hr className="my-6 border-gray-100" />
            <h3 className="font-inter text-label-lg mb-4 text-on-background uppercase tracking-wider">
              Price Range
            </h3>
            <div className="space-y-4">
              <input
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-light"
                type="range"
              />
              <div className="flex items-center gap-2">
                <input
                  className="w-full border-gray-200 rounded text-xs p-2"
                  placeholder="Min"
                  type="text"
                />
                <span className="text-gray-400">-</span>
                <input
                  className="w-full border-gray-200 rounded text-xs p-2"
                  placeholder="Max"
                  type="text"
                />
              </div>
            </div>
            <hr className="my-6 border-gray-100" />
            <h3 className="font-inter text-label-lg mb-4 text-on-background uppercase tracking-wider">
              RAM Capacity
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary">4GB</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary">8GB</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary">12GB+</span>
              </label>
            </div>
          </div>
        </aside>
        {/* <!-- Product Grid --> */}
        <div className="flex-1 space-y-8">
          <section className="">
            {displayedCategories.map((cat) => {
              const sectionProducts = cat.allProducts
                ? currentProducts
                : allProduct
                    .filter((product) =>
                      product.category.some((c) => c.name === cat.name),
                    )
                    .slice(0, 4);

              return (
                <div key={cat.name} className="mb-8">
                  <div className="bg-primary text-white px-4 py-4 rounded-t-3xl flex items-center justify-between">
                    <div className="flex items-center justify-center space-x-1">
                      <h2 className="text-lg font-bold">{cat.name}</h2>
                      <h2 className="text-sm font-medium text-primary-light">({filteredProducts?.length.toLocaleString()} Products found)</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span>Sort by:</span>
                      <select className="border-none text-white bg-transparent font-bold focus:ring-0 cursor-pointer">
                        <option className="">Popularity</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-b-3xl shadow-sm">
                    {sectionProducts.map((product) => (
                      <div
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 relative"
                        key={product._id}
                      >
                        {product.discountprice && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded">
                              -
                              {Math.round(
                                (1 - product.discountprice / product.price) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                        )}

                        <div className="aspect-square bg-gray-50 overflow-hidden relative">
                          <img
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                            src={product.image[0]}
                          />
                          <div className="absolute bottom-2 right-2 z-10">
                            <FaRegHeart
                              size={16}
                              className="text-gray-400 hover:text-red-500 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-inter text-on-background mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="mt-auto">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="material-symbols-outlined fill text-orange-400 text-xs">
                                star
                              </span>
                              <span className="text-[10px] font-bold text-gray-400">
                                {product.rating?.length > 0
                                  ? (
                                      product.rating.reduce(
                                        (acc, r) => acc + r.ratingGrade,
                                        0,
                                      ) / product.rating.length
                                    ).toFixed(1)
                                  : 0}{" "}
                                ({product.rating?.length || 0})
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-lg font-black text-on-background">
                                ₦
                                {product.discountprice
                                  ? product.discountprice.toLocaleString()
                                  : product.price.toLocaleString()}
                              </span>
                              {product.discountprice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₦{product.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => dispatch(addToCart(product))}
                              className="mt-4 w-full bg-white border-2 border-primary-light text-primary-light font-bold py-2 rounded-lg text-xs hover:bg-primary-light hover:text-white transition-colors uppercase"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      {Array.isArray(allProduct) && allProduct.length !== 0 ? (
        <div
          className={`w-full grid ${showFilterMobile ? "md:grid-cols-[20%_80%]" : "md:grid-cols-[20%_80%]"} grid-rows-auto`}
        >
          {/* Filter Section Desktop */}
          <div className="hidden md:block bg-white p-5 h-full">
            {/* Category filter */}
            <div className="w-full flex flex-col gap-2 border-b border-[#E4E7E9] pb-5">
              <h1 className="font-semibold">CATEGORY</h1>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  id="category-all"
                  onChange={() => setProductShowName("All Product")}
                  checked={productShowName === "All Product"}
                  name="category"
                />
                <label htmlFor="category-all">All Product</label>
              </div>
              {allCategory?.map((cat) => (
                <div className="flex gap-2 items-center" key={cat.name}>
                  <input
                    type="radio"
                    id={`category-${cat.name}`}
                    onChange={() => setProductShowName(cat.name)}
                    checked={productShowName === cat.name}
                    name="category"
                  />
                  <label htmlFor={`category-${cat.name}`}>{cat.name}</label>
                </div>
              ))}
            </div>
            {/* Price filter */}
            <div className="w-full flex flex-col gap-2 border-b border-[#E4E7E9] pt-5">
              <h1 className="font-semibold">PRICE RANGE</h1>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  id="price-all"
                  onChange={() => setProductPrice("all")}
                  checked={productPrice === "all"}
                  name="pricerange"
                />
                <label htmlFor="price-all">All Price</label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="10000 naira"
                  onChange={() => setProductPrice("under10k")}
                  checked={productPrice === "under10k"}
                  name="pricerange"
                />
                <label htmlFor="10000 naira">Under ₦10,000</label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="11000 to 49,000 naira"
                  onChange={() => setProductPrice("11k-49k")}
                  checked={productPrice === "11k-49k"}
                  name="pricerange"
                />
                <label htmlFor="11000 to 49,000 naira">₦11,000 - ₦49,000</label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="50000 to 100,000 naira"
                  onChange={() => setProductPrice("50k-100k")}
                  checked={productPrice === "50k-100k"}
                  name="pricerange"
                />
                <label htmlFor="50000 to 100,000 naira">
                  ₦50,000 - ₦100,000
                </label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="101,000 to 500,000 naira"
                  onChange={() => setProductPrice("101k-500k")}
                  checked={productPrice === "101k-500k"}
                  name="pricerange"
                />
                <label htmlFor="101,000 to 500,000 naira">
                  ₦101,000 - ₦500,000
                </label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="500,000 to 1,000,000 naira"
                  onChange={() => setProductPrice("501k-1m")}
                  checked={productPrice === "501k-1m"}
                  name="pricerange"
                />
                <label htmlFor="500,000 to 1,000,000 naira">
                  ₦501,000 - ₦1,000,000
                </label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="1,000,000 to 10,000,000 naira"
                  onChange={() => setProductPrice("1m-10m")}
                  checked={productPrice === "1m-10m"}
                  name="pricerange"
                />
                <label htmlFor="1,000,000 to 10,000,000 naira">
                  ₦1,000,000 - ₦10,000,000
                </label>
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="radio"
                  id="10,000,000 naira"
                  onChange={() => setProductPrice("over10m")}
                  checked={productPrice === "over10m"}
                  name="pricerange"
                />
                <label htmlFor="10,000,000 naira">Over ₦10,000,000</label>
              </div>
            </div>
          </div>
          {/* Filter Section Mobile */}
          {showFilterMobile && (
            <div
              className="fixed inset-0 bg-[#0000003f] bg-opacity-40 z-40 md:hidden"
              onClick={closeFilterPanel}
            >
              <div
                style={{ padding: "20px" }}
                className="absolute top-0 left-0 w-3/4 sm:w-1/2 h-screen bg-white p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Category filter */}
                <div className="w-full flex flex-col gap-2 border-b border-[#E4E7E9] pb-5">
                  <h1 className="font-semibold">CATEGORY</h1>
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      id="category-all-mobile"
                      onChange={() => setProductShowName("All Product")}
                      checked={productShowName === "All Product"}
                      name="category"
                    />
                    <label htmlFor="category-all-mobile">All Product</label>
                  </div>
                  {allCategory?.map((cat) => (
                    <div className="flex gap-2 items-center" key={cat.name}>
                      <input
                        type="radio"
                        id={`category-mobile-${cat.name}`}
                        onChange={() => setProductShowName(cat.name)}
                        checked={productShowName === cat.name}
                        name="category"
                      />
                      <label htmlFor={`category-mobile-${cat.name}`}>
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
                {/* Price filter */}
                <div className="w-full flex flex-col gap-2 border-b border-[#E4E7E9] pt-5">
                  <h1 className="font-semibold">PRICE RANGE</h1>
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      id="price-all-mobile"
                      onChange={() => setProductPrice("all")}
                      checked={productPrice === "all"}
                      name="pricerange"
                    />
                    <label htmlFor="price-all-mobile">All Price</label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="10000 naira-mobile"
                      onChange={() => setProductPrice("under10k")}
                      checked={productPrice === "under10k"}
                      name="pricerange"
                    />
                    <label htmlFor="10000 naira-mobile">Under ₦10,000</label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="11000 to 49,000 naira-mobile"
                      onChange={() => setProductPrice("11k-49k")}
                      checked={productPrice === "11k-49k"}
                      name="pricerange"
                    />
                    <label htmlFor="11000 to 49,000 naira-mobile">
                      ₦11,000 - ₦49,000
                    </label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="50000 to 100,000 naira-mobile"
                      onChange={() => setProductPrice("50k-100k")}
                      checked={productPrice === "50k-100k"}
                      name="pricerange"
                    />
                    <label htmlFor="50000 to 100,000 naira-mobile">
                      ₦50,000 - ₦100,000
                    </label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="101,000 to 500,000 naira-mobile"
                      onChange={() => setProductPrice("101k-500k")}
                      checked={productPrice === "101k-500k"}
                      name="pricerange"
                    />
                    <label htmlFor="101,000 to 500,000 naira-mobile">
                      ₦101,000 - ₦500,000
                    </label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="500,000 to 1,000,000 naira-mobile"
                      onChange={() => setProductPrice("501k-1m")}
                      checked={productPrice === "501k-1m"}
                      name="pricerange"
                    />
                    <label htmlFor="500,000 to 1,000,000 naira-mobile">
                      ₦501,000 - ₦1,000,000
                    </label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="1,000,000 to 10,000,000 naira-mobile"
                      onChange={() => setProductPrice("1m-10m")}
                      checked={productPrice === "1m-10m"}
                      name="pricerange"
                    />
                    <label htmlFor="1,000,000 to 10,000,000 naira-mobile">
                      ₦1,000,000 - ₦10,000,000
                    </label>
                  </div>
                  <div className="w-full flex gap-2 items-center">
                    <input
                      type="radio"
                      id="10,000,000 naira-mobile"
                      onChange={() => setProductPrice("over10m")}
                      checked={productPrice === "over10m"}
                      name="pricerange"
                    />
                    <label htmlFor="10,000,000 naira-mobile">
                      Over ₦10,000,000
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Product Section */}
          <div className="w-full flex flex-col gap-4">
            {/* for search bar */}
            <div
              className="md:w-2/4 border border-[#E4E7E9] rounded-[2px] flex items-center justify-between"
              style={{ padding: "10px" }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for anything..."
                className="w-full outline-0"
              />
            </div>

            {/* for active filter section and result */}
            <div
              className="w-full flex items-center justify-between rounded-[4px] bg-[#F2F4F5]"
              style={{ padding: "12px 24px" }}
            >
              {/* for active filter only */}
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <p className="text-[14px] text-[#5F6C72]">Active Filters:</p>
                <p className="text-[14px] text-[#191C1F] font-medium">
                  {productShowName}
                </p>
              </div>

              {/* for result found number */}
              <p className="text-[#5F6C72]">
                <strong className="text-[#191C1F] text-[16px]">
                  {filteredProducts?.length.toLocaleString()}
                </strong>{" "}
                Results found.
              </p>
            </div>

            {/* for all product */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center items-center gap-2 pt-6">
                {/* Desktop pagination */}
                <div className="hidden md:flex items-center gap-2">
                  {/* Prev button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-[40px] h-[40px] cursor-pointer border-2 border-[#FA8232] rounded-full disabled:opacity-50 flex items-center justify-center text-[#FA8232]"
                  >
                    <IoIosArrowRoundBack size={24} />
                  </button>

                  {/* Page Numbers with Ellipsis */}
                  {getPaginationNumbers().map((number, idx) =>
                    number === "..." ? (
                      <span
                        key={idx}
                        className="w-[40px] h-[40px] flex items-center justify-center"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-[40px] h-[40px] cursor-pointer rounded-full flex items-center justify-center text-[#FA8232] ${
                          currentPage === number
                            ? "bg-[#FA8232] text-white"
                            : "hover:bg-gray-100 border-2 border-[#E4E7E9]"
                        }`}
                      >
                        {number}
                      </button>
                    ),
                  )}

                  {/* Next button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-[40px] h-[40px] border-2 cursor-pointer border-[#FA8232] rounded-full flex items-center justify-center text-[#FA8232] disabled:opacity-50"
                  >
                    <IoIosArrowRoundForward size={24} />
                  </button>
                </div>

                {/* Mobile pagination */}
                <div className="flex md:hidden items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 border-2 border-[#FA8232] rounded-md disabled:opacity-50 text-[#FA8232]"
                  >
                    Prev
                  </button>

                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border border-[#E4E7E9] rounded-md px-2 py-1 text-sm"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <option key={page} value={page}>
                          Page {page} of {totalPages}
                        </option>
                      ),
                    )}
                  </select>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 border-2 border-[#FA8232] rounded-md disabled:opacity-50 text-[#FA8232]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter button for mobile */}
          <div
            onClick={openFilterPanel}
            className="fixed cursor-pointer bottom-[10px] left-1/2 -translate-x-1/2 md:hidden bg-[#1d1d1d] rounded-[30px] text-white border border-[#E4E7E9]"
            style={{ padding: "10px 20px" }}
          >
            <p className="flex items-center justify-center gap-4">
              <span>Filter</span>
              <IoFilter size={18} />
            </p>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ShopPage;
