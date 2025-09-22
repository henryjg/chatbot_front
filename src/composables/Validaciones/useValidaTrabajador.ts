import { initializeTrabajadorErrors, TrabajadorErrors } from '../../interfaces/trabajador.interface';
import { useValidator } from './useValidator';

export function useValidaTrabajador() {
  const reglas = {
    dni: (value: any) => !!value || 'DNI es requerido',
    nombre: (value: any) => !!value || 'Nombre es requerido',
    apellidos: (value: any) => !!value || 'Apellidos son requeridos',
    email: (value: any) => !!value || 'Email es requerido',  
    celular: (value: any) => !!value || 'Celular es requerido',
    fechaNacimiento: (value: any) => !!value || 'Fecha de nacimiento es requerida',
    genero: (value: any) => !!value || 'Género es requerido',
    // Campos opcionales o comentados - no requeridos por ahora
    // cargo: (value: any) => !!value || 'Cargo es requerido',
    // fechaIngreso: (value: any) => !!value || 'Fecha de ingreso es requerido',
    // oficinaId: (value: any) => !!value && value !== 0 || 'Oficina es requerido',
  };

  return useValidator<TrabajadorErrors>(
    initializeTrabajadorErrors, 
    reglas
  );
}
