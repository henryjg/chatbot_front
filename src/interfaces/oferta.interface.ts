// Interfaz base con campos comunes para ofertas
export interface OfertaBase {
  id: number;
  nombreOferta: string;
  tipoOferta: string;
  descripcion: string;
  terminosCondiciones: string;
  tipoDescuento: string;
  valordscto_cliente: string;
  valordscto_trabajador: string;
  numeroCupos: number;
  fechaInicio: string;
  fechaFin: string;
  imagenUrl: string;
  convenioId: number;
}

// Interfaz para crear una nueva oferta
export interface CrearOferta extends OfertaBase {
  negocioId: number;
}

// Interfaz completa para una oferta
export interface Oferta extends CrearOferta {
  estado: string;
  // Información adicional del negocio asociado
  negocio_nombrecom: string;
  negocio_razonsocial: string;
  negocio_ruc: string;
  negocio_direccion: string;
  // Contadores
  nroCupones: number;
  nroCuponesActivos: number;
  nroCuponesUtilizados: number;
  nroCuponesVencidos: number;
  nrocupones_x_usuario: number;
}

// Interfaz para errores de validación
export interface OfertaErrors {
  nombreOferta: string;
  tipoOferta: string;
  descripcion: string;
  terminosCondiciones: string;
  valordscto_cliente: string;
  valordscto_trabajador: string;
  numeroCupos: string;
  fechaInicio: string;
  fechaFin: string;
}

// Inicializadores
export const initializeOfertaBase = (): OfertaBase => ({
  id: 0,
  nombreOferta: '',
  tipoOferta: '',
  descripcion: '',
  terminosCondiciones: '',
  tipoDescuento: '',
  valordscto_cliente: '',
  valordscto_trabajador: '',
  numeroCupos: 0,
  fechaInicio: '',
  fechaFin: '',
  imagenUrl: '',
  convenioId: 0,
});

export const initializeCrearOferta = (): CrearOferta => ({
  ...initializeOfertaBase(),
  negocioId: 0,
});

export const initializeOferta = (): Oferta => ({
  ...initializeCrearOferta(),
  id: 0,
  estado: 'Activo',
  negocio_nombrecom: '',
  negocio_razonsocial: '',
  negocio_ruc: '',
  negocio_direccion: '',
  nroCupones: 0,
  nroCuponesActivos: 0,
  nroCuponesUtilizados: 0,
  nroCuponesVencidos: 0,
  nrocupones_x_usuario: 0,
});

export const initializeOfertaErrors = (): OfertaErrors => ({
  nombreOferta: '',
  tipoOferta: '',
  descripcion: '',
  terminosCondiciones: '',
  valordscto_cliente: '',
  valordscto_trabajador: '',
  numeroCupos: '',
  fechaInicio: '',
  fechaFin: '',
});