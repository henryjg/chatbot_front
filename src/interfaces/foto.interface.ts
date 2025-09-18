export interface Foto {
  id: number;
  url: string;
  servicioId: number;
}

export const initializeFoto = (): Foto => ({
    id: 0,
    url: '',
    servicioId: 0
});

export interface FotoErrors {
  id: string;
  url: string;
  file: string;
  servicioId: string;
}

export const initializeFotoErrors = (): FotoErrors => ({
  id: '',
  url: '',
  file: '',
  servicioId: ''
});