import { ref } from 'vue';
import { OfertaErrors, initializeOfertaErrors } from '../../interfaces/oferta.interface';
import { useValidator } from './useValidator';

export function useValidaOferta(externalMostrarDsctoCliente?: any, externalMostrarDsctoTrabajador?: any) {
  const mostrarDsctoCliente = externalMostrarDsctoCliente || ref(false);
  const mostrarDsctoTrabajador = externalMostrarDsctoTrabajador || ref(false);

  const reglas = {
    tipoOferta: (value: any) => !!value || 'Tipo de oferta es requerido',
    nombreOferta: (value: any) => !!value || 'Nombre de oferta es requerida',
    descripcion: (value: any) => !!value || 'La descripcion es requerida',
    terminosCondiciones: (value: any) => !!value || 'Los terminos y condiciones son requeridos',
    // valordscto_cliente: (value: any) => {
    //   if (!mostrarDsctoCliente.value && !mostrarDsctoTrabajador.value) {
    //     return 'Debe seleccionar al menos un descuento';
    //   }
    //   return mostrarDsctoCliente.value
    //     ? (Number(value) >= 0 && Number(value) <= 100) || 'El descuento debe estar entre 0 y 100'
    //     : true;
    // },
    // valordscto_trabajador: (value: any) => {
    //   if (!mostrarDsctoCliente.value && !mostrarDsctoTrabajador.value) {
    //     return 'Debe seleccionar al menos un descuento';
    //   }
    //   return mostrarDsctoTrabajador.value
    //     ? (Number(value) >= 0 && Number(value) <= 100) || 'El descuento debe estar entre 0 y 100'
    //     : true;
    // },
    numeroCupos: (value: any) => (Number(value) > 0) || 'N° de cupos debe ser mayor a 0',
    fechaInicio: (value: any) => !!value || 'La fecha de inicio es requerida',
    fechaFin: (value: any) => !!value || 'La fecha de fin es requerida',
  };

  const validator = useValidator<OfertaErrors>(
    initializeOfertaErrors,
    reglas
  );

  return {
    ...validator,
    mostrarDsctoCliente,
    mostrarDsctoTrabajador,
  };
}