export interface Oficina{
    id: string;
    nombre: string;
    padre_id: string;
  }

export const initializeOficina = (): Oficina => {
    return {
        id: '',
        nombre: '',
        padre_id: ''
    };
};

export interface OficinaErrors {
    nombre: string;
} 

export const initializeOficinaErrors = (): OficinaErrors => {
    return {
        nombre: ''
    };
};

export interface OfficeNode {
  id: number;
  nombre: string;
  padre_id: number | null;
  subOficinas: OfficeNode[];
}
  