// Interfaz base con campos comunes
export interface NegocioBase {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  dniRepresentante: string;
  celular: string;
  correo: string;
}

// Interfaz para crear un negocio
export interface CrearNegocio extends NegocioBase {
  nombreRep: string;
  categoriaId: number;
}

// Interfaz completa para un negocio
export interface Negocio extends Omit<NegocioBase, 'dniRepresentante'> {
  id: number;
  dniRepresentante: string;
  nombreRep: string;
  descripcion: string;
  logoUrl: string;
  imgPrincipalUrl: string;
  sitioWeb: string;
  facebook: string;
  instagram: string;
  fecharegistro: string;
  categoriaId: number;
  categoriaNombre: string;
  estado: string;
  usuarioId: number;
  lastconexion: string;
  nroingresos: number;
  nrocupones: number;
}

// Interfaz para errores
export type NegocioBaseErrors = Record<keyof NegocioBase, string>;

export interface CrearNegocioErrors extends NegocioBaseErrors {
  nombreRep: string;
  categoriaId: string;
}

export interface NegocioErrors extends Record<keyof Negocio, string> {}

// Inicializadores
export const initializeNegocioBase = (): NegocioBase => ({
  ruc: '',
  razonSocial: '',
  nombreComercial: '',
  dniRepresentante: '',
  celular: '',
  correo: '',
});

export const initializeCrearNegocio = (): CrearNegocio => ({
  ...initializeNegocioBase(),
  nombreRep: '',
  categoriaId: 0,
});

export const initializeNegocio = (): Negocio => ({
  id: 0,
  ruc: '',
  razonSocial: '',
  nombreComercial: '',
  descripcion: '',
  dniRepresentante: '',
  nombreRep: '',
  celular: '',
  correo: '',
  logoUrl: '',
  imgPrincipalUrl: '',
  sitioWeb: '',
  facebook: '',
  instagram: '',
  fecharegistro: '',
  categoriaId: 0,
  categoriaNombre: '',
  estado: '',
  usuarioId: 0,
  lastconexion: '',
  nroingresos: 0,
  nrocupones: 0,
});

export const initializeCrearNegocioErrors = (): CrearNegocioErrors => {
  return {
    ruc: '',
    razonSocial: '',
    nombreComercial: '',
    dniRepresentante: '',
    nombreRep: '',
    celular: '',
    correo: '',
    categoriaId: '',
  };
};

export const initializeNegocioErrors = (): NegocioErrors => {
  return Object.keys(initializeNegocio()).reduce((acc, key) => {
    acc[key as keyof Negocio] = '';
    return acc;
  }, {} as NegocioErrors);
};