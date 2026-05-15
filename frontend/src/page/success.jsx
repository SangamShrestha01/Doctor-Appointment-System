import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you! Your payment has been processed successfully.
        </p>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-xl mt-6 p-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-medium text-gray-800">
              TXN-983472
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-semibold text-green-600">
              Rs. 2,500
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-gray-800">
              eSewa 
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
        to="/doctor"
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
          >
            Go Home
          </Link>

          <Link
            to="/patient/appointments"
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
          >
            View Details
          </Link>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-400 mt-6">
          If you have any issues, please contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;