import {
  MdOutlineInventory2,
  MdOutlineAttachMoney,
  MdOutlineShoppingCart,
  MdOutlinePeopleAlt,
} from "react-icons/md";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "0",
      icon: <MdOutlineInventory2 />,
    },
    {
      title: "Revenue",
      value: "Rp 0",
      icon: <MdOutlineAttachMoney />,
    },
    {
      title: "Orders",
      value: "0",
      icon: <MdOutlineShoppingCart />,
    },
    {
      title: "Expired Products",
      value: "0",
      icon: <MdOutlinePeopleAlt />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <PageHeader />
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#8B4513] flex items-center justify-center text-white font-bold">
            A
          </div>

          <div>
            <h3 className="font-semibold text-[#3E2C1C]">Admin</h3>

            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>

                <h2 className="text-3xl font-bold text-[#3E2C1C] mt-3">
                  {item.value}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#f5ede6] flex items-center justify-center text-3xl text-[#8B4513]">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART + PRODUCTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3E2C1C] mb-2">
            Sales Overview
          </h2>

          <p className="text-gray-500 text-sm mb-6">Statistik penjualan toko</p>

          <div className="h-[320px] rounded-2xl bg-[#f5f1eb] flex items-center justify-center text-gray-400 text-lg">
            Chart Coming Soon 📈
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3E2C1C] mb-6">
            Top Products
          </h2>

          <div className="space-y-5">
            {[
              "Keripik Pisang",
              "Dodol Garut",
              "Kopi Lampung",
              "Brownies Kering",
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5ede6]"></div>

                  <div>
                    <h3 className="font-semibold text-[#3E2C1C]">{product}</h3>

                    <p className="text-sm text-gray-500">Best Seller</p>
                  </div>
                </div>

                <span className="text-sm font-bold text-[#8B4513]">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#3E2C1C] mb-2">
          Recent Orders
        </h2>

        <p className="text-gray-500 text-sm mb-6">Daftar pesanan terbaru</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                {
                  id: "#001",
                  customer: "Andi",
                  product: "Keripik Pisang",
                  amount: "Rp 120.000",
                  status: "Completed",
                },
                {
                  id: "#002",
                  customer: "Budi",
                  product: "Kopi Lampung",
                  amount: "Rp 80.000",
                  status: "Pending",
                },
                {
                  id: "#003",
                  customer: "Sinta",
                  product: "Dodol Garut",
                  amount: "Rp 150.000",
                  status: "Completed",
                },
              ].map((order, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-5 font-semibold">{order.id}</td>

                  <td>{order.customer}</td>

                  <td>{order.product}</td>

                  <td>{order.amount}</td>

                  <td>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
