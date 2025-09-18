export interface NoticiaCate {
    id:number;
    nombre: string;
}

export const initializeNoticiaCate = (): NoticiaCate =>{
    return{
    id: 0,
    nombre: '',
    };
};

export interface NoticiaCateErrors {
    id: string;
    nombre: string;
}

export const initializeNoticiaCateErrors = (): NoticiaCateErrors => {
    return{
        id: '',
        nombre: '',
    };
};
