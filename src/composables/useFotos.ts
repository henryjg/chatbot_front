import { ref } from 'vue';
import { FotoService } from '../services/_services';
import { Alerta } from '../utils/_utils'; 
import { Foto } from '../interfaces/_interface';
import { useValidaFotos } from './Validaciones/useValidaFotos';
import { useOperacion } from './Tools/useOperacion';
import { number } from 'yup';

export function useFotos() {
  // Estado reactivo
  const fotos = ref<{ id: number, url: string }[]>([]);
  const listaFotos = ref<Foto[]>([]);
  // const fotoActual = ref<Foto>({
  //   id: 0,
  //   url: ''
  // });
  

  // Estados de carga
  const isloading_foto = ref(false);
  
  // Importar validaciones y operaciones
  const { validarEliminacion } = useValidaFotos();
  const { ejecutar } = useOperacion();

  /**
   * Carga las fotos de un negocio específico
   */
  // const cargarFotosNegocio = async (negocioId: number) => {
  //   if (!validarNegocioId(negocioId)) return;

  //   return ejecutar(
  //     () => FotoService.listarPorNegocio(negocioId),
  //     {
  //       indicadorCarga: isloading_foto,
  //       onExito: (response: any) => {
  //         fotos.value = response.success ? response.data : [];
  //       },
  //       onFinalizacion: () => {
  //         if (!fotos.value.length) {
  //           fotos.value = [];
  //         }
  //       }
  //     }
  //   );
  // };
  /**
   * Carga las fotos de un negocio específico
   */
  // const cargarFotosOferta = async (ofertaId: number) => {
  //   if (!validarNegocioId(ofertaId)) return;

  //   return ejecutar(
  //     () => FotoService.listarPorOferta(ofertaId),
  //     {
  //       indicadorCarga: isloading_foto,
  //       onExito: (response: any) => {
  //         fotos.value = response.success ? response.data : [];
  //       },
  //       onFinalizacion: () => {
  //         if (!fotos.value.length) {
  //           fotos.value = [];
  //         }
  //       }
  //     }
  //   );
  // };

  /**
   * Elimina una foto por ID
   */
  // const eliminarFoto = async (id: number) => {
  //   if (!validarEliminacion(id)) return;

  //   // La confirmación se realiza en el componente, aquí solo se ejecuta la eliminación
  //   return ejecutar(
  //     () => FotoService.EliminarFoto(id),
  //     {
  //       indicadorCarga: isloading_foto,
  //       onExito: (response: any) => {
  //         if (response.success) {
  //           listaFotos.value = listaFotos.value.filter((item: Foto) => item.id !== id);
  //         }
  //       },
  //       mensajeExito: 'Foto eliminada con éxito'
  //     }
  //   );
  // };

  /**
   * Registra una nueva foto
   */
  // const registrarFotoNegocio = async (url_subida:string, idnegocio:number) => {
 
  //   const resultado = await ejecutar(
  //     () => FotoService.AgregarFotoNegocio(idnegocio,url_subida),
  //     {
  //       indicadorCarga: isloading_foto,
  //       onExito: async (response: any) => {
  //         if (response.success) {
  //           await cargarFotosNegocio(idnegocio);
  //           // resetFileInput();
  //         } else {
  //           throw new Error(response.message || 'Error al registrar la foto');
  //         }
  //       },
  //       mensajeExito: 'Foto registrada con éxito'
  //     }
  //   );

  //   return !!resultado;
  // };

  // const registrarFotoOferta = async (url_subida:string, idoferta:number) => {
 
  //   const resultado = await ejecutar(
  //     () => FotoService.AgregarFotoOferta(idoferta,url_subida),
  //     {
  //       indicadorCarga: isloading_foto,
  //       onExito: async (response: any) => {
  //         if (response.success) {
  //           await cargarFotosNegocio(idoferta);
  //           // resetFileInput();
  //         } else {
  //           throw new Error(response.message || 'Error al registrar la foto');
  //         }
  //       },
  //       mensajeExito: 'Foto registrada con éxito'
  //     }
  //   );

  //   return !!resultado;
  // };

  // const resetFileInput = () => {
  //   if (fileInput.value) {  
  //     fileInput.value.value = ''; // Resetea el input de archivo
  //   }
  // }

  // // Operaciones agrupadas
  // const operaciones = {
  //   cargar: cargarFotosNegocio,
  //   listar: listarFotos,
  //   eliminar: eliminarFoto,
  //   registrar: registrarFoto
  // };

  // // Utilidades
  // const utilidades = {
  //   resetFileInput
  // };

  return {
    // Estado
    fotos,
    listaFotos,

    isloading_foto,
    
    // Funciones individuales (retrocompatibilidad)
    // cargarFotosNegocio,
    // cargarFotosOferta,
    // eliminarFoto,
    // registrarFotoNegocio,
    // registrarFotoOferta,

  };
}
