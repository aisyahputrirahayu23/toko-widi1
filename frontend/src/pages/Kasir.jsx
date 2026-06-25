import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useToast } from "../context/ToastContext";

const API = "http://localhost:8000/api";
const PAYMENT_LABELS = { tunai: "Tunai", qris: "QRIS", kartu: "Kartu" };
const PER_PAGE = 16;

export default function Kasir() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("tunai");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * PER_PAGE,
    productPage * PER_PAGE
  );

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  function handleAddToCart(product) {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function handleIncrement(productId) {
    setCart(prev =>
      prev.map(i =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(i.quantity + 1, i.product.stock) }
          : i
      )
    );
  }

  function handleDecrement(productId) {
    setCart(prev =>
      prev.map(i =>
        i.product.id === productId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  }

  function handleRemove(productId) {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }

  async function handleCheckout() {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/transactions`, {
        payment_method: paymentMethod,
        items: cart.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      });
      showToast("Transaksi berhasil!");
      setCart([]);
      setPaymentMethod("tunai");
      await fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Checkout gagal.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Memuat produk...</p>
        </div>
      ) : (
        <div className="flex gap-4 flex-1 overflow-hidden px-4 pb-4">

          {/* LEFT: Product Grid */}
          <div className="flex-1 flex flex-col bg-white rounded-xl p-4 overflow-hidden">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => { setSearch(e.target.value); setProductPage(1); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/30 mb-4"
            />

            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 flex-1 pr-1 content-start">
              {paginatedProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                    product.stock === 0
                      ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-[#8B4513] hover:shadow-md cursor-pointer"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800 leading-snug">{product.name}</p>
                  <p className="text-[#8B4513] font-bold mt-1.5 text-sm">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Stok: {product.stock}</p>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-4 text-center text-gray-400 text-sm py-10">
                  Produk tidak ditemukan.
                </p>
              )}
            </div>
            <Pagination
              page={productPage}
              total={filteredProducts.length}
              perPage={PER_PAGE}
              onChange={setProductPage}
            />
          </div>

          {/* RIGHT: Cart Panel */}
          <div className="w-80 flex flex-col bg-white rounded-xl p-4 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Keranjang</h2>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-10">Keranjang kosong</p>
              ) : (
                cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-2 border border-gray-100 rounded-xl p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-[#8B4513] font-semibold mt-0.5">
                        Rp {Number(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDecrement(item.product.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold flex items-center justify-center transition-colors"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item.product.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-400 hover:text-red-600 text-xl leading-none ml-1 shrink-0 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mt-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Total:</span>
                <span className="font-bold text-[#8B4513] text-lg">
                  Rp {cartTotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Metode Pembayaran</label>
                <div className="flex gap-1.5">
                  {["tunai", "qris", "kartu"].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        paymentMethod === m
                          ? "bg-[#8B4513] text-white border-[#8B4513]"
                          : "border-gray-300 text-gray-600 hover:border-[#8B4513]"
                      }`}
                    >
                      {PAYMENT_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || submitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all"
              >
                {submitting ? "Memproses..." : "Checkout"}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
