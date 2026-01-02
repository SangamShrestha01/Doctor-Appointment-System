import { useState, useEffect } from "react";
import api from "../../api/api";

export const useDoctorQuery = (queryParams = {}) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    // build query string from queryParams
    const buildQueryString = (params) => {
        const qs = new URLSearchParams(params).toString();
        return qs ? `?${qs}` : "";
    };

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryString = buildQueryString(queryParams);
            const res = await api.get(`/doctor${queryString}`);
            setDoctors(res.data.data);
            setCount(res.data.count);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [JSON.stringify(queryParams)]); // refetch when queryParams change

    return { doctors, loading, error, count, refetch: fetchDoctors };
};
