import { ref } from 'vue';
import { ServiciosService } from '../services/_services';
import { Alerta } from '../utils/_utils';
import { 
  Servicios, 
  initializeServicios, 
  initializeServiciosErrors 
} from '../interfaces/_interface';
import { useValidaNoticia } from './Validaciones/useValidaNoticia';
import { useOperacion } from './Tools/useOperacion';

export function useNoticias() {
  // Utilidad para convertir objeto a FormData
  function toFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });
    return formData;
  }
  // Estado reactivo
  const listaServicios = ref<Servicios[]>([]);
  const nuevoServicio = ref<Servicios>(initializeServicios());
  const servicio = ref<Servicios>(initializeServicios());

  // Estados de carga
  const isLoading = ref(false);
  const isSaving = ref(false);
  
  // Importar validaciones y operaciones
  const { errors, validarFormulario } = useValidaNoticia();
  const { ejecutar } = useOperacion();

  /**
   * Carga la lista completa de servicios
   */
  const cargarListaServicios = async () => {
    return ejecutar(
      () => ServiciosService.listar(),
      {
        indicadorCarga: isLoading,
       onExito: (response: any) => {
          listaServicios.value = response.data || [];
        }
      }
    );
  };

  /**
   * Carga los datos de una servicio específica
   */
  const cargarDatosServicio = async (id: number) => {
    return ejecutar(
      () => ServiciosService.obtener(id),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          if (response.success) {
            servicio.value = response.data;
            console.log('DEBUG servicio.value:', servicio.value);
          } else {
            throw new Error(response.message || 'Error al cargar el servicio.');
          }
        }
      }
    );
  };

  /**
   * Carga una servicio en el formulario de edición
   */
  const cargarServicio = async (id: number) => {
    return ejecutar(
      () => ServiciosService.obtener(id),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          if (response.success && response.data) {
            nuevoServicio.value = { ...response.data };
          }
        }
      }
    );
  };

  /**
   * Guarda una nueva servicio
   */
  const guardarServicio = async (): Promise<boolean> => {
  // Validación desactivada

    const resultado = await ejecutar(
      () => ServiciosService.crear(toFormData(nuevoServicio.value)),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          console.log('Respuesta de la API (guardarServicio):', response);
          if (response.success) {
            nuevoServicio.value = initializeServicios();
            await cargarListaServicios();
          } else {
            console.error('Error al guardar el servicio:', response.message);
            throw new Error(response.message || 'Error al guardar el servicio');
          }
        },
        mensajeExito: 'Servicio registrado con éxito'
      }
    );

    return !!resultado;
  };

  /**
   * Actualiza una servicio existente
   */
  const actualizarServicio = async (): Promise<boolean> => {
  // Validación desactivada

    const resultado = await ejecutar(
      () => ServiciosService.actualizar(toFormData(nuevoServicio.value)),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          console.log('Respuesta de la API (actualizarServicio):', response);
          if (response.success) {
            await cargarListaServicios();
          } else {
            console.error('Error al actualizar el servicio:', response.message);
            throw new Error(response.message || 'Error al actualizar el servicio');
          }
        },
        mensajeExito: 'Servicio actualizado con éxito'
      }
    );

    return !!resultado;
  };

  /**
   * Elimina una servicio
   */
  const eliminarServicio = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta noticia?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    return ejecutar(
      () => ServiciosService.eliminar_force(id),
      {
        indicadorCarga: isLoading,
        onExito: async () => {
          await cargarListaServicios();
        },
        mensajeExito: 'Servicio eliminado con éxito'
      }
    );
  };

  const eliminarFilaServicio = async (id: number, eliminarDelServidor: boolean = true) => {
    // Si se requiere eliminar del servidor primero
    if (eliminarDelServidor) {
      const resultado = await ServiciosService.eliminar(id);
      if (!resultado.success) return false;
    }

    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar este servicio?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    // Eliminar del DOM si existe
    const fila = document.getElementById(`tr_noticia_${id}`);
    if (fila) {
      fila.remove();
    }

    // Eliminar del array reactivo local (por si acaso)
    const index = listaServicios.value.findIndex(n => n.id === id);
    if (index > -1) {
      listaServicios.value.splice(index, 1);
    }

    return true;
  };

  /**
   * Resetea el formulario de noticia
   */
  const resetFormulario = () => {
    nuevoServicio.value = initializeServicios();
    errors.value = initializeServiciosErrors();
  };

  // Operaciones agrupadas
  const operaciones = {
    cargar: cargarListaServicios,
    cargarDatos: cargarDatosServicio,
    cargarEnFormulario: cargarServicio,
    guardar: guardarServicio,
    actualizar: actualizarServicio,
    eliminar: eliminarServicio
  };

  // Utilidades
  const utilidades = {
    resetFormulario
  };

  return {
    // Estado
    listaServicios,
    nuevoServicio,
    servicio,
    errors,
    isLoading,
    isSaving,
    
    // Operaciones agrupadas
    operaciones,
    utilidades,
    
    // Funciones individuales (retrocompatibilidad)
    cargarListaServicios,
    cargarDatosServicio,
    cargarServicio,
    guardarServicio,
    actualizarServicio,
    eliminarServicio,
    resetFormulario,
    validarFormulario,
    
    // Alias para retrocompatibilidad
    cargar_listaServicios: cargarListaServicios,
    isloading: isLoading,

    eliminarFilaServicio
  };
}