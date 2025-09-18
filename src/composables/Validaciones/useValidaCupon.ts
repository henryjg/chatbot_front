import { CuponesErrors, initializeCuponesErrors } from '../../interfaces/cupon.interface';
import { useValidator } from './useValidator';

export function useValidaCupon() {
  const reglas = {
    tipoUsuario: (value: any) => !!value || 'El tipo de usuario es requerido',
    idUsuario: (value: any) => !!value || 'La ID del usuario es requerida',
    esfamiliar: (value: any) => value !== null && value !== undefined || 'Este campo es requerido',
    idFamiliar: (value: any) => !!value || 'Este campo es requerido',
    nombreBeneficiario: (value: any) => !!value || 'El nombre del beneficiario es requerido',
    ofertaId: (value: any) => !!value || 'La oferta es requerida',
  };

  return useValidator<CuponesErrors>(
    initializeCuponesErrors,
    reglas
  );
}
