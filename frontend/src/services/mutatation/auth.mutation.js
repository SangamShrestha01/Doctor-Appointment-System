import api from "../../api/api";

export const registerUser = async (formData) => {
    try {
        const res = await api.post('/auth/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};


export const loginUser = async (data) => {
    try {
        const res = await api.post('/auth/login', data);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};
