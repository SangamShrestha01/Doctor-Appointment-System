import React, { useState } from "react";
import { createDoctor } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const CreateDoctor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    speciality: "",
    degree: "",
    fees: "",
    experience: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDoctor(form);
      alert("Doctor created successfully");
      navigate(ROUTES.ADMIN_DOCTORS);
    } catch (error) {
      console.log("Create doctor error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

      <h1 className="text-2xl font-bold mb-4">Create Doctor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2" />
        <input name="speciality" placeholder="Speciality" onChange={handleChange} className="w-full border p-2" />
        <input name="degree" placeholder="Degree" onChange={handleChange} className="w-full border p-2" />
        <input name="fees" placeholder="Fees" onChange={handleChange} className="w-full border p-2" />
        <input name="experience" placeholder="Experience" onChange={handleChange} className="w-full border p-2" />
        <input name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Doctor
        </button>

      </form>

    </div>
  );
};

export default CreateDoctor;