import { ClienteCrearErrors, initializeClienteCrearErrors } from '../../interfaces/cliente.interface';
import { useValidator } from './useValidator';

export function useValidaCliente() {
  const reglas = {
    tipoDocumentoTitular: (value: any) => !!value || 'Tipo de documento es requerido',
    nroDocumentoTitular: (value: any) => !!value || 'Nro de documento es requerida',
    nombreCompleto: (value: any) => !!value || 'Nombre completo es requerido',
    celular: (value: any) => !!value || 'Celular es requerido',
    correo: (value: any) => !!value || 'Correo es requerido',  
    genero: (value: any) => !!value || 'Género es requerido',
  };

  return useValidator<ClienteCrearErrors>(
    initializeClienteCrearErrors,
    reglas
  );
}