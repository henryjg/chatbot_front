export interface Categoria {
  id: number;
  nombre: string;
  // imagenUrl: string;
}

export const initializeCategoria = (): Categoria => {
  return {
    id: 0,
    nombre: '',
    // imagenUrl: '',
  };
};

export interface CategoriaErrors {
  id: string;
  nombre: string;
  // imagenUrl: string;
}

export const initializeCategoriaErrors = (): CategoriaErrors => {
  return {
    id: '',
    nombre: '',
    // imagenUrl: '',
  };
};
