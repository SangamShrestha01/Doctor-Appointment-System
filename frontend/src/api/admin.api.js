import api from "./api";

/* =========================================================
   DOCTORS - ADMIN APIs
========================================================= */

export const getAllDoctors = async () => {
  return await api.get("/admin/doctors");
};

export const getDoctorById = async (id) => {
  return await api.get(`/admin/doctors/${id}`);
};

// ✅ Accepts FormData for image upload
export const createDoctor = async (formData) => {
  return await api.post("/admin/doctors", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateDoctor = async (id, data) => {
  return await api.patch(`/admin/doctors/${id}`, data);
};

export const deleteDoctor = async (id) => {
  return await api.delete(`/admin/doctors/${id}`);
};