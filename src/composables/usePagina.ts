// src/composables/usarAutenticacion.ts
import { ref } from 'vue';
import { WebPaginaService } from '../services/_services';
import { Pagina, initializePagina, PaginaErrors, initializePaginaErrors } from '../interfaces/_interface';
import { Notif, NProgress, Alerta} from '../utils/_utils';
import { useOperacion } from './Tools/useOperacion';

export function usePagina() {
  const pagina = ref<Pagina>(initializePagina());
  const errors = ref<any>(initializePaginaErrors());
  const editorContent = ref('');
  const campoedit = ref('');
  const EstaEmpresa = ref<Pagina>(initializePagina());
  const isLoading = ref(false);
  const { ejecutar } = useOperacion();
  // Cargar lista de paginas
  const Listar_Pagina = async () => {
    return ejecutar(
      () => WebPaginaService.listar(),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: (empresa) => {
          EstaEmpresa.value = empresa;
        }
      }
    );
  };
  // Cargar pagina 
  const Obtener_Pagina = async (id: number) => {
    return ejecutar(
      () => WebPaginaService.obtener(id),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: (data) => {
          EstaEmpresa.value = data;
        }
      }
    );
  };
  // Registrar un nueva pagina
  const Crear_Pagina = async () => {
    if (Object.keys(errors.value).some((key) => errors.value[key as keyof PaginaErrors])) return;
    
    return ejecutar(
      () => WebPaginaService.crear(pagina.value),
      {
        indicadorCarga: isLoading,
        mensajeExito: 'Convenio registrado con éxito.',
        mostrarErrores: true,
        onExito: async () => {
          pagina.value = initializePagina();
          await Listar_Pagina();
        }
      }
    );
  };
  // Actualizar pagina 
  const Actualizar_Pagina = async (id: number) => {
    if (Object.keys(errors.value).some((key) => errors.value[key as keyof PaginaErrors])) return;
    
    return ejecutar(
      () => WebPaginaService.actualizar(pagina.value),
      {
        indicadorCarga: isLoading,
        mensajeExito: 'Oferta actualizada con éxito.',
        mostrarErrores: true,
        onExito: async () => {
          await Listar_Pagina();
        }
      }
    );
  };
  // Eliminar pagina
  const Eliminar_Pagina = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta Pagina?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    return ejecutar(
      () => WebPaginaService.eliminar(id),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: async () => {
          await Listar_Pagina();
        }
      }
    );
  };


  const updateCampo = async (campo: string, valor: string) => {
    try {
      NProgress.start();
      const RespuestaJSON = await WebPaginaService.Upd_Campo(campo, valor);
      if (RespuestaJSON.success) {
        Notif.Success(RespuestaJSON.message);
      } else {
        Notif.Error(RespuestaJSON.message);
      }
    } catch (error) {
      console.error('Error guardando trabajador:', error);
      Notif.Error('Error de Servidor: No se cargaron los datos');
    } finally {
      NProgress.done(); // Detiene la barra de progreso
    }
  };

  return {
    EstaEmpresa,
    Listar_Pagina,
    Obtener_Pagina,
    Crear_Pagina,
    Actualizar_Pagina,
    Eliminar_Pagina,
    updateCampo,
    errors,
    pagina,
    isLoading
  };
}