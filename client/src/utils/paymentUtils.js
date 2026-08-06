import { toast } from "react-toastify";

/**
 * Generates a UPI Deep Link and attempts to open installed UPI apps on mobile devices.
 * Features a fallback timeout if no app is available or if opened on a desktop.
 *
 * @param {Object} options
 * @param {string} options.upiId - The Merchant UPI ID (e.g., john@upi)
 * @param {string} options.merchantName - The Merchant Name
 * @param {number|string} options.amount - The exact amount to pay
 * @param {string} [options.transactionNote] - Optional note/order ID
 */
export const openUPIApp = ({ upiId, merchantName, amount, transactionNote = "" }) => {
  // Construct the standard UPI Deep Link
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Record the time before trying to open the app
  const startTime = Date.now();

  // Attempt to open the UPI deep link
  window.location.href = upiLink;

  // Set a timeout to detect if the app switch failed.
  // If the user hasn't left the page after 2 seconds, it likely failed.
  setTimeout(() => {
    const endTime = Date.now();
    // If the time difference is slightly over 2000ms, the app switch didn't happen
    // (If it did happen, the browser would be suspended and the timeout would fire much later)
    if (endTime - startTime < 2500) {
      toast.info(
        "Could not automatically open a UPI app. Please scan the QR code instead.",
        { autoClose: 5000 }
      );
    }
  }, 2000);
};
