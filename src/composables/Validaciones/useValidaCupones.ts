import { initializeCuponesErrors, CuponesErrors } from '../../interfaces/cupon.interface';
import { useValidator } from './useValidator';

export function useValidaCupones() {
  const reglas = {
    tipoUsuario: (value: any) => !!value || 'El tipo de usuario es requerido.',
    idUsuario: (value: any) => !!value || 'La ID del usuario es requerida.',
    ofertaId: (value: any) => (Number(value) > 0) || 'Debe seleccionar una oferta válida.',
    nombreBeneficiario: (value: any) => !!value || 'El nombre del beneficiario es requerido.'
  };

  return useValidator<CuponesErrors>(
    initializeCuponesErrors, 
    reglas
  );
}
