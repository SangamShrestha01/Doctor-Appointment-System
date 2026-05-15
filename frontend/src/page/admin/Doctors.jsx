import React, { useEffect, useState } from "react";
import { getAllDoctors, deleteDoctor } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctors();
      setDoctors(res.data.data || []);
    } catch (error) {
      console.log("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctors</h1>

        <button
          onClick={() => navigate(ROUTES.ADMIN_CREATE_DOCTOR)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Doctor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Speciality</th>
              <th className="p-3">Fees</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={doc.image}
                    alt="doctor"
                    className="w-10 h-10 rounded-full"
                  />
                  {doc.name}
                </td>

                <td className="p-3">{doc.speciality}</td>
                <td className="p-3">Rs. {doc.fees}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/doctors/edit/${doc.id}`)
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Doctors;