import { API_URL } from '../config';
import axios from 'axios';
import { NoticiaCate } from '../interfaces/noticiasCategoria.interface';
import { handleApiError } from '../utils/ApiErrorHandler';
import { Categoria } from '../interfaces/_interface';

const NoticiaCategoriaService = {
  /**
   * Lista todas las categorías de noticias
   */
  // async listar() {
  //   try {
  //     const response = await api.get(`${API_REST}NoticiaCategorias`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     if (response.data.success) {
  //       return response.data.data; 
  //     } else {
  //       throw new Error(response.data.message || "Error desconocido al obtener las categorias.");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener la lista de categorias:", error);
  //     throw handleApiError(error);
  //   }
  // },

    async listar() {
      try {
        const response = await axios.post(API_URL, { op: 'getCategorias' }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data.data;
      } catch (error) {
        console.error("Error al obtener la lista de categorías:", error);
        throw handleApiError(error);
      }
    },

  /**
   * Obtiene una categoría de noticia por su ID
   */
  // async obtener(id: number) {
  //   try {
  //     const response = await api.get(`${API_REST}NoticiaCategorias/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error al obtener la categoria ${id}:`, error);
  //     throw handleApiError(error);
  //   }
  // },

    async obtener(id: number) {
    try {
      const response = await axios.post(API_URL, { op: 'getCategoria', id }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la categoría ID ${id}:`, error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Crea una nueva categoría de noticia
   */
  // async crear(noticiaCateData: NoticiaCate) {
  //   try {
  //     const response = await api.post(`${API_REST}NoticiaCategorias`, noticiaCateData, {
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error al agregar la categoria:", error);
  //     throw handleApiError(error);
  //   }
  // },

    async crear(categoria: Categoria) {
      try {
        const response = await axios.post(API_URL, { op: 'addCategoria', ...categoria }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error al agregar categoria:', error);
        throw handleApiError(error);
      }
    },
  
  /**
   * Actualiza una categoría de noticia existente
   */
  // async actualizar(id: number, categoria: Partial<NoticiaCate>) {
  //   try {
  //     const response = await api.put(`${API_REST}NoticiaCategorias/${id}`, categoria, {
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error al actualizar la categoria ${id}:`, error);
  //     throw handleApiError(error);
  //   }
  // },

    async actualizar(categoria: Categoria) {
      try {
        const response = await axios.post(API_URL, { op: 'updCategoria', ...categoria }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar la categoría ID ${categoria.id}:`, error);
        throw handleApiError(error);
      }
    },
  
  /**
   * Elimina una categoría de noticia por su ID
   */
  // async eliminar(id: number) {
  //   try {
  //     const response = await api.delete(`${API_REST}NoticiaCategorias/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error al eliminar la categoria ${id}:`, error);
  //     throw handleApiError(error);
  //   }
  // }
    async eliminar(id: number) {
    try {
      const response = await axios.post(API_URL, { op: 'deleteCategoria', id });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      throw handleApiError(error);
    }
  }
};

export default NoticiaCategoriaService;
