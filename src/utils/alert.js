import Swal from "sweetalert2";

export const alertSuccess = async (message) => {
  return Swal.fire({
    icon: "success",
    title: "Sukses",
    timer: 2500,
    text: message,
    showConfirmButton: false,
  });
};

export const alertError = async (message) => {
  return Swal.fire({
    icon: "error",
    title: "Ups",
    text: message,
  });
};

export const alertConfirm = async (message) => {
  const result = await Swal.fire({
    icon: "question",
    title: "Anda Yakin?",
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });
  return result.isConfirmed;
};

export const alertConfirmLogin = async (message) => {
  const result = await Swal.fire({
    icon: "question",
    title: "You are not Loged In",
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes",
  });
  return result.isConfirmed;
};