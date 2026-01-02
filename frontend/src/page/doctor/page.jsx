import React from 'react';
import { useDoctorQuery } from '../../services/query/doctor.query';

function Doctor() {
  const { doctors } = useDoctorQuery({ limit: 10 });
  console.log('doctors', doctors);
  return <div>Doctor</div>;
}

export default Doctor;
