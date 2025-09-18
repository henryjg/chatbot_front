export interface ValidarCliente {
  nrodocumento: string;
  tipodocumento: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  estadoOC: string;
  codigo: string;
  genero: string;
}

export const initializeValidarCliente = (): ValidarCliente => {
  return {
    nrodocumento: '',
    tipodocumento: '',
    nombreCompleto: '',
    correo: '',
    telefono: '',
    estadoOC: '',
    codigo: '',
    genero: ''
  };
};


// -------------------------
// -------------------------
export interface ClienteCrear {
  tipoDocumentoTitular: string;
  nroDocumentoTitular: string;
  nombreCompleto: string;
  celular: string;
  correo: string;
  genero: string;
}

export const initializeClienteCrear = (): ClienteCrear => {
  return {
    tipoDocumentoTitular: '',
    nroDocumentoTitular: '',
    nombreCompleto: '',
    celular: '',
    correo: '',
    genero: '',
  };
};

export interface ClienteCrearErrors {
  tipoDocumentoTitular: string;
  nroDocumentoTitular: string;
  nombreCompleto: string;
  celular: string;
  correo: string;
  genero: string;
}

export const initializeClienteCrearErrors = (): ClienteCrearErrors => {
  return {
    tipoDocumentoTitular: '',
    nroDocumentoTitular: '',
    nombreCompleto: '',
    celular: '',
    correo: '',
    genero: ''
  };
};


// -------------------------
// -------------------------
export interface Cliente {
  id: number;
  tipoDocumentoTitular: string;
  nroDocumentoTitular: string;
  nombreCompleto: string;
  celular: string;
  correo: string;
  genero: string;
  lastActualizacionDatos: string;
  ultimaConexion: string;
  nroIngresos: number;
  nroFamiliares: number;
  nroCupones: number;
  fechaRegistro: string;
}

export const initializeCliente = (): Cliente => {
  return {
    id: 0,
    tipoDocumentoTitular: '',
    nroDocumentoTitular: '',
    nombreCompleto: '',
    celular: '',
    correo: '',
    genero: '',
    lastActualizacionDatos: '',
    ultimaConexion: '',
    nroIngresos: 0,
    nroFamiliares: 0,
    nroCupones: 0,
    fechaRegistro: '',
  };
};


// -------------------------
// -------------------------
export interface ClienteErrors {
    id: string;
    nrodocumento: string;
    nombrecompleto: string;
    celular: string;
    correo: string;
    genero: string;
    lastactualizaciondatos: string;
    ultimaconexion: string;
    nroingresos: string;
    nrofamiliares: string;
    nrocupones: string;
    fecharegistro: string;
}

export const initializeClienteErrors = (): ClienteErrors => {
    return {
        id: '',
        nrodocumento: '',
        nombrecompleto: '',
        celular: '',
        correo: '',
        genero: '',
        lastactualizaciondatos: '',
        ultimaconexion: '',
        nroingresos: '',
        nrofamiliares: '',
        nrocupones: '',
        fecharegistro: ''
    };
};
