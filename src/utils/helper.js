export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function formatDateISOToIndo(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateISO(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

 export const formatTime = (date) =>
    date.toLocaleTimeString('id-ID')