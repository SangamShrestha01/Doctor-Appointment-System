// services/mutatation/payment.js
import { useState } from "react";
import axios from "axios";
import api from "../../api/api";

export function useInitiatePayment() {
    const [loading, setLoading] = useState(false);

    const initiatePayment = async (appointmentId) => {
        try {
            setLoading(true);
            const res = await api.post("/payment/initiate", { appointmentId });
            setLoading(false);

            if (res.data.success) {
                // return payment data
                return res.data.data;
            } else {
                throw new Error(res.data.message || "Payment initiation failed");
            }
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    return { initiatePayment, loading };
}
