export const isCallAvailable = (appointment) => {
  if (appointment.status !== "confirmed") return false;

  const today = new Date().toDateString();
  const appointmentDate = new Date(appointment.date).toDateString();

  return today === appointmentDate;
};