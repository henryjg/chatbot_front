import { ServiciosErrors, initializeServiciosErrors } from '../../interfaces/servicios.interface';
import { useValidator } from './useValidator';

export function useValidaNoticia() {
  const reglas = {
    titulo: (value: any) => !!value || 'Titulo es requerido',
    url_ImagenDestacada: (value: any) => !!value || 'La Imagen es requerida',
    curpohtml_box1: (value: any) => !!value || 'El cuerpo de la noticia es requerido',
  };

  return useValidator<ServiciosErrors>(
    initializeServiciosErrors,
    reglas
  );
}