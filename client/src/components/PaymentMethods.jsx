import "../styles/Checkout.css";

function PaymentMethods({ payment, setPayment }) {
  return (
    <div className="payment-box">
      <h2>Payment Method</h2>

      <label>
        <input
          type="radio"
          checked={payment === "upi"}
          onChange={() => setPayment("upi")}
        />
        UPI
      </label>


    </div>
  );
}

export default PaymentMethods;