import api from "./api";

export const getAllDoctors = async () => {
  return await api.get("/admin/doctors");
};

export const getDoctorById = async (id) => {
  return await api.get(`/admin/doctors/${id}`);
};

export const createDoctor = async (formData) => {
  return await api.post("/admin/doctors", formData);
};

export const updateDoctor = async (id, data, config = {}) => {
  return await api.patch(`/admin/doctors/${id}`, data, config);
};

export const deleteDoctor = async (id) => {
  return await api.delete(`/admin/doctors/${id}`);
};