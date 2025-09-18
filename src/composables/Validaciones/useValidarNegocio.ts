import { CrearNegocioErrors, initializeCrearNegocioErrors } from '../../interfaces/negocio.interface';
import { useValidator } from './useValidator';

export function useValidaNegocio() {
  const reglas = {
    ruc: (value: any) => {
      if (!value) return 'RUC es requerido';
      if (value.length !== 11) return 'RUC debe tener 11 dígitos';
      return true;
    },
    razonSocial: (value: any) => {
      if (!value) return 'Razón social es requerida';
      if (value.length < 3) return 'Razón social debe tener al menos 3 caracteres';
      return true;
    },
    nombreComercial: (value: any) => {
      if (!value) return 'Nombre comercial es requerido';
      if (value.length < 3) return 'Nombre comercial debe tener al menos 3 caracteres';  
      return true;
    },
    dniRepresentante: (value: any) => {
      if (!value) return 'DNI del representante es requerido';
      if (value.length !== 8) return 'DNI debe tener 8 dígitos';
      return true;
    },
    nombreRep: (value: any) => {
      if (!value) return 'Nombre del representante es requerido';
      return true;
    },
    celular: (value: any) => {
      if (!value) return 'Celular es requerido';
      if (!/^\d{9}$/.test(value)) return 'Celular debe tener 9 dígitos';
      return true;
    },
    correo: (value: any) => {
      if (!value) return 'Correo es requerido';
      // Validación simple de correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Formato de correo no válido';
      return true;
    },
    categoriaId: (value: any) => {
      if (!value || value === 0) return 'Categoría es requerida';
      return true;
    }
  };

  return useValidator<CrearNegocioErrors>(
    initializeCrearNegocioErrors,
    reglas
  );
}