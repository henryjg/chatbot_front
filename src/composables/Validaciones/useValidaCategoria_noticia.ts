import { NoticiaCateErrors, initializeNoticiaCateErrors } from '../../interfaces/noticiasCategoria.interface';
import { useValidator } from './useValidator';

export function useValidaCategoria_noticia() {
  const reglas = {
    nombre: (value: any) => {
      if (!value) return 'El nombre es requerido';
      if (value.trim() === '') return 'El nombre no puede estar vacío';
      if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
      if (value.length > 100) return 'El nombre no puede exceder los 100 caracteres';
      return true;
    }
  };

  return useValidator<NoticiaCateErrors>(
    initializeNoticiaCateErrors,
    reglas
  );
}