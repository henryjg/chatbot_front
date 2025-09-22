import { API_URL } from '../config';
import axios from 'axios';
import { Cita } from '../interfaces/_interface';
import SliderService from './Web.Slider.service';

const CitasService = {
  /**
   * Lista todas las citas
   */
  async listar() {
     const response = await axios.post(API_URL, {
      op: 'listar_citas', 
  });
  return response.data;
},

  /**
   * Obtiene una cita con su horario
   */
  async obtenerCitaconHorario(id: number) {
    const response = await axios.post(API_URL, {
      op: 'getCita_Con_Horario',
      id: id
    });
    return response.data;
  },

  /**
   * Obtiene una cita por su ID
   */
  async obtener(id: number) {
   const response = await axios.post(API_URL, {
      op: 'getCita',
      id: id
  });
  return response.data;
},

  /**
   * Crea un nuevo cita
   */
  async crear(citaData: Cita) {
    const response = await axios.post(API_URL, {
      op: 'add_cita',
      ...citaData
  });
  return response.data;
},

  /**
   * Actualiza una cita existente
   */
  async actualizar(citaData: Cita) {
    const response = await axios.post(API_URL, {
      op: 'updateCita',
      ...citaData
  });
  return response.data;
},

  /**
   * Actualiza el estado de una cita (activo/inactivo)
   */
  async actualizarEstado(id: number, estado: string) {
    const response = await axios.post(API_URL, {
        op: 'updateEstadoCita',
        id: id,
        estado: estado
    });
    return response.data;
  },

  /**
   * Elimina una cita por su ID
   */
  async eliminar(id: number) {
   const response = await axios.post(API_URL, {
        op: 'deleteCita',
        id: id
    });
    return response.data;
  },

//   -------------------------------------------------------------------------------
//   Funciones adicionales específicas para citas
//   --------------------------------------------------------------------------
  /**
   * Lista las citas por fecha
   */
  async listarPorFecha(fecha: string) {
    const response = await axios.post(API_URL, {
      op: 'getHorariosDisponibles',
      fecha: fecha
    });
    return response.data;
  },

    /**
     * Servicio para la asignar horario de cita
     */
    async asignarHorarioCita(citaId: number, horarioId: number) {
    const response = await axios.post(API_URL, {
      op: 'asignarHorarioCita',
      cita_id: citaId,
      horario_id: horarioId
    });
    return response.data;
  }

};

export default CitasService;