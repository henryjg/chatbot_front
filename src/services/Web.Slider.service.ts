import { API_URL } from '../config';
import axios from 'axios';
import { Slider, ReordenarSlidersRequest } from '../interfaces/slider.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const SliderService = {
  /**
   * Lista todos los sliders
   */
  async listar() {
     const response = await axios.post(API_URL, {
      op: 'listar_slider', 
  });
  return response.data;
},

  /**
   * Lista solamente los sliders activos
   */
  // async listarActivos() {
  //   try {
  //     const response = await api.get(`${API_REST}WebSliders/ListarWebSliders_activos`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     if (response.data.success) {
  //       return response.data.data;
  //     } else {
  //       throw new Error(response.data.message || 'Error desconocido al obtener los sliders.');
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener la lista de sliders activos:', error);
  //     throw handleApiError(error);
  //   }
  // },

  /**
   * Lista los sliders ordenados
   */
  // async listarOrdenados() {
  //   try {
  //     const response = await api.get(`${API_REST}WebSliders/ListarOrdenados`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     if (response.data.success) {
  //       return response.data.data;
  //     } else {
  //       throw new Error(response.data.message || 'Error desconocido al obtener los sliders ordenados.');
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener la lista de sliders ordenados:', error);
  //     throw handleApiError(error);
  //   }
  // },

  /**
   * Reordena los sliders
   */
  // async reordenarSliders(data: ReordenarSlidersRequest) {
  //   try {
  //     const response = await api.put(`${API_REST}WebSliders/ReordenarSliders`, data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al reordenar los sliders:', error);
  //     throw handleApiError(error);
  //   }
  // },

  /**
   * Obtiene un slider por su ID
   */
  async obtener(id: number) {
   const response = await axios.post(API_URL, {
      op: 'get_slider',
      id: id
  });
  return response.data;
},

  /**
   * Crea un nuevo slider
   */
  async crear(sliderData: Slider) {
    const response = await axios.post(API_URL, {
    op: 'add_slider', 
    ...sliderData
  });
  return response.data;
},

  /**
   * Actualiza un slider existente
   */
  async actualizar(sliderData: Slider) {
    const response = await axios.post(API_URL, {
    op: 'upd_slider', 
    ...sliderData
  });
  return response.data;
},

  /**
   * Actualiza el estado de un slider (activo/inactivo)
   */
  async actualizarEstado(id: number, estado: string) {
    const response = await axios.post(API_URL, {
        op: 'upd_Estado',
        id: id,
        estado: estado
    });
    return response.data;
  },

  /**
   * Elimina un slider por su ID
   */
  async eliminar(id: number) {
   const response = await axios.post(API_URL, {
        op: 'del_slider',
        id: id
    });
    return response.data;
  },
};

export default SliderService;