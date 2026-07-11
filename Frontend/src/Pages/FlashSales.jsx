import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const parseDiscountRate = (d) => {
  if (d == null) return 0;
  const n = typeof d === 'string' ? (d.includes('%') ? parseFloat(d.replace('%', '')) / 100 : parseFloat(d)) : Number(d);
  if (Number.isNaN(n)) return 0;
  return n > 1 ? n / 100 : n;
};

const formatPrice = (v) => (v == null ? '—' : Number(v).toLocaleString());

const FlashSales = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/user/flashsales`);
        setFlashSales(res.data?.data || []);
      } catch (err) {
        console.warn('Could not load flash sales', err);
        setFlashSales([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_URL]);

  const flashSaleItems = flashSales.flatMap((sale) =>
    (sale.products || []).map((p) => ({ ...p, discount: sale.discount, saleStartDate: sale.startDate, saleEndDate: sale.endDate }))
  );

  const openProduct = (product) => {
    if (!product) return;
    navigate(`/store/${encodeURIComponent(product.productName || product.name || '')}`, { state: { id: product.productId } });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-primary text-white px-4 py-4 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-lg font-bold">Flash Sales — All</h2>
        <p className="text-sm opacity-90">Showing {flashSaleItems.length} sale items</p>
      </div>
      <div className="bg-white p-4 rounded-b-2xl shadow-[12px] mt-0">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse h-48" />
            ))}
          </div>
        ) : flashSaleItems.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No flash sale items available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {flashSaleItems.map((product, idx) => {
              const orig = product.price || null;
              const rate = parseDiscountRate(product.discount);
              const discounted = orig ? Math.round(orig * (1 - rate)) : null;
              return (
                <div key={`${product.productId || idx}-${idx}`} className="group cursor-pointer" onClick={() => openProduct(product)}>
                  <div className="relative rounded-3xl overflow-hidden border border-gray-100 p-2 mb-2 bg-white hover:shadow-lg transition-shadow h-44 flex items-center justify-center">
                    <img className="w-full h-full object-contain" src={product.productImage || product.image || ''} alt={product.productName} />
                    <span className="absolute top-2 right-2 bg-orange-100 text-primary-light text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discount ? `-${product.discount}` : 'Sale'}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2 mb-1 group-hover:text-primary-light">{product.productName}</p>
                  <div className="flex items-baseline gap-2">
                    {(!orig) ? (
                      <span className="text-sm font-semibold">—</span>
                    ) : (
                      <>
                        <span className="text-[12px] text-gray-500 line-through">₦ {formatPrice(orig)}</span>
                        <span className="text-sm font-semibold text-[#111827]">₦ {formatPrice(discounted)}</span>
                      </>
                    )}
                  </div>
                  {product.saleEndDate && (
                    <p className="text-[10px] text-gray-500 mt-1">Ends {new Date(product.saleEndDate).toLocaleDateString()}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSales;
