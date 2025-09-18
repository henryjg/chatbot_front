import { PublicidadErrors, initializePublicidadErrors } from '../../interfaces/publicidad.interface';
import { useValidator } from './useValidator';

export function useValidaPublicidad() {
  const reglas = {
    urlFoto: (value: any) => !!value || "Debe agregar una imagen",
    nombreProyecto: (value: any) => !!value || "Debe asignar un nombre",
    ubicacionProyecto: (value: any) => !!value || "La ubicación es obligatoria",
    cuotas: (value: any) => !!value || "Las cuotas son obligatorias",
    area: (value: any) => !!value || "El área es obligatoria",
    estado: (value: any) => !!value || "Debe seleccionar un estado",
    link: (value: any) => !!value || "Debe colocar un link"
  };

  return useValidator<PublicidadErrors>(
    initializePublicidadErrors,
    reglas
  );
}
