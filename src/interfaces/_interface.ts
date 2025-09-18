// Interfaces de negocio
export * from './negocio.interface';
export * from './oferta.interface';
export * from './categoria.interface';
export * from './convenio.interface';
export * from './cupon.interface';
export * from './sede.interface';
export * from './cliente.interface';
export * from './familiar.interface';
export * from './trabajador.interface';
export * from './oficina.interface';
export * from './usuario.interface';
export * from './usuarios.interface';
export * from './publicidad.interface';
export * from './servicios.interface';
export * from './slider.interface';
export * from './slider.interface';
export * from './sunat.interface';
export * from './cupon.interface';
export * from './ubigeo.interface';
export * from './api.response.interface';
export * from './archivo.interface';
export * from './foto.interface';
export * from './pagina.interface';
export * from './noticiasCategoria.interface';
export * from './preguntas.interface';
export * from './EvoltaInterfaces';
// Interfaces de estadísticas
export * from './estadisticas.interface';

// Tipos y utilidades comunes
export * from '../types/objetosweb';
export * from '../types/paginacion-info';

// Tipos de error
export { ApiError, ErrorType } from '../utils/ApiErrorHandler';

// Interfaz para enlaces de breadcrumb (usado en varios componentes)
export interface Link {
  path: string;
  name: string;
}