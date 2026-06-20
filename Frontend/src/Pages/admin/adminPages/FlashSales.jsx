const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiClock,
  FiShoppingBag,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const FlashSales = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newFlashSale, setNewFlashSale] = useState({
    discount: "",
    startDate: "",
    endDate: "",
  });

  const getProductImage = useCallback((product) => {
    if (!product) return "";
    if (product.productImage) return product.productImage;
    if (product.image) {
      return Array.isArray(product.image)
        ? product.image[0] || ""
        : product.image;
    }
    return "";
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [productPrices, setProductPrices] = useState({});

  const loadFlashSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${ADMIN_ROUTE}/flashsales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.status) {
        setFlashSales(response.data.data);
      } else {
        setFlashSales([]);
      }
    } catch (error) {
      console.warn("Flash sales endpoint not available yet.", error);
      setFlashSales([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await axios.get(`${API_URL}/${ADMIN_ROUTE}/getAllProducts`);
      if (res.data?.status) setProducts(res.data.data || []);
      else setProducts([]);
    } catch {
      console.warn("Could not load products for flash sale modal");
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadFlashSales();
    loadProducts();
  }, [loadFlashSales, loadProducts]);

  const handleOpenModal = useCallback(() => setShowCreateModal(true), []);
  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
    setSelectedProducts([]);
    setNewFlashSale({ discount: "", startDate: "", endDate: "" });
  }, []);

  const handleNewFlashSaleChange = useCallback((field, value) => {
    setNewFlashSale((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleProductSelection = useCallback(
    (product) => {
      setSelectedProducts((prev) => {
        const exists = prev.some((item) => item.productId === product._id);
        if (exists) {
          return prev.filter((item) => item.productId !== product._id);
        }
        return [
          ...prev,
          {
            productId: product._id,
            productName: product.name,
            productImage: getProductImage(product),
          },
        ];
      });
    },
    [getProductImage],
  );

  const submitFlashSale = useCallback(async () => {
    const { discount, startDate, endDate } = newFlashSale;
    if (selectedProducts.length === 0 || !discount || !startDate || !endDate) {
      toast.error(
        "Please select at least one product and fill in discount and dates",
      );
      return;
    }

    try {
      const payload = { products: selectedProducts, ...newFlashSale };
      let response;
      if (editingSaleId) {
        try {
          response = await axios.put(
            `${API_URL}/${ADMIN_ROUTE}/flashsales/${editingSaleId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } catch {
          response = await axios.post(
            `${API_URL}/${ADMIN_ROUTE}/flashsales`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          toast.info(
            "Update endpoint not available; created a new flash sale instead.",
          );
        }
      } else {
        response = await axios.post(
          `${API_URL}/${ADMIN_ROUTE}/flashsales`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      if (response.data?.status) {
        toast.success(
          editingSaleId
            ? "Flash sale updated"
            : "Flash sale created successfully",
        );
        handleCloseModal();
        setEditingSaleId(null);
        loadFlashSales();
      }
    } catch (error) {
      console.error("Failed to create flash sale:", error);
      toast.error(error.response?.data?.message || "Could not save flash sale");
    }
  }, [
    newFlashSale,
    selectedProducts,
    editingSaleId,
    API_URL,
    token,
    handleCloseModal,
    loadFlashSales,
  ]);

  const handleEdit = useCallback((sale) => {
    setEditingSaleId(sale._id || null);
    setNewFlashSale({
      discount: sale.discount || "",
      startDate: sale.startDate
        ? new Date(sale.startDate).toISOString().slice(0, 10)
        : "",
      endDate: sale.endDate
        ? new Date(sale.endDate).toISOString().slice(0, 10)
        : "",
      title: sale.title || "",
      description: sale.description || "",
    });
    const mapped = (sale.products || []).map((p) => ({
      productId: p.productId,
      productName: p.productName,
      productImage: p.productImage,
    }));
    setSelectedProducts(mapped);
    setShowCreateModal(true);
  }, []);

  const goToProduct = useCallback(
    async (productId) => {
      try {
        const res = await axios.get(
          `${API_URL}/${ADMIN_ROUTE}/product/${productId}`,
        );
        if (res.data?.status && res.data.data) {
          const product = res.data.data;
          navigate(`/store/${encodeURIComponent(product.name)}`, {
            state: { id: product._id, product },
          });
        } else {
          toast.error("Product details not available");
        }
      } catch {
        toast.error("Failed to load product details");
      }
    },
    [API_URL, token, navigate],
  );

  const filteredSales = useMemo(() => {
    return flashSales.filter((sale) => {
      const title = sale.title?.toLowerCase() || "";
      const product = sale.productName?.toLowerCase() || "";
      const matchesSearch =
        title.includes(searchTerm.toLowerCase()) ||
        product.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && sale.isActive) ||
        (statusFilter === "upcoming" && sale.status === "upcoming") ||
        (statusFilter === "expired" && sale.status === "expired");
      return matchesSearch && matchesStatus;
    });
  }, [flashSales, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      active: flashSales.filter((sale) => sale.isActive).length,
      total: flashSales.length,
      upcoming: flashSales.filter((sale) => sale.status === "upcoming").length,
    }),
    [flashSales],
  );

  useEffect(() => {
    const fetchPrices = async () => {
      for (const sale of filteredSales || []) {
        const pid = sale.products?.[0]?.productId;
        if (!pid || productPrices[pid]) continue;
        try {
          const res = await axios.get(
            `${API_URL}/${ADMIN_ROUTE}/product/${pid}`,
          );
          if (res.data?.status && res.data.data) {
            setProductPrices((prev) => ({
              ...prev,
              [pid]: res.data.data.price,
            }));
          }
        } catch {
          // ignore
        }
      }
    };
    fetchPrices();
  }, [filteredSales, API_URL, productPrices]);

  return (
    <div className="w-full min-h-screen space-y-8">
      <ToastContainer />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#0F766E]">
            Admin / Promotions
          </p>
          <h1 className="text-3xl font-extrabold text-[#111827]">
            Flash Sales
          </h1>
          <p className="max-w-2xl text-sm text-[#6B7280] mt-2">
            Create and manage time-limited promotions to drive urgency and boost
            conversions.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#115E52]"
        >
          <FiPlus size={16} />
          New flash sale
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  Create flash sale
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Add a new limited-time campaign for a product.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        Select products
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        Choose one or more products to include in this flash
                        sale.
                      </p>
                    </div>
                    <div className="text-sm font-medium text-[#0F766E]">
                      {selectedProducts.length} product
                      {selectedProducts.length === 1 ? "" : "s"} selected
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-auto py-1">
                    {productsLoading ? (
                      <div className="text-sm text-[#94A3B8]">
                        Loading products...
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-sm text-[#94A3B8]">
                        No products found
                      </div>
                    ) : (
                      products.map((p) => {
                        const selected = selectedProducts.some(
                          (item) => item.productId === p._id,
                        );
                        return (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => toggleProductSelection(p)}
                            className={`flex flex-col items-start gap-2 rounded-3xl border p-3 text-left transition ${selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E5E7EB] hover:shadow-sm"}`}
                          >
                            <div className="w-full h-24 rounded-3xl bg-[#F8FAFF] overflow-hidden flex items-center justify-center">
                              {getProductImage(p) ? (
                                <img
                                  src={getProductImage(p)}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="text-xs text-[#94A3B8]">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="w-full">
                              <p className="text-[12px] font-semibold text-[#111827] truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-[#6B7280] mt-1">
                                ₦ {p.price?.toLocaleString?.() || p.price}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">
                  Discount
                </label>
                <input
                  value={newFlashSale.discount}
                  onChange={(e) =>
                    handleNewFlashSaleChange("discount", e.target.value)
                  }
                  placeholder="e.g. 20%"
                  className="w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">
                  Start date
                </label>
                <input
                  type="date"
                  value={newFlashSale.startDate}
                  onChange={(e) =>
                    handleNewFlashSaleChange("startDate", e.target.value)
                  }
                  className="w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">
                  End date
                </label>
                <input
                  type="date"
                  value={newFlashSale.endDate}
                  onChange={(e) =>
                    handleNewFlashSaleChange("endDate", e.target.value)
                  }
                  className="w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCloseModal}
                className="rounded-full border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F8FAFF]"
              >
                Cancel
              </button>
              <button
                onClick={submitFlashSale}
                className="rounded-full bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#115E52]"
              >
                Create flash sale
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">
            Active Sales
          </p>
          <p className="mt-4 text-4xl font-bold text-[#111827]">
            {stats.active}
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">
            Currently live promotions.
          </p>
        </div>
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">
            Upcoming
          </p>
          <p className="mt-4 text-4xl font-bold text-[#047857]">
            {stats.upcoming}
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">
            Scheduled sales starting soon.
          </p>
        </div>
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">
            Total campaigns
          </p>
          <p className="mt-4 text-4xl font-bold text-[#111827]">
            {stats.total}
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">
            All flash sale campaigns in the system.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Active campaigns
            </h2>
            <p className="text-sm text-[#6B7280]">
              Manage flash sales and track key details in one place.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto">
            <div className="relative rounded-3xl border border-[#E5E7EB] bg-[#F8FAFF] px-4 py-3">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                size={18}
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search flash sales"
                className="w-full rounded-3xl border-0 bg-transparent pl-10 text-sm text-[#111827] outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-3xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="p-4 mt-6 overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white">
          {/* Desktop Table */}
          <table className="p-4 min-w-[720px] hidden md:table w-full border-collapse">
            <thead className="bg-[#F8FAFF] text-left text-xs uppercase tracking-[0.2em] text-[#64748B]">
              <tr>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-sm text-[#94A3B8]"
                  >
                    Loading flash sales...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-sm text-[#94A3B8]"
                  >
                    No flash sales available.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr
                    key={sale._id || sale.title}
                    className="pl-4 border-t border-[#E5E7EB] bg-white hover:bg-[#F8FAFF] transition"
                  >
                    <td className="p-3 text-sm">
                      <div className="text-sm font-semibold text-[#111827]">
                        {sale.title}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {sale.description || "High-converting promotion"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#475569]">
                      <div className="pl-14 flex items-center gap-4 relative">
                        <div className="w-12 h-12 rounded-lg bg-[#F8FAFF] overflow-hidden flex items-center justify-center relative group">
                          {sale.products?.[0]?.productImage ||
                          sale.productImage ||
                          (sale.product &&
                            (Array.isArray(sale.product.image)
                              ? sale.product.image[0]
                              : sale.product.image)) ? (
                            <img
                              src={
                                sale.products?.[0]?.productImage ||
                                sale.productImage ||
                                (sale.product &&
                                  (Array.isArray(sale.product.image)
                                    ? sale.product.image[0]
                                    : sale.product.image))
                              }
                              alt={
                                sale.products?.[0]?.productName ||
                                sale.productName
                              }
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() =>
                                goToProduct(
                                  sale.products?.[0]?.productId ||
                                    sale.productId,
                                )
                              }
                            />
                          ) : (
                            <div className="text-xs text-[#94A3B8]">
                              No image
                            </div>
                          )}
                          {sale.products?.[0]?.inventory <= 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                Out
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="truncate pr-14">
                          <div
                            className=" text-sm font-semibold text-[#111827] cursor-pointer"
                            onClick={() =>
                              goToProduct(
                                sale.products?.[0]?.productId || sale.productId,
                              )
                            }
                          >
                            {sale.products?.length
                              ? `${sale.products[0].productName}${sale.products.length > 1 ? ` +${sale.products.length - 1} more` : ""}`
                              : sale.productName || "Featured product"}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-1">
                            ₦{" "}
                            {productPrices[sale.products?.[0]?.productId]
                              ? Number(
                                  productPrices[sale.products[0].productId],
                                ).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-[#111827]">
                      {sale.discount || "20%"} off
                    </td>
                    <td className="p-4 text-sm text-[#475569]">
                      {sale.startDate
                        ? `${new Date(sale.startDate).toLocaleDateString()} → ${new Date(sale.endDate).toLocaleDateString()}`
                        : "TBD"}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${sale.status === "active" ? "bg-[#ECFDF5] text-[#047857]" : sale.status === "upcoming" ? "bg-[#F8FAFF] text-[#1D4ED8]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}
                      >
                        {sale.status || "inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="rounded-full bg-[#EFF6FF] px-4 py-2 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {loading ? (
              <div className="rounded-lg sm:rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-4 sm:p-6 text-center text-sm text-[#94A3B8]">
                Loading flash sales...
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="rounded-lg sm:rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-4 sm:p-6 text-center text-sm text-[#94A3B8]">
                No flash sales available
              </div>
            ) : (
              filteredSales.map((sale) => (
                <div
                  key={sale._id || sale.title}
                  className="rounded-lg sm:rounded-2xl border border-[#E5E7EB] bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-md overflow-hidden"
                >
                  {/* Header: Title + Status */}
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-[#111827] truncate">
                        {sale.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1 truncate">
                        {sale.description || "High-converting promotion"}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 inline-flex rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap ${sale.status === "active" ? "bg-[#ECFDF5] text-[#047857]" : sale.status === "upcoming" ? "bg-[#F8FAFF] text-[#1D4ED8]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}
                    >
                      {sale.status || "inactive"}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-[#E5E7EB]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#F8FAFF] flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                      {sale.products?.[0]?.productImage ||
                      sale.productImage ||
                      (sale.product &&
                        (Array.isArray(sale.product.image)
                          ? sale.product.image[0]
                          : sale.product.image)) ? (
                        <>
                          <img
                            src={
                              sale.products?.[0]?.productImage ||
                              sale.productImage ||
                              (sale.product &&
                                (Array.isArray(sale.product.image)
                                  ? sale.product.image[0]
                                  : sale.product.image))
                            }
                            alt={sale.products?.[0]?.productName}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() =>
                              goToProduct(
                                sale.products?.[0]?.productId || sale.productId,
                              )
                            }
                          />
                          {sale.products?.[0]?.inventory <= 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                Out
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-[#94A3B8]">No image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-[#111827] cursor-pointer truncate"
                        onClick={() =>
                          goToProduct(
                            sale.products?.[0]?.productId || sale.productId,
                          )
                        }
                      >
                        {sale.products?.length
                          ? `${sale.products[0].productName}${sale.products.length > 1 ? ` +${sale.products.length - 1}` : ""}`
                          : sale.productName || "Featured"}
                      </p>
                      <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
                        ₦{" "}
                        {productPrices[sale.products?.[0]?.productId]
                          ? Number(
                              productPrices[sale.products[0].productId],
                            ).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 mb-3 sm:mb-4">
                    <div className="rounded-lg bg-[#F8FAFF] p-2 sm:p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                        Discount
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#111827] mt-1.5">
                        {sale.discount || "20%"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFF] p-2 sm:p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                        Start
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#111827] mt-1.5">
                        {sale.startDate
                          ? `${new Date(sale.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : "TBD"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFF] p-2 sm:p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                        End
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#111827] mt-1.5">
                        {sale.endDate
                          ? `${new Date(sale.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : "TBD"}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleEdit(sale)}
                    className="w-full rounded-lg bg-[#0F766E] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#115E52]"
                  >
                    Edit Sale
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(FlashSales);
