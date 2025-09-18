import { ConvenioErrors, initializeConvenioErrors } from '../../interfaces/convenio.interface';
import { useValidator } from './useValidator';

export function useValidaConvenio() {
  const reglas = {
    tipo: (value: any) => !!value || 'Tipo es requerido',
    descripcion: (value: any) => !!value || 'Descripcion es requerida',
    observacion: (value: any) => !!value || 'Observacion es requerida',
    fechaInicio: (value: any) => !!value || 'Fecha de inicio es requerida',
    fechaFin: (value: any) => !!value || 'Fecha de fin es requerida',
  };

  return useValidator<ConvenioErrors>(
    initializeConvenioErrors,
    reglas
  );
}