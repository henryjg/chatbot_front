import { ref } from 'vue';
import { NoticiaCategoriaService } from '../services/_services';
import { NoticiaCate, initializeNoticiaCate, initializeNoticiaCateErrors } from '../interfaces/_interface';
import { Alerta } from '../utils/_utils';
import { useValidaCategoria_noticia } from './Validaciones/useValidaCategoria_noticia';
import { useOperacion } from './Tools/useOperacion';

export function useCategoriaNoticia() {
  // Estado reactivo
  const listaCategoriaNoti = ref<NoticiaCate[]>([]);
  const categoriaNoti = ref<NoticiaCate>(initializeNoticiaCate());
  
  // Estados de carga
  const isLoading = ref(false);
  const isSaving = ref(false);

  // Importar validaciones y operaciones
  const { errors, validarFormulario } = useValidaCategoria_noticia();
  const { ejecutar } = useOperacion();

  /**
   * Carga la lista completa de categorías de noticias
   */
  const Listar_CategoriasNoticias = async () => {
    return ejecutar(
      () => NoticiaCategoriaService.listar(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          listaCategoriaNoti.value = response || [];
        }
      }
    );
  };

  /**
   * Carga los datos de una categoría específica
   */
  const Obtener_CategoriasNoticias = async (id: number) => {
    return ejecutar(
      () => NoticiaCategoriaService.obtener(id),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          categoriaNoti.value = response && response.data ? response.data : initializeNoticiaCate();
        }
      }
    );
  };

  /**
   * Guarda una nueva categoría de noticia
   */
  const Crear_CategoriasNoticias = async (): Promise<boolean> => {
    if (!validarFormulario(categoriaNoti.value)) {
      return false;
    }

    const resultado = await ejecutar(
      () => NoticiaCategoriaService.crear(categoriaNoti.value),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          categoriaNoti.value = initializeNoticiaCate();
          await Listar_CategoriasNoticias();
        },
        mensajeExito: 'Categoría registrada satisfactoriamente'
      }
    );

    if (!resultado) {
      // console.log('No se recibió resultado del backend');
    }
    return !!resultado;
  };

  /**
   * Actualiza una categoría existente
   */
const Actualizar_CategoriasNoticias = async () => {
  const resultado = await ejecutar(
    () => NoticiaCategoriaService.actualizar(categoriaNoti.value),
    {
      indicadorCarga: isSaving,
      onExito: async () => {
        await Listar_CategoriasNoticias();
      },
      mensajeExito: 'Categoría actualizada con éxito'
    }
  );

  return !!resultado;
};

  /**
   * Elimina una categoría
   */
  const Eliminar_CategoriasNoticias = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta categoría?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    return ejecutar(
      () => NoticiaCategoriaService.eliminar(id),
      {
        indicadorCarga: isLoading,
        onExito: async () => {
          await Listar_CategoriasNoticias();
        },
        mensajeExito: 'Categoría eliminada con éxito'
      }
    );
  };
  /**
   * Resetea el formulario de categoría
   */
  const resetFormulario = () => {
    categoriaNoti.value = initializeNoticiaCate();
    errors.value = initializeNoticiaCateErrors();
  };

  
  return {
    // Estado
    listaCategoriaNoti,
    categoriaNoti,
    errors,
    isLoading,
    isSaving,
    
    // Funciones individuales (retrocompatibilidad)
    Listar_CategoriasNoticias,
    Obtener_CategoriasNoticias,
    Crear_CategoriasNoticias,
    Actualizar_CategoriasNoticias,
    Eliminar_CategoriasNoticias,
    resetFormulario,
    validarFormulario
  };
}
