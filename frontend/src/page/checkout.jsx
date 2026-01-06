// PaymentCheckout.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api';

export default function PaymentCheckout() {
  const { paymentId } = useParams();

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const res = await api.post('/payment/initiate', { paymentId });

        if (res.data.success) {
          // Backend already returns full <form> HTML with JS
          const div = document.createElement('div');
          div.innerHTML = res.data.data; // assuming your backend sends raw form HTML
          document.body.appendChild(div);
        } else {
          toast.error(res.data.message || 'Payment initiation failed');
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            'Payment initiation failed'
        );
      }
    };

    initiatePayment();
  }, [paymentId]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-slate-700">Redirecting to payment...</p>
    </div>
  );
}
