import React, { useEffect, useState } from "react";
import { getDoctorById, updateDoctor } from "../../api/admin.api";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    speciality: "",
    fees: "",
  });

  const fetchDoctor = async () => {
    try {
      const res = await getDoctorById(id);
      const doc = res.data.data;

      setForm({
        name: doc.user.name,
        speciality: doc.speciality,
        fees: doc.fees,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(id, form);
      alert("Doctor updated successfully");
      navigate(ROUTES.ADMIN_DOCTORS);
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

      <h1 className="text-2xl font-bold mb-4">Edit Doctor</h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="speciality"
          value={form.speciality}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="fees"
          value={form.fees}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update Doctor
        </button>

      </form>

    </div>
  );
};

export default EditDoctor;