import { Pregunta } from '../interfaces/preguntas.interface';
import { handleApiError } from '../utils/ApiErrorHandler';
import axios from 'axios';
import { API_URL } from '../config';

const PreguntasService = {
  /**
   * Lista todos las preguntas
   */
  async listar() {
     const response = await axios.post(API_URL, {
         op: 'listar_preguntas', 
     });
     return response.data;
   },

  /**
   * Obtiene pregunta por su ID
   */
  async obtener(id: number) {
    const response = await axios.post(API_URL, {
      op: 'getPregunta', 
      id: id
  });
  return response.data;
},

  /**
   * Crea un nueva pregunta
   */
  async crear(formData: FormData) {
     formData.append("op", "add_pregunta");
    const response = await axios.post(API_URL, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  },

  /**
   * Actualiza una pregunta existente
   */
   async actualizar(formData: FormData) {
    formData.append("op", "updatePregunta");
    const response = await axios.post(API_URL, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  },

  /**
   * Elimina una pregunta por su ID
   */
  async eliminar(id: number) {
    const response = await axios.post(API_URL, {
      op: 'deletePregunta',
      id: id
  });
  return response.data;
},

  /**
   * Actualiza el orden de las preguntas
   */
//   async actualizarOrden(id: number, orden:number) {
//     try {
//       const response = await api.put(`${API_REST}Preguntas/actualizar-orden/${id}`, { orden },  {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error al actualizar el orden de las preguntas:', error);
//       throw handleApiError(error);
//     }
//   },
};

export default PreguntasService;