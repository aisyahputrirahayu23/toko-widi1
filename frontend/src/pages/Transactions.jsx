import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";

const API = "http://localhost:8000/api";
const PER_PAGE = 10;
const PAYMENT_LABELS = { tunai: "Tunai", qris: "QRIS", kartu: "Kartu" };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API}/transactions`);
      setTransactions(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const statusBadge = (method) => {
    const colors = { tunai: "bg-green-100 text-green-700", qris: "bg-blue-100 text-blue-700", kartu: "bg-purple-100 text-purple-700" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[method] ?? "bg-gray-100 text-gray-600"}`}>
        {PAYMENT_LABELS[method] ?? method}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="p-6 bg-white space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Pembayaran</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Karyawan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(tx.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {tx.items?.map(i => `${i.product?.name} (${i.quantity})`).join(", ") ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      Rp {Number(tx.total_price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 text-sm">{statusBadge(tx.payment_method)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{tx.user?.name ?? "-"}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} total={transactions.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
