import { OficinaErrors, initializeOficinaErrors } from '../../interfaces/oficina.interface';
import { useValidator } from './useValidator';

export function useValidaOficina() {
  const reglas = {
    nombre: (value: any) => !!value || 'El nombre de la oficina es requerido',
  };

  return useValidator<OficinaErrors>(
    initializeOficinaErrors,
    reglas
  );
}
