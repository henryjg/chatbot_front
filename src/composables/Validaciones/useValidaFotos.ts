import { initializeFotoErrors, FotoErrors } from '../../interfaces/foto.interface';
import { useValidator } from './useValidator';
import { Notif } from '../../utils/_utils';

export function useValidaFotos() {
  const reglas = {
    file: (value: File | null) => {
      if (!value) {
        Notif.Error('Debe cargar una fotografía');
        return 'Debe seleccionar una fotografía';
      }

      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(value.type)) {
        Notif.Error('El archivo debe ser una imagen válida');
        return 'El archivo debe ser una imagen válida (JPEG, JPG, PNG, GIF, WEBP)';
      }

      // Validar tamaño (máximo 5MB)
      const tamaximoMB = 5;
      const tamaximoBytes = tamaximoMB * 1024 * 1024;
      if (value.size > tamaximoBytes) {
        Notif.Error(`El archivo no debe superar los ${tamaximoMB}MB`);
        return `El archivo no debe superar los ${tamaximoMB}MB`;
      }

      return true;
    },
    id: (value: number) => {
      if (!value || value <= 0) {
        Notif.Error('ID de foto inválido');
        return 'ID de foto inválido';
      }
      return true;
    },
    negocioId: (value: number) => {
      if (!value || value <= 0) {
        return 'ID de negocio inválido';
      }
      return true;
    },
    url: (value: string) => !!value || 'URL de la foto es requerida'
  };

  const { errors, validarCampo, validarFormulario } = useValidator<FotoErrors>(
    initializeFotoErrors,
    reglas
  );

  /**
   * Valida si un archivo de imagen es válido
   */
  const validarArchivo = (file: File | null): boolean => {
    return validarCampo('file', file);
  };

  /**
   * Valida datos para eliminar una foto
   */
  const validarEliminacion = (id: number): boolean => {
    return validarCampo('id', id);
  };

  /**
   * Valida ID de negocio para cargar fotos
   */
  // const validarNegocioId = (negocioId: number): boolean => {
  //   return validarCampo('negocioId', negocioId);
  // };

  return {
    errors,
    validarFormulario,
    validarCampo,
    validarArchivo,
    validarEliminacion,
    // validarNegocioId
  };
}
