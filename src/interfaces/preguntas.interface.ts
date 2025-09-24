export interface Pregunta {
  id: number;
  descripcion: string;
  respuesta:string;
  info_adicional: string;
}

export const initializePregunta = (): Pregunta => {
  return {
    id: 0,
    descripcion: '',
    respuesta: '',
    info_adicional: '',
  };
};

export interface PreguntaErrors {
    id: string;
    descripcion: string;
    respuesta: string;
    info_adicional: string;
    }

export const initializePreguntaErrors = (): PreguntaErrors => {
    return {
        id: '',
        descripcion: '',
        respuesta: '',
        info_adicional: '',
    };
    }