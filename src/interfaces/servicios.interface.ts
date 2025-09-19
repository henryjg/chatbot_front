export interface Servicios {
    id:number;
    categoria_id: number;
    categoria_nombre: string;
    nombre: string;
    descripcion: string;
    beneficios: string;
    precio: string;
    facilidades: string;
    video1: string;
    video2: string;
    info_adicional: string;
    [key: string]: any; 
}


export const initializeServicios = (): Servicios =>{
    return{
        id: 0,
        categoria_id: 0,
        categoria_nombre: '',
        nombre: '',
        descripcion: '',
        beneficios: '',
        precio: '',
        facilidades: '',
        video1: '',
        video2: '',
        info_adicional: '',
    };
};

export interface ServiciosErrors {
    id: string;
    categoria_id: string;
    nombre: string;
    descripcion: string;
    beneficios: string;
    precio: string;
    facilidades: string;
    video1: string;
    video2: string;
    info_adicional: string;
    [key: string]: any; 
}

export const initializeServiciosErrors = (): ServiciosErrors => {
    return{
        id: '',
        categoria_id: '',
        nombre: '',
        descripcion: '',
        beneficios: '',
        precio: '',
        facilidades: '',
        video1: '',
        video2: '',
        info_adicional: '',
    };
};