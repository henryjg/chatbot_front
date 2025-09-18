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
        onExito: (paginas) => {
          if (paginas.length > 0) {
            EstaEmpresa.value = paginas[0];
          }
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

  // Funciones de actualización de campos específicos
  const actualizarPoliticas = async (id: number, politicas: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarPoliticas(id, politicas),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.politicasprivacidad = politicas;
          Notif.Success('Políticas de privacidad actualizadas con éxito.');
        }
      }
    );
  };

  const actualizarTerminos = async (id: number, terminos: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarTerminos(id, terminos),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.terminosycondiciones = terminos;
          Notif.Success('Términos y condiciones actualizados con éxito.');
        }
      }
    );
  };

  const actualizarFacebook = async (id: number, facebook: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarFacebook(id, facebook),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.linkfacebook = facebook;
          Notif.Success('Facebook actualizado con éxito.');
        }
      }
    );
  };

  const actualizarInstagram = async (id: number, instagram: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarInstagram(id, instagram),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.linkinstagram = instagram;
          Notif.Success('Instagram actualizado con éxito.');
        }
      }
    );
  };

  const actualizarTelefono = async (id: number, telefono: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarTelefono(id, telefono),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.telefonocontacto = telefono;
          Notif.Success('Teléfono actualizado con éxito.');
        }
      }
    );
  };

  const actualizarCelular = async (id: number, celular: string) => {
    return ejecutar(
      () => WebPaginaService.campos.actualizarCelular(id, celular),
      {
        indicadorCarga: isLoading,
        mostrarErrores: true,
        onExito: () => {
          EstaEmpresa.value.celularcontacto = celular;
          Notif.Success('Celular actualizado con éxito.');
        }
      }
    );
  };

  return {
    EstaEmpresa,
    Listar_Pagina,
    Obtener_Pagina,
    Crear_Pagina,
    Actualizar_Pagina,
    Eliminar_Pagina,
    // Funciones de campos
    actualizarPoliticas,
    actualizarTerminos,
    actualizarFacebook,
    actualizarInstagram,
    actualizarTelefono,
    actualizarCelular,
    errors,
    pagina,
    isLoading
  };
}