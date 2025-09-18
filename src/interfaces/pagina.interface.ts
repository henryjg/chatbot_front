export interface Pagina{
id: number;
NombrePagina: string;
politicasprivacidad: string;
terminosycondiciones: string;
linkfacebook: string;
linkinstagram: string;
telefonocontacto: string;
celularcontacto: string;
}

export const initializePagina = (): Pagina => {
  return {
    id: 0,
    NombrePagina: '',
    politicasprivacidad: '',
    terminosycondiciones: '',
    linkfacebook: '',
    linkinstagram: '',
    telefonocontacto: '',
    celularcontacto: '',
  };
};

export interface PaginaErrors {
    id: string;
    NombrePagina: string;
    politicasprivacidad: string;
    terminosycondiciones: string;
    linkfacebook: string;
    linkinstagram: string;
    telefonocontacto: string;
    celularcontacto: string;
  }
  
  export const initializePaginaErrors = (): PaginaErrors => {
    return {
        id: '',
        NombrePagina: '',
        politicasprivacidad: '',
        terminosycondiciones: '',
        linkfacebook: '',
        linkinstagram: '',
        telefonocontacto: '',
        celularcontacto: '',
    };
  };