import { CategoriaErrors, initializeCategoriaErrors } from '../../interfaces/categoria.interface';
import { useValidator } from './useValidator';

export function useValidaCategoria() {
  const reglas = {
    nombre: (value: any) => !!value || 'Nombre es requerido',
    imagenUrl: (value: any) => !!value || 'La Imagen es requerida',
  };

  return useValidator<CategoriaErrors>(
    initializeCategoriaErrors,
    reglas
  );
}