export interface Pagina{
  id: number;
  nombreCorto: string;
  politicasPrivacidad: string;
  terminos: string;
  facebook: string;
  instragram: string;
  celular: string;
  celular2: string;
  logo: string;
  portada: string;
}

export const initializePagina = (): Pagina => {
  return {
    id: 0,
    nombreCorto: '',
    politicasPrivacidad: '',
    terminos: '',
    facebook: '',
    instragram: '',
    celular: '',
    celular2: '',
    logo: '',
    portada: '',
  };
};

export interface PaginaErrors {
    id: string;
    nombreCorto: string;
    politicasPrivacidad: string;
    terminos: string;
    facebook: string;
    instragram: string;
    celular: string;
    celular2: string;
    logo: string;
    portada: string;
  }
  
export const initializePaginaErrors = (): PaginaErrors => {
  return {
      id: '',
      nombreCorto: '',
      politicasPrivacidad: '',
      terminos: '',
      facebook: '',
      instragram: '',
      celular: '',
      celular2: '',
      logo: '',
      portada: '',
  };
};