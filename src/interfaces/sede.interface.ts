export interface Sede {
    id: number;
    nombre:string;
    ubigeo: string;
    direccion: string;
    latitud: number;
    longitud: number;
    negocioId: number;
    local:string;
  }

  export const initializeSede = (): Sede => {
      return {
        id: 0,
        nombre:'',
        ubigeo: '',
        direccion: '',
        latitud: 0,
        longitud: 0,
        negocioId: 0,
        local:'',
      };
  };

  export interface SedeErrors {
    id: string;
    nombre:string;
    ubigeo: string;
    direccion: string;
    latitud: string;
    longitud: string;
    negocioId: string;
    local:string;
}

export const initializeSedeErrors = (): SedeErrors => {
    return {
        id: '',
        nombre:'',
        ubigeo: '',
        direccion: '',
        latitud: '',
        longitud: '',
        negocioId: '',
        local:'',
    };
};