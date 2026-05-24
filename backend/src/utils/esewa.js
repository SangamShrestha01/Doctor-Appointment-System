// import CryptoJS from "crypto-js";

// const SECRET = "8gBm/:&EnhH.1/q";
// const PRODUCT_CODE = "EPAYTEST";

// export const generateSignature = (
//   total_amount,
//   transaction_uuid,
//   product_code
// ) => {
//   const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

//   const hash = CryptoJS.HmacSHA256(message, SECRET);

//   return CryptoJS.enc.Base64.stringify(hash);
// };

// export const generateEsewaForm = ({
//   amount,
//   transaction_uuid,
//   success_url,
//   failure_url,
// }) => {
//   const total_amount = Number(amount).toFixed(2);

//   const signature = generateSignature(
//     total_amount,
//     transaction_uuid,
//     PRODUCT_CODE
//   );

//   return {
//     action: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
//     method: "POST",

//     fields: {
//       amount: total_amount,
//       tax_amount: "0",
//       total_amount: total_amount,
//       transaction_uuid: transaction_uuid,
//       product_code: PRODUCT_CODE,
//       product_service_charge: "0",
//       product_delivery_charge: "0",
//       success_url,
//       failure_url,

//       signed_field_names:
//         "total_amount,transaction_uuid,product_code",

//       signature: signature,
//     },
//   };
// };

import CryptoJS from "crypto-js";

export const ESEWA_SECRET = "8gBm/:&EnhH.1/q";
export const PRODUCT_CODE = "EPAYTEST";

export const generateTransactionUUID = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const generateSignature = ({
  total_amount,
  transaction_uuid,
  product_code,
}) => {
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

  return {
    action:
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form",

    fields: {
      amount,
      tax_amount,
      total_amount,
      transaction_uuid,
      product_code: PRODUCT_CODE,
      product_service_charge,
      product_delivery_charge,
      success_url,
      failure_url,
      signed_field_names:
        "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
};