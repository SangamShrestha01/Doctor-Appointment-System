// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const pid = searchParams.get('pid'); // Payment ID
  const encodedData = searchParams.get('data'); // Optional base64 data from eSewa

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);

        // Decode data if available
        let decodedData = null;
        if (encodedData) {
          const decodedStr = atob(encodedData);
          decodedData = JSON.parse(decodedStr);
        }

        // Fetch payment info from backend if needed
        const res = await api.get(`/payments/${pid}`);
        const payment = res.data.success ? res.data.data : null;

        setPaymentData({ ...payment, esewa: decodedData });
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load payment data');
        setLoading(false);
      }
    };

    fetchPayment();
  }, [pid, encodedData]);

  if (loading)
    return <p className="text-center mt-20">Loading payment info...</p>;

  if (!paymentData)
    return (
      <p className="text-center mt-20 text-red-600">Payment data not found</p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-700 mb-2">
          Amount Paid: ₹{paymentData.amount || paymentData.esewa?.total_amount}
        </p>
        <p className="text-gray-700 mb-2">
          Status:{' '}
          {paymentData.status || paymentData.esewa?.status || 'Completed'}
        </p>
        {paymentData.appointment?.date && (
          <p className="text-gray-700 mb-4">
            Appointment Date: {paymentData.appointment.date} at{' '}
            {paymentData.appointment.time}
          </p>
        )}

        <button
          onClick={() => navigate('/doctor')}
          className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}