import React, { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

function UPIPayment({
  totalAmount,
  paymentTime,
  setPaymentTime,
  paymentScreenshot,
  setPaymentScreenshot,
}) {
  const [copied, setCopied] = useState(false);

  const UPI_ID = "9929119290@okbizaxis";
  const BUSINESS_NAME = "Pawan Enterprises";

  const baseUpiParams = `pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${totalAmount}&cu=INR`;
  const upiLink = `upi://pay?${baseUpiParams}`;
  const gpayLink = `tez://upi/pay?${baseUpiParams}`;
  const phonepeLink = `phonepe://pay?${baseUpiParams}`;
  const paytmLink = `paytmmp://pay?${baseUpiParams}`;

  const handleFallback = () => {
    const startTime = Date.now();
    setTimeout(() => {
      if (Date.now() - startTime < 2500) {
        toast.info("Could not open the app automatically. Please scan the QR code.", { autoClose: 5000 });
      }
    }, 2000);
  };

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);

      setCopied(true);
      toast.success("UPI ID copied");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Unable to copy UPI ID");
    }
  };

  const fillCurrentTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    setPaymentTime(`${hours}:${minutes}`);
  };

  return (
    <div className="upi-payment-box">

      <h2 className="upi-title">
        Pay Using UPI
      </h2>

      <div className="amount-card">

        <h1>₹{totalAmount}</h1>

        <p>Please pay the exact amount.</p>

      </div>

      <div className="qr-card">

        <QRCode
          value={upiLink}
          size={220}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
          <a href={gpayLink} className="secondary-btn" style={{ textDecoration: "none", fontSize: "14px", padding: "8px 12px" }} onClick={handleFallback}>
             Google Pay
          </a>
          <a href={phonepeLink} className="secondary-btn" style={{ textDecoration: "none", fontSize: "14px", padding: "8px 12px" }} onClick={handleFallback}>
             PhonePe
          </a>
          <a href={paytmLink} className="secondary-btn" style={{ textDecoration: "none", fontSize: "14px", padding: "8px 12px" }} onClick={handleFallback}>
             Paytm
          </a>
          <a href={upiLink} className="secondary-btn" style={{ textDecoration: "none", fontSize: "14px", padding: "8px 12px" }} onClick={handleFallback}>
             Other UPI Apps
          </a>
        </div>

      </div>

      <div className="upi-id-card">

        <p className="upi-label">
          UPI ID
        </p>

        <div className="upi-row">

          <span>{UPI_ID}</span>

          <button
            type="button"
            className="copy-btn"
            onClick={copyUPI}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

        </div>

      </div>

      <div className="payment-details">

        <h3>Payment Details</h3>

        <label>
          Payment Time
        </label>

        <div className="payment-time-row">

          <input
            type="time"
            value={paymentTime}
            onChange={(e) =>
              setPaymentTime(e.target.value)
            }
          />

          <button
            type="button"
            className="secondary-btn"
            onClick={fillCurrentTime}
          >
            Use Current Time
          </button>

        </div>

       

        <label>
          Upload Payment Screenshot
          <small> (Optional)</small>
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPaymentScreenshot(
              e.target.files[0]
            )
          }
        />

        {paymentScreenshot && (

          <div className="preview-box">

            <img
              src={URL.createObjectURL(paymentScreenshot)}
              alt="Payment Screenshot"
              className="payment-preview"
            />

          </div>

        )}

      </div>

      <div className="payment-info">

        <h4>Instructions</h4>

        <ol>
          <li>Scan the QR code OR click "Pay via UPI App".</li>
          <li>Pay the exact amount.</li>
          <li>Click "Use Current Time".</li>
          
          <li>Uploading the screenshot is optional.</li>
          <li>Click Place Order.</li>
        </ol>

      </div>

    </div>
  );
}

export default UPIPayment;