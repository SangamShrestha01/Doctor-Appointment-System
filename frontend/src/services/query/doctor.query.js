import { useState, useEffect } from "react";
import api from "../../api/api";

export const useDoctorQuery = (queryParams = {}) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);  // ← Add this
    const [currentPageCount, setCurrentPageCount] = useState(0);

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

            setDoctors(res.data.data || []);
            setCurrentPageCount(res.data.count || 0);
            setTotalCount(res.data.totalCount || 0);  // ← Extract totalCount
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error fetching doctors");
            setDoctors([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [JSON.stringify(queryParams)]);

    return {
        doctors,
        loading,
        error,
        totalCount,           // ← Return this
        count: currentPageCount,
        refetch: fetchDoctors
    };
};




export const useDoctorByIdQuery = (id) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDoctorById = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/doctor/${id}`);
            setDoctor(res.data.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Error fetching doctor"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDoctorById();
    }, [id]);

    return { doctor, loading, error, refetch: fetchDoctorById };
};

