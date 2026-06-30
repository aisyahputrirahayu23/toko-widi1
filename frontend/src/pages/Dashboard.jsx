import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MdOutlineInventory2,
  MdOutlineAttachMoney,
  MdOutlineReceiptLong,
  MdOutlinePeopleAlt,
  MdOutlineWarning,
  MdTrendingUp,
} from "react-icons/md";
import PageHeader from "../components/PageHeader";

const API = "http://localhost:8000/api";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-base-200 rounded-xl shadow-md px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-[#8B4513]">{fmt(payload[0].value)}</p>
    </div>
  );
}

function SalesChart({ data, loading }) {
  const chartData = data.map((d) => ({
    tanggal: new Date(d.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    total: d.total,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-[#3E2C1C] flex items-center gap-2">
            <MdOutlineAttachMoney className="text-[#8B4513] text-xl" />
            Statistik Penjualan
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Pendapatan harian</p>
        </div>
        {!loading && data.length > 0 && (
          <span className="badge badge-sm" style={{ backgroundColor: "#f5ede6", color: "#8B4513" }}>
            {data.length} hari
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-md text-[#8B4513]" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-gray-300 gap-3">
          <MdTrendingUp className="text-5xl" />
          <p className="text-sm">Belum ada data penjualan</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8B4513" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8B4513"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              dot={{ r: 4, fill: "#8B4513", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#8B4513", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [reports, setReports]   = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/reports`),
      axios.get(`${API}/inventory`),
      axios.get(`${API}/users`),
    ])
      .then(([r, inv, u]) => {
        setReports(r.data);
        setProducts(inv.data);
        setUsers(u.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const expiredCount = products.filter(
    (p) => p.expired_date && p.expired_date < today
  ).length;

  const stats = [
    {
      title: "Total Produk",
      value: loading ? "—" : products.length,
      desc: "Produk tersedia",
      icon: <MdOutlineInventory2 className="text-2xl" />,
      color: "text-[#8B4513]",
      bg: "bg-[#f5ede6]",
    },
    {
      title: "Total Pendapatan",
      value: loading ? "—" : fmt(reports?.total_pendapatan),
      desc: "Semua waktu",
      icon: <MdOutlineAttachMoney className="text-2xl" />,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Total Transaksi",
      value: loading ? "—" : reports?.jumlah_transaksi ?? 0,
      desc: "Semua waktu",
      icon: <MdOutlineReceiptLong className="text-2xl" />,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: "Produk Kedaluwarsa",
      value: loading ? "—" : expiredCount,
      desc: "Perlu ditindaklanjuti",
      icon: <MdOutlineWarning className="text-2xl" />,
      color: expiredCount > 0 ? "text-error" : "text-gray-400",
      bg: expiredCount > 0 ? "bg-error/10" : "bg-gray-100",
    },
    {
      title: "Total Karyawan",
      value: loading ? "—" : users.filter(u => u.role === "karyawan").length,
      desc: "Pengguna aktif",
      icon: <MdOutlinePeopleAlt className="text-2xl" />,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  const recentTx   = reports?.transaksi?.slice(0, 5) ?? [];
  const topProducts = reports?.produk_terlaris ?? [];

  return (
    <div className="space-y-6 p-2">
      <PageHeader />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="stat bg-white rounded-2xl shadow-sm border border-base-200 py-5 px-5">
            <div className={`stat-figure ${s.color}`}>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
            </div>
            <div className="stat-title text-xs text-gray-500 font-medium">{s.title}</div>
            <div className={`stat-value text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            <div className="stat-desc text-gray-400 text-xs">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* SALES CHART */}
      <SalesChart data={reports?.grafik_per_hari ?? []} loading={loading} />

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* TRANSAKSI TERBARU */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-base-200 p-6">
          <h2 className="text-base font-bold text-[#3E2C1C] mb-4 flex items-center gap-2">
            <MdOutlineReceiptLong className="text-[#8B4513] text-xl" />
            Transaksi Terbaru
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-gray-400 text-xs">
                  <th>ID</th>
                  <th>Karyawan</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <span className="loading loading-spinner loading-sm text-[#8B4513]" />
                    </td>
                  </tr>
                ) : recentTx.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  recentTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-base-50">
                      <td className="font-semibold text-[#8B4513]">#{tx.id}</td>
                      <td className="text-[#3E2C1C]">{tx.user?.name ?? "—"}</td>
                      <td className="font-semibold text-[#3E2C1C]">{fmt(tx.total_price)}</td>
                      <td>
                        <span className="badge badge-sm badge-ghost capitalize">
                          {tx.payment_method}
                        </span>
                      </td>
                      <td className="text-gray-400 text-xs">
                        {new Date(tx.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODUK TERLARIS */}
        <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-6">
          <h2 className="text-base font-bold text-[#3E2C1C] mb-4 flex items-center gap-2">
            <MdTrendingUp className="text-[#8B4513] text-xl" />
            Produk Terlaris
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-sm text-[#8B4513]" />
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, i) => (
                <div key={item.product_id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#f5ede6] flex items-center justify-center text-xs font-bold text-[#8B4513] shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3E2C1C] text-sm truncate">
                      {item.product?.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">{item.total_qty} terjual</p>
                  </div>
                  <span className="text-xs font-bold text-[#8B4513] shrink-0">
                    {fmt(item.total_revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
