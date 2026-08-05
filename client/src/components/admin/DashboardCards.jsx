import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaRupeeSign,
  } from "react-icons/fa";
  
  function DashboardCards({ stats }) {
    const cards = [
      {
        title: "Products",
        value: stats?.totalProducts || 0,
        icon: <FaBoxOpen />,
        color: "#1976d2",
      },
      {
        title: "Orders",
        value: stats?.totalOrders || 0,
        icon: <FaShoppingCart />,
        color: "#43a047",
      },
      {
        title: "Users",
        value: stats?.totalUsers || 0,
        icon: <FaUsers />,
        color: "#8e24aa",
      },
      {
        title: "Revenue",
        value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
        icon: <FaRupeeSign />,
        color: "#ef6c00",
      },
    ];
  
    return (
      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{
              borderTop: `5px solid ${card.color}`,
            }}
          >
            <div
              className="dashboard-icon"
              style={{
                background: card.color,
              }}
            >
              {card.icon}
            </div>
  
            <div>
              <h2>{card.value}</h2>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default DashboardCards;