import { useState } from "react";
import api from "../../api/api";

export function useInitiatePayment() {
    const [loading, setLoading] = useState(false);

    const initiatePayment = async (appointmentId) => {
        try {
            setLoading(true);
            const res = await api.post("/payment/initiate", { appointmentId });
            setLoading(false);
            if (!res.data.success) throw new Error(res.data.message || "Payment initiation failed");
            return res.data.data; 
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    return { initiatePayment, loading };
}
