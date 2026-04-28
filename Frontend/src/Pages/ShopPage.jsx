import React, { useContext, useEffect, useMemo, useState } from "react";
import { CategoryContext } from "../CategoryContext";
// import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { IoFilter } from "react-icons/io5";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Cart";

const ShopPage = () => {
  const { allCategory, allProduct } = useContext(CategoryContext);
  console.log("All product in shoppage: ",allProduct);
  const dispatch = useDispatch();
  const [productShowName, setProductShowName] = useState("All Product");
  const [productPrice, setProductPrice] = useState("all");
  const [priceSlider, setPriceSlider] = useState(10000000);
  const [sidebarTopOffset, setSidebarTopOffset] = useState(90);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 40;

  const maxProductPrice = useMemo(() => {
    if (!allProduct?.length) return 10000000;
    return allProduct.reduce(
      (max, product) => Math.max(max, Number(product.price) || 0),
      0,
    );
  }, [allProduct]);

  useEffect(() => {
    if (maxProductPrice > 0) {
      setPriceSlider(maxProductPrice);
    }
  }, [maxProductPrice]);

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
    const updateSidebarOffset = () => {
      const navbarElement = document.querySelector(".shop-navbar");
      if (navbarElement) {
        setSidebarTopOffset(navbarElement.getBoundingClientRect().height + 15);
      }
    };

    updateSidebarOffset();
    window.addEventListener("resize", updateSidebarOffset);
    return () => window.removeEventListener("resize", updateSidebarOffset);
  }, []);

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
      const matchesSlider = Number(product.price) <= priceSlider;
      return (
        matchesCategory && matchesSearchQuery && matchesPrice && matchesSlider
      );
    });
  }, [
    allProduct,
    productShowName,
    categoryName,
    debouncedQuery,
    productPrice,
    priceSlider,
  ]);

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
  }, [productShowName, productPrice, debouncedQuery, priceSlider]);
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
            {allCategory?.map((cat, index) => (
              <div
                className="flex space-x-1 items-center px-4 py-1 text-sm"
                key={index}
              >
                <input
                  type="radio"
                  id={`category-aside-${cat}`}
                  onChange={() => setProductShowName(cat)}
                  checked={productShowName === cat}
                  name="category-aside"
                />
                <span className="material-symbols-outlined text-primary">
                  category
                </span>
                <label htmlFor={`category-aside-${cat}`}>{cat}</label>
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
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        <aside
          className="hidden lg:block w-64 flex-shrink-0 space-y-6 self-start"
          style={{ position: "sticky", top: `${sidebarTopOffset}px` }}
        >
          <div className="bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">
            <h3 className="font-inter font-bold mb-4 text-primary uppercase">
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
            <h3 className="font-inter font-bold mb-4 text-primary uppercase">
              Operating System
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Windows
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  MacBook
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded text-primary-light focus:ring-primary-light border-gray-300"
                  type="checkbox"
                />
                <span className="font-inter  text-secondary group-hover:text-primary-light transition-colors">
                  Linux
                </span>
              </label>
            </div>
            <hr className="my-6 border-gray-100" />
            <h3 className="font-inter font-bold mb-4 text-primary uppercase">
              Price Range
            </h3>
            <div className="space-y-4">
              <input
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-light"
                type="range"
                min={0}
                max={maxProductPrice}
                step={5000}
                value={priceSlider}
                onChange={(e) => setPriceSlider(Number(e.target.value))}
              />
              <div className="flex items-center justify-between text-xs text-[#5F6C72]">
                <span>Up to ₦{priceSlider.toLocaleString()}</span>
                <span className="text-[#5F6C72] font-semibold">
                  Max ₦{maxProductPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <hr className="my-6 border-gray-100" />
          </div>
        </aside>
        {/* <!-- Product Grid --> */}
        <div className="flex-1 space-y-8">
          <section className="">
            {displayedCategories.map((cat, index) => {
              const sectionProducts = cat.allProducts
                ? currentProducts
                : allProduct
                    .filter((product) =>
                      product.category.some((c) => c.name === cat.name),
                    )
                    .slice(0, 4);

              return (
                <div key={index} className="mb-8">
                  <div className="bg-primary text-white px-4 py-4 rounded-t-3xl flex items-center justify-between">
                    <div className="flex items-center justify-center space-x-1">
                      <h2 className="text-lg font-bold">{cat.name}</h2>
                      <h2 className="text-sm font-medium text-[#2ea4f2]">
                        ({filteredProducts?.length.toLocaleString()} Products
                        found)
                      </h2>
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
                    {sectionProducts.map((product, index) => (
                      <div
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 relative cursor-pointer"
                        key={index}
                        onClick={() => navigate(`/store/${product.name}`, { state: { id: product._id, product: product}})}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(addToCart(product));
                              }}
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

      <div
        className={`w-full grid ${showFilterMobile ? "md:grid-cols-[20%_80%]" : "md:grid-cols-[20%_80%]"} grid-rows-auto`}
      >
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
                {allCategory?.map((cat, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <input
                      type="radio"
                      id={`category-mobile-${index}`}
                      onChange={() => setProductShowName(cat)}
                      checked={productShowName === cat}
                      name="category"
                    />
                    <label htmlFor={`category-mobile-${categoryName}`}>
                      {cat}
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

      {/* Page Loader */}
      {/* {Array.isArray(allProduct) && allProduct.length !== 0 ? ( */}
      {/* ) : (
        <Loader />
      )} */}
    </div>
  );
};

export default ShopPage;
