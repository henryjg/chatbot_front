// src/services/Foto.service.ts
import { API_URL } from '../config';
import axios from 'axios';
import { handleApiError } from '../utils/ApiErrorHandler';

const FotoService = {

  async listar() {
     const response = await axios.post(API_URL, {
      op: 'get_fotos', 
  });
  return response.data;
},

async crear (formData: FormData) {
  formData.append("op", "add_foto");
  const response = await axios.post(API_URL, formData, {
      headers: {
      'Content-Type': 'multipart/form-data'
      }
  });
  return response.data;
},

async eliminar(idfoto: number) {
    const response = await axios.post(API_URL, {
      op: 'del_foto',
      id: idfoto
  });
  return response.data;
},
  /**
   * Obtiene las fotos de un negocio específico
   */
  // async listarPorNegocio(idnegocio: number) {
  //   try {
  //     const response = await api.get(`${API_REST}Fotos/ListarFotosNegocio/${idnegocio}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     return response.data;
  //   } catch (error: any) {
  //     // retornar array vacío para evitar alerta
  //     if (error.response && error.response.status === 404) {
  //       return [];
  //     }
  //     console.error("Error al obtener las fotos del negocio:", error);
  //     throw handleApiError(error);
  //   }
  // },

  /**
   * Obtiene las fotos de un negocio específico
   */
  // async listarPorOferta(idoferta: number) {
  //   try {
  //     const response = await api.get(`${API_REST}Fotos/ListarFotosOferta/${idoferta}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al obtener las fotos del negocio:", error);
  //     throw handleApiError(error);
  //   }
  // },

  /**
   * Agrega una foto a un negocio
   */
  // async AgregarFotoNegocio(idnegocio: number, urlfoto: string) {
  //   try {
  //     const response = await api.post(`${API_REST}Fotos/AgregarFotoNegocio`, {
  //       url: urlfoto,
  //       negocioId: idnegocio,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al agregar foto al negocio:", error);
  //     throw handleApiError(error);
  //   } 
  // },

  /** 
   * Agrega una foto a un Oferta 
   */
  // async AgregarFotoOferta(idOferta: number, urlfoto: string) {
  //   try {
  //     const response = await api.post(`${API_REST}Fotos/AgregarFotoOferta`, {
  //       url: urlfoto,
  //       ofertaId: idOferta,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al agregar foto al negocio:", error);
  //     throw handleApiError(error);
  //   } 
  // },

  /**
   * Elimina una foto por su ID
   */
  // async EliminarFoto(idfoto: number) {
  //   try {
  //     const response = await api.delete(`${API_REST}Fotos/EliminarFotoNegocio/${idfoto}`);  
  //     return response.data;  
  //   } catch (error) {
  //     console.error("Error al eliminar la foto:", error);
  //     throw handleApiError(error);  
  //   }
  // },
};

export default FotoService;
