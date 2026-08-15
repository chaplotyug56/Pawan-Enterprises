import { useState } from "react";

function RecentCustomers({ customers }) {
  const [showAll, setShowAll] = useState(false);
  const displayedCustomers = showAll ? customers : customers?.slice(0, 5) || [];

  if (!displayedCustomers.length) return null;

  return (
    <div className="recent-orders">
      <h2>Recent Customers</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {displayedCustomers.map((customer) => (
            <tr key={customer._id}>
              <td>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>
                  {customer.name}
                </span>
              </td>
              <td>{customer.email}</td>
              <td>
                {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers?.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => setShowAll(!showAll)} className="edit-btn">
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentCustomers;
