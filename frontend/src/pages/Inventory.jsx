import PageHeader from "../components/PageHeader";
import Data from "../data/Data.json";

export default function Inventory() {
  const products = Data.products;

  return (
    <div id="inventory-page" className="space-y-6">
      <PageHeader />

      <div id="inventory-page" className="p-6 space-y-6 bg-white">
      {/* Bagian Header Tabel */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Produk</h2>
        <div className="flex space-x-3">
          <button className="bg-orange-700 hover:bg-orange-950 text-white px-4 py-2 rounded-md text-sm font-medium">Add Product</button>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Produk</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Harga</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-700">{item.name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.supplier}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.quantity}</td>
                <td className="px-4 py-4 text-sm text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigasi Pagination (Bagian bawah) */}
      <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
        <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
        <span>Page 1 of {Math.ceil(products.length / 10)}</span>
        <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
      </div>
    </div>
    
    </div>
  );
}
