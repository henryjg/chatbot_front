import { ref, computed } from 'vue';
import { PreguntasService } from '../services/_services';
import { Alerta } from '../utils/_utils';
import { Pregunta, initializePregunta, PreguntaErrors, initializePreguntaErrors } from '../interfaces/_interface';
// import { useValidaSlider } from './Validaciones/useValidaSlider';
import { useOperacion } from './Tools/useOperacion';

export function usePreguntas() {
  // Estado reactivo
  const listaPreguntas = ref<Pregunta[]>([]);
  const nuevaPregunta  = ref<Pregunta>(initializePregunta());
  const editandoPregunta = ref<Pregunta>(initializePregunta()); // Separado para edición
  const pregunta       = ref<Pregunta>(initializePregunta());
  const errors = ref<PreguntaErrors>(initializePreguntaErrors());
  
  // Estados de carga separados
  const isLoading_Pregunta = ref(false);
  const isLoadingModal = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingEdit = ref(false);
  const isLoadingReorder = ref(false);

  // Importar validaciones y operaciones
//   const { errors, validarFormulario } = useValidaSlider();
  const { ejecutar } = useOperacion();

  // Carga la lista completa de preguntas
  const Listar_Preguntas = async () => {
    return ejecutar(
      () => PreguntasService.listar(),
      {
        indicadorCarga: isLoading_Pregunta,
        onExito: (response: any) => {
          listaPreguntas.value = response?.data || [];
        }
      }
    );
  };
  
  // Guarda un nueva pregunta
  const Crear_Pregunta = async (): Promise<boolean> => {
    // if (!validarFormulario(nuevaPregunta.value)) return false;

    // Convertir objeto a FormData
    const formData = new FormData();
    formData.append('descripcion', nuevaPregunta.value.descripcion);
    formData.append('respuesta', nuevaPregunta.value.respuesta);
    formData.append('info_adicional', nuevaPregunta.value.info_adicional);

    const resultado = await ejecutar(
      () => PreguntasService.crear(formData),
      {
        indicadorCarga: isLoadingCreate,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioCrear();
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al guardar la pregunta');
          }
        },
        mensajeExito: 'Pregunta registrada satisfactoriamente'
      }
    );

    return !!resultado;
  };
  // Actualiza una pregunta existente
  const Actualizar_Pregunta = async (estadoData?: Pregunta): Promise<boolean> => {
    // if (!validarFormulario(editandoPregunta.value)) return false;

    // Convertir objeto a FormData
    const formData = new FormData();
    formData.append('id', editandoPregunta.value.id.toString());
    formData.append('descripcion', editandoPregunta.value.descripcion);
    formData.append('respuesta', editandoPregunta.value.respuesta);
    formData.append('info_adicional', editandoPregunta.value.info_adicional);

    const resultado = await ejecutar(
      () => PreguntasService.actualizar(formData),
      {
        indicadorCarga: isLoadingEdit,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioEditar();
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al actualizar la pregunta');
          }
        },
        mensajeExito: 'Pregunta actualizada con éxito'
      }
    );

    return !!resultado;
  };
  
  // Reordena los sliders
  // const Reordenar_Sliders = async (sliders: Slider[]): Promise<boolean> => {
  //   // Crear la estructura para el endpoint
  //   const listaOrden: SliderOrdenRequest[] = sliders.map((slider, index) => ({
  //     sliderId: slider.id,
  //     nuevoOrden: index + 1 // El orden comienza en 1
  //   }));

  //   const requestData: ReordenarSlidersRequest = {
  //     listaOrden
  //   };

  //   const resultado = await ejecutar(
  //     () => WebSliderService.reordenarSliders(requestData),
  //     {
  //       indicadorCarga: isLoadingReorder,
  //       onExito: async (response: any) => {
  //         if (response.success) {
  //           await Listar_Slider_Ordenados();
  //         } else {
  //           throw new Error(response.message || 'Error al reordenar los sliders');
  //         }
  //       },
  //       mensajeExito: 'Sliders reordenados con éxito'
  //     }
  //   );

  //   return !!resultado;
  // };
  
  //Elimina una pregunta
  const Eliminar_Pregunta = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta pregunta?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    return ejecutar(
      () => PreguntasService.eliminar(id),
      {
        indicadorCarga: isLoading_Pregunta,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al eliminar el slider');
          }
        },
        mensajeExito: 'Slider eliminado con éxito'
      }
    );
  };
  // Carga una pregunta específica por ID para edición
  const Obtener_Pregunta = async (id: number) => {
    return ejecutar(
      () => PreguntasService.obtener(id),
      {
        indicadorCarga: isLoadingEdit,
        onExito: (response: any) => {
          if (response.success && response.data) {
            editandoPregunta.value = { ...response.data };
          } else {
            throw new Error('No se pudo cargar el slider');
          }
        }
      }
    );
  };
  
 
  // Función de reset del formulario
  const resetFormulario = () => {
    nuevaPregunta.value = initializePregunta();
    errors.value = initializePreguntaErrors();
  };

  // Reset específico para crear
  const resetFormularioCrear = () => {
    nuevaPregunta.value = initializePregunta();
    errors.value = initializePreguntaErrors();
  };

  // Reset específico para editar
  const resetFormularioEditar = () => {
    editandoPregunta.value = initializePregunta();
    errors.value = initializePreguntaErrors();
  };

  // Preparar modal de creación
  const prepararModalCrear = () => {
    resetFormularioCrear();
  };

  // Preparar modal de edición
  const prepararModalEditar = async (id: number) => {
    resetFormularioEditar();
    await Obtener_Pregunta(id);
  };

  // Preguntas ordenadas (computada)
//   const preguntasOrdenadas = computed(() => {
//     return [...listaPreguntas.value].sort((a, b) => {
//       // Si el orden no está definido, usar el ID como fallback
//       const ordenA = a.orden || a.id;
//       const ordenB = b.orden || b.id;
//       return ordenA - ordenB;
//     });
//   });

  // Operaciones principales
  return {
    // Estados reactivos
    listaPreguntas,
    nuevaPregunta,
    editandoPregunta,
    pregunta,
    errors,
    
    // Estados de carga
    isLoading_Pregunta,
    isLoadingModal,
    isLoadingCreate,
    isLoadingEdit,
    isLoadingReorder,
    
    // Operaciones
    Listar_Preguntas,
    // Listar_Slider_Activos,
    // Listar_Slider_Ordenados,
    Crear_Pregunta,
    Actualizar_Pregunta,
    Eliminar_Pregunta,
    Obtener_Pregunta,
    // actualizarEstado,
    // Reordenar_Sliders,
    
    // Utilidades de formulario
    resetFormulario,
    resetFormularioCrear,
    resetFormularioEditar,
    prepararModalCrear,
    prepararModalEditar,
  };
}
