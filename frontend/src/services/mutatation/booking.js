import { useState } from "react";
import api from "../../api/api";

export const useBookAppointment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const bookAppointment = async (data) => {
        setLoading(true);
        setError(null);
        console.log("sdfghjkl;xchjkl;",data);

        try {
            const res = await api.post("/appointment", data);
            setLoading(false);
            return res.data; // return success data
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Booking failed");
            setLoading(false);
            throw err;
        }
    };

    return { bookAppointment, loading, error };
};
