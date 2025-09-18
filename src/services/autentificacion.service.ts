import axios from 'axios';
import { API_URL } from '../config';

export const iniciarSesion  = async (usuario: string, pass: string) => {
  const response = await axios.post(API_URL, {
      op: 'loggin', 
      user: usuario,
      pass: pass
  });
  return response.data;
};
export const CargarUsuario = async (idtrabajador: String) => {
  const response = await axios.post(API_URL, {
      op: 'get_trabajador',
      id: idtrabajador
  });
  return response.data;
};

export const cambiarContrasena = async (id: number, nuevaPassword: string) => {
  try {
    const response = await axios.post(API_URL, {
      op: 'upd_password',
      id: id,
      pass: nuevaPassword 
    });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    throw error;
  }
};