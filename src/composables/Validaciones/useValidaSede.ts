import { SedeErrors, initializeSedeErrors } from '../../interfaces/sede.interface';
import { useValidator } from './useValidator';

export function useValidaSede() {
  const reglas = {
    nombre: (value: any) => !!value || 'El nombre de la sede es obligatorio',
    ubigeo: (value: any) => !!value || 'El ubigeo es obligatorio',
    direccion: (value: any) => !!value || 'La dirección de la sede es obligatoria',
    latitud: (value: any) => !!value || 'La latitud de la sede es obligatoria',
    longitud: (value: any) => !!value || 'La longitud de la sede es obligatoria',
    negocioId: (value: any) => !!value || 'El ID del negocio es obligatorio',
  };

  return useValidator<SedeErrors>(
    initializeSedeErrors,
    reglas
  );
}
