import { Familiar } from '../../interfaces/familiar.interface';
import { useValidator } from './useValidator';

export function useValidaFamiliar() {
  const reglas = {
    dni: (value: any) => !!value || 'DNI es requerido',
    nombre: (value: any) => !!value || 'Nombre es requerido',
    apePaterno: (value: any) => !!value || 'Apellido paterno es requerido',
    apeMaterno: (value: any) => !!value || 'Apellido materno es requerido',
    telefono: (value: any) => !!value || 'Teléfono es requerido',
    correo: (value: any) => {
      if (!value) return 'Correo es requerido';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || 'Formato de correo inválido';
    },
    genero: (value: any) => !!value || 'Género es requerido',
  };

  return useValidator<Partial<Familiar>>(
    () => ({}),
    reglas
  );
}
