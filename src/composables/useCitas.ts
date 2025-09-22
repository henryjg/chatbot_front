import { ref, computed } from 'vue';
import { CitasService } from '../services/_services';
import { Alerta } from '../utils/_utils';
import { Cita, CitaErrors, initializeCita, initializeCitaErrors } from '../interfaces/_interface';
// import { useValidaSlider } from './Validaciones/useValidaSlider';
import { useOperacion } from './Tools/useOperacion';

export function useCitas() {
  // Estado reactivo
  const listaCitas = ref<Cita[]>([]);
  const nuevaCita  = ref<Cita>(initializeCita());
  const editandoCita = ref<Cita>(initializeCita()); // Separado para edición
  const cita       = ref<Cita>(initializeCita());
  const errors = ref<CitaErrors>(initializeCitaErrors()); // Errores de validación
  
  // Estados de carga separados
  const isLoading_Citas = ref(false);
  const isLoadingModal = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingEdit = ref(false);
  const isLoadingFecha = ref(false);
  const isLoadingAsignar = ref(false);
//   const isLoadingReorder = ref(false);

  // Importar validaciones y operaciones
//   const { errors, validarFormulario } = useValidaSlider();
  const { ejecutar } = useOperacion();

  // Carga la lista completa de citas
  const Listar_Citas = async () => {
    return ejecutar(
      () => CitasService.listar(),
      {
        indicadorCarga: isLoading_Citas,
        onExito: (response: any) => {
          // Extraer solo los datos del array, no todo el objeto de respuesta
          if (response && response.success && response.data) {
            listaCitas.value = response.data;
          } else {
            listaCitas.value = [];
          }
        }
      }
    );
  };
  
  // Guarda un nueva cita
  const Crear_Cita = async (): Promise<boolean> => {
    // if (!validarFormulario(nuevaCita.value)) return false;

    const resultado = await ejecutar(
      () => CitasService.crear(nuevaCita.value),
      {
        indicadorCarga: isLoadingCreate,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioCrear();
            await Listar_Citas();
          } else {
            throw new Error(response.message || 'Error al guardar la cita');
          }
        },
        mensajeExito: 'Cita registrada satisfactoriamente'
      }
    );

    return !!resultado;
  };

  // Actualiza una cita existente
  const Actualizar_Cita = async (estadoData?: Cita): Promise<boolean> => {
    // if (!validarFormulario(editandoCita.value)) return false;

    const resultado = await ejecutar(
      () => CitasService.actualizar(editandoCita.value),
      {
        indicadorCarga: isLoadingEdit,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioEditar();
            await Listar_Citas();
          } else {
            throw new Error(response.message || 'Error al actualizar la cita');
          }
        },
        mensajeExito: 'Cita actualizada con éxito'
      }
    );

    return !!resultado;
  };
  
  //Elimina una cita
  const Eliminar_Cita = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta cita?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    return ejecutar(
      () => CitasService.eliminar(id),
      {
        indicadorCarga: isLoading_Citas,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Citas();
          } else {
            throw new Error(response.message || 'Error al eliminar la cita');
          }
        },
        mensajeExito: 'Cita eliminada con éxito'
      }
    );
  };
  
  // Carga una cita específica por ID para edición
  const Obtener_Cita = async (id: number) => {
    return ejecutar(
      () => CitasService.obtener(id),
      {
        indicadorCarga: isLoadingEdit,
        onExito: (response: any) => {
          if (response.success && response.data) {
            editandoCita.value = { ...response.data };
          } else {
            throw new Error('No se pudo cargar la cita');
          }
        }
      }
    );
  };

  // Obtiene una cita con su horario
  const obtenerCitaConHorario = async (id: number) => {
    return ejecutar(
      () => CitasService.obtenerCitaconHorario(id),
      {
        indicadorCarga: isLoadingEdit,
        onExito: (response: any) => {
          if (response.success && response.data) {
            editandoCita.value = { ...response.data };
          } else {
            throw new Error('No se pudo cargar la cita');
          }
        }
      }
    );
  };

  // Actualiza el estado de una cita usando el servicio actualizarEstado
  const actualizarEstado = async (id: number, nuevoEstado: any) => {
    return ejecutar(
      () => CitasService.actualizarEstado(id, nuevoEstado),
      {
        indicadorCarga: isLoading_Citas,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Citas();
          } else {
            throw new Error(response.message || 'Error al actualizar el estado de la cita');
          }
        },
        mensajeExito: 'Estado de la cita actualizado con éxito'
      }
    );
  };

  // Lista las citas por fecha específica
  const listarPorFecha = async (fecha: string) => {
    return ejecutar(
      () => CitasService.listarPorFecha(fecha),
      {
        indicadorCarga: isLoadingFecha,
        onExito: (response: any) => {
          // Puedes manejar la respuesta aquí si necesitas almacenar los datos
          // Por ejemplo: citasPorFecha.value = response.data || [];
          return response;
        }
      }
    );
  };

  // Asigna un horario a una cita específica
  const asignarHorarioCita = async (citaId: number, horarioId: number): Promise<boolean> => {
    const resultado = await ejecutar(
      () => CitasService.asignarHorarioCita(citaId, horarioId),
      {
        indicadorCarga: isLoadingAsignar,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Citas(); // Actualizar la lista después de asignar
          } else {
            throw new Error(response.message || 'Error al asignar horario a la cita');
          }
        },
        mensajeExito: 'Horario asignado correctamente a la cita'
      }
    );

    return !!resultado;
  };


  // Función de reset del formulario
  const resetFormulario = () => {
    nuevaCita.value = initializeCita();
    errors.value = initializeCitaErrors();
  };

  // Reset específico para crear
  const resetFormularioCrear = () => {
    nuevaCita.value = initializeCita();
    errors.value = initializeCitaErrors();
  };

  // Reset específico para editar
  const resetFormularioEditar = () => {
    editandoCita.value = initializeCita();
    errors.value = initializeCitaErrors();
  };

  // Preparar modal de creación
  const prepararModalCrear = () => {
    resetFormularioCrear();
  };

  // Preparar modal de edición
  const prepararModalEditar = async (id: number) => {
    resetFormularioEditar();
    await Obtener_Cita(id);
  };

  // Sliders ordenados (computada)
//   const slidersOrdenados = computed(() => {
//     return [...listaSliders.value].sort((a, b) => {
//       // Si el orden no está definido, usar el ID como fallback
//       const ordenA = a.orden || a.id;
//       const ordenB = b.orden || b.id;
//       return ordenA - ordenB;
//     });
//   });

  // Operaciones principales
  return {
    // Estados reactivos
    listaCitas,
    nuevaCita,
    editandoCita,
    cita,
    errors,
    // slidersOrdenados,
    
    // Estados de carga
    isLoading_Citas,
    isLoadingModal,
    isLoadingCreate,
    isLoadingEdit,
    isLoadingFecha,
    isLoadingAsignar,
    // isLoadingReorder,
    
    // Operaciones
    Listar_Citas,
    // Listar_Citas_Activas,
    // Listar_Citas_Ordenadas,
    Crear_Cita,
    Actualizar_Cita,
    Eliminar_Cita,
    Obtener_Cita,
    actualizarEstado,
    listarPorFecha,
    asignarHorarioCita,
    obtenerCitaConHorario,
    // Reordenar_Sliders,
    
    // Utilidades de formulario
    resetFormulario,
    resetFormularioCrear,
    resetFormularioEditar,
    prepararModalCrear,
    prepararModalEditar,
  };
}
