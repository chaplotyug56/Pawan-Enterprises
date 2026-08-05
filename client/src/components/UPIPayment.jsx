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

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    BUSINESS_NAME
  )}&am=${totalAmount}&cu=INR`;

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
          <li>Scan the QR code.</li>
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