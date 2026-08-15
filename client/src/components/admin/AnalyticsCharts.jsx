import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#1976d2", "#43a047", "#ef6c00", "#8e24aa", "#d32f2f"];

function AnalyticsCharts({ stats }) {
  const revenueData = stats?.monthlyRevenue || [];

  const statusData =
    stats?.orderStatus?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const categoryData =
    stats?.salesByCategory?.map((item) => ({
      name: item._id,
      sales: item.sales,
    })) || [];

  const paymentData =
    stats?.revenueByPayment?.map((item) => ({
      name: item._id?.toUpperCase(),
      revenue: item.total,
    })) || [];

  return (
    <div className="analytics-grid">
      <div className="chart-card">
        <h2>Revenue Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1976d2"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2>Orders by Status</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2>Sales by Category</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#8e24aa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h2>Revenue by Payment</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="revenue"
              nameKey="name"
              outerRadius={100}
              label
            >
              {paymentData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsCharts;
