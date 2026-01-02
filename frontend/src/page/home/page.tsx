import React from 'react';
import Banner from './component/banner';
import Speciality from './component/speciality';
import Experience from './component/experience';
import { useDoctorQuery } from '../../services/query/doctor.query';
import DoctorGrid from './component/feature-doctor';

function Home() {
  const { doctors, loading, error } = useDoctorQuery({ limit: 10 });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const specialties = doctors.map((doctor) => doctor?.speciality);

  // Optional: get unique specialties
  const uniqueSpecialties = [...new Set(specialties)];
  console.log('uniqueSpecialties', uniqueSpecialties);
  return (
    <div>
      <Banner />
      <Speciality specialties={uniqueSpecialties} />
      <DoctorGrid />

      <Experience />
    </div>
  );
}

export default Home;
