import crypto from "crypto-js";

// Random string generator for transaction IDs
export const generateRandomString = (length = 15) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// eSewa sandbox form generator
export const generateEsewaForm = ({ amount, transactionId, successUrl, failureUrl }) => {
  return `
    <form id="esewaForm" action="https://rc-epay.esewa.com.np/epay/main" method="POST">
      <input type="hidden" name="tAmt" value="${amount}" />
      <input type="hidden" name="amt" value="${amount}" />
      <input type="hidden" name="txAmt" value="0" />
      <input type="hidden" name="psc" value="0" />
      <input type="hidden" name="pdc" value="0" />
      <input type="hidden" name="scd" value="EPAYTEST" />
      <input type="hidden" name="pid" value="${transactionId}" />
      <input type="hidden" name="su" value="${successUrl}" />
      <input type="hidden" name="fu" value="${failureUrl}" />
    </form>
    <script>
      document.getElementById("esewaForm").submit();
    </script>
  `;
};
