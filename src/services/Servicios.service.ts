import axios from 'axios';
import { API_URL } from '../config';
import { Servicios } from '../interfaces/servicios.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const ServiciosService = {
  /**
   * Lista todas las noticias disponibles
   */
  async listar() {
     const response = await axios.post(API_URL, {
         op: 'getServicios', 
     });
     return response.data;
   },
  
  /**
   * Obtiene una noticia por su ID
   */
  async obtener(id: number) {
      const response = await axios.post(API_URL, {
      op: 'getServicio', 
      id: id
  });
  return response.data;
},
  
  /**
   * Crea una nueva noticia
   */
  async crear(formData: FormData) {
     formData.append("op", "addServicio");
    const response = await axios.post(API_URL, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  },
  
  /**
   * Actualiza una noticia existente
   */
  async actualizar(formData: FormData) {
    formData.append("op", "updServicio");
    const response = await axios.post(API_URL, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  },
  
  /**
   * Elimina una noticia por su ID
   */
  async eliminar(id: number) {
    const response = await axios.post(API_URL, {
      op: 'deleteServicio',
      id: id
  });
  return response.data;
},

async eliminar_force(id: number) {
  const response = await axios.post(API_URL, {
    op: 'deleteServicioConFotos',
    id: id
});
return response.data;
},
// --------------fotos-----------------
 async obtener_foto(id: number) {
      const response = await axios.post(API_URL, {
      op: 'get_fotos_Servicio', 
      id: id
  });
  return response.data;
},

  async eliminar_foto(id: number) {
    const response = await axios.post(API_URL, {
      op: 'del_foto_Servicio',
      id: id
  });
  return response.data;
},

  async crear_foto(formData: FormData) {
     formData.append("op", "add_fotoServicio");
    const response = await axios.post(API_URL, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  }
};

export default ServiciosService;