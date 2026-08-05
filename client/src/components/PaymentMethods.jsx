import "../styles/Checkout.css";

function PaymentMethods({ payment, setPayment }) {
  return (
    <div className="payment-box">
      <h2>Payment Method</h2>

      <label>
        <input
          type="radio"
          checked={payment === "cod"}
          onChange={() => setPayment("cod")}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          checked={payment === "upi"}
          onChange={() => setPayment("upi")}
        />
        UPI
      </label>

      <label>
        <input
          type="radio"
          checked={payment === "card"}
          onChange={() => setPayment("card")}
        />
        Debit / Credit Card
      </label>

      <label>
        <input
          type="radio"
          checked={payment === "netbanking"}
          onChange={() => setPayment("netbanking")}
        />
        Net Banking
      </label>
    </div>
  );
}

export default PaymentMethods;