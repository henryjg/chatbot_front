export interface Cupon_create {
  tipoUsuario: string;
  idUsuario: string;
  esfamiliar: string;
  idFamiliar: string;
  nombreBeneficiario: string;
  ofertaId: number;
}

export const initializeCupon_create = (): Cupon_create => {
  return {
    tipoUsuario: '',
    idUsuario: '',
    esfamiliar: '',
    idFamiliar: '',
    nombreBeneficiario: '',
    ofertaId: 0,
  };
};

export interface Cupones {
  id: number;
  tipoUsuario: string;
  nombreUsuario:string;
  idUsuario: string;
  esfamiliar: string;
  idFamiliar: number;
  nombreBeneficiario: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  fecha_uso: string;
  observacionCliente: string;
  observacionNegocio: string;
  qrCode: string;
  qrImgUrl: string;
  ranking1a5: number;
  ofertaId: number;
  ofertaNombre: string;
  tipoOferta: string;
  valordsctoCliente: number;
  valordsctoTrabajador: number;
  imagenUrl: string;
  negocioRuc: string;
  negocioRazonSocial: string;
  negocioNombreComercial: string;
  negocioNombreRep: string;
  negocioLogoUrl: string;
  negocioNombre: string;
  fechaInicio: string;
  fechaFin: string; 
  fechaUso: string;
  tipoDescuento: string;
  ofertaTipoDescuento: string;
  ofertaValorDescuentoCliente: string;
  ofertaValorDescuentoTrabajador: string;
  evaluacionCupon_1_5: number;
}

export const initializeCupones = (): Cupones => {
  return {
    id: 0,
    tipoUsuario: '',
    nombreUsuario:'',
    idUsuario: '',
    esfamiliar: '',
    idFamiliar: 0,
    nombreBeneficiario: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
    fecha_uso: '',
    observacionCliente: '',
    observacionNegocio: '',
    qrCode: '',
    qrImgUrl: '',
    ranking1a5: 0,
    ofertaId: 0,
    ofertaNombre: '',
    tipoOferta: '',
    valordsctoCliente: 0,
    valordsctoTrabajador: 0,
    imagenUrl: '',
    negocioRuc: '',
    negocioRazonSocial: '',
    negocioNombreComercial: '',
    negocioNombreRep: '',
    negocioLogoUrl: '',
    negocioNombre: '',
    fechaInicio: '',
    fechaFin: '',
    fechaUso: '',
    tipoDescuento: '',
    ofertaTipoDescuento: '',
    ofertaValorDescuentoCliente: '',
    ofertaValorDescuentoTrabajador: '',
    evaluacionCupon_1_5: 0,
  };
};

export interface CuponesErrors {
  id: string;
  tipoUsuario: string;
  idUsuario: string;
  esfamiliar: string;
  idFamiliar: string;
  nombreBeneficiario: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  fecha_uso: string;
  observacion_Cliente: string;
  observacion_Negocio: string;
  qrCode: string;
  qrImgUrl: string;
  ofertaId: string;
}

export const initializeCuponesErrors = (): CuponesErrors => {
  return {
    id: '',
    tipoUsuario: '',
    idUsuario: '',
    esfamiliar: '',
    idFamiliar: '',
    nombreBeneficiario: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
    fecha_uso: '',
    observacion_Cliente: '',
    observacion_Negocio: '',
    qrCode: '',
    qrImgUrl: '',
    ofertaId: '',
  };
};
