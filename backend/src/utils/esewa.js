import CryptoJS from "crypto-js";

export const ESEWA_SECRET = "8gBm/:&EnhH.1/q";
export const PRODUCT_CODE = "EPAYTEST";

export const generateTransactionUUID = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const generateSignature = ({ total_amount, transaction_uuid, product_code }) => {
  const message =
    `total_amount=${total_amount},` +
    `transaction_uuid=${transaction_uuid},` +
    `product_code=${product_code}`;

  const hash = CryptoJS.HmacSHA256(message, ESEWA_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
};

export const generateEsewaForm = ({
  amount,
  tax_amount = 0,
  product_service_charge = 0,
  product_delivery_charge = 0,
  transaction_uuid,
  success_url,
  failure_url,
}) => {
  const total_amount =
    Number(amount) +
    Number(tax_amount) +
    Number(product_service_charge) +
    Number(product_delivery_charge);

  const signature = generateSignature({
    total_amount,
    transaction_uuid,
    product_code: PRODUCT_CODE,
  });

  return `
    <form id="esewaForm" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
      <input type="hidden" name="amount" value="${amount}" />
      <input type="hidden" name="tax_amount" value="${tax_amount}" />
      <input type="hidden" name="total_amount" value="${total_amount}" />
      <input type="hidden" name="transaction_uuid" value="${transaction_uuid}" />
      <input type="hidden" name="product_code" value="${PRODUCT_CODE}" />
      <input type="hidden" name="product_service_charge" value="${product_service_charge}" />
      <input type="hidden" name="product_delivery_charge" value="${product_delivery_charge}" />
      <input type="hidden" name="success_url" value="${success_url}" />
      <input type="hidden" name="failure_url" value="${failure_url}" />
      <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
      <input type="hidden" name="signature" value="${signature}" />
    </form>
  `;
};
