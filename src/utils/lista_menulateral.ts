// utils/listas.ts

export interface MenuItem {
  tipe: string;
  text: string;
  icon: string;
  route: string;
  role_ids?: string[];  
}



export const menuItems: MenuItem[] = [

  // {
  //   tipe: 'titulo',
  //   text: 'Operaciones',
  //   icon: '',
  //   route: '', 
  //   // role_ids: [1,3]
  // },



  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  // PERFIL TRABAJADORES ADMINISTRADOR  ----------------------------------

  // {
  //   tipe: 'link',
  //   text: 'Negocios',
  //   icon: ' fas fa-shopping-basket',
  //   route: '/office/negocios_lista',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },

  // {
  //   tipe: 'link',
  //   text: 'Ofertas',
  //   icon: 'fas fa-solid fa-percent',
  //   route: '/office/ofertas_lista',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },
  // {
  //   tipe: 'link',
  //   text: 'Convenios',
  //   icon: 'fas fa-solid fa-handshake',
  //   route: '/office/convenios_lista',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },
  // {
  //   tipe: 'link',
  //   text: 'Clientes',
  //   icon: 'fas fa-person-booth',
  //   route: '/office/clientes_lista',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },
  // {
  //   tipe: 'link',
  //   text: 'Trabajadores',
  //   icon: 'fas fa-users-cog',
  //   route: '/office/trabajador',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },

  // {
  //   tipe: 'link',
  //   text: 'Familiares',
  //   icon: 'fas fa-users',
  //   route: '/office/familiar',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },

  //---------------------------------------------------
  //---------------------------------------------------

  // {
  //   tipe: 'titulo',
  //   text: 'Cupones',
  //   icon: '',
  //   route: '',  
  //   role_ids: [4]
  // },
  // {
  //   tipe: 'link',
  //   text: 'Pedientes',
  //   icon: 'fas fa-solid fa-hourglass-half',
  //   route: '/office/vercuponespendientes',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },
  // {
  //   tipe: 'link',
  //   text: 'Utilizados',
  //   icon: 'fas fa-solid fa-check',
  //   route: '/office/vercuponesusados',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },
  //---------------------------------------------------
  //---------------------------------------------------
  {
    tipe: 'titulo',
    text: 'Configuracion',
    icon: '',
    route: '',  
    role_ids: ['Administrador']
  },
  
 
  // {
  //   tipe: 'link',
  //   text: 'Oficina',
  //   icon: 'fas fa-box',
  //   route: '/office/oficina',
  //   role_ids: [1, 4]  // Solo visible para Administrador
  // },
  // {
  //   tipe: 'link',
  //   text: 'Sliders',
  //   icon: 'fas fa-image',
  //   route: '/office/SliderPrincipal',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },
  
  // {
  //   tipe: 'link',
  //   text: 'Categorias',
  //   icon: 'fas fa-list',
  //   route: '/office/categoria',
  //   role_ids: [1, 4]  // Solo visible para Administrador
  // },
  //   {
  //   tipe: 'link',
  //   text: 'Paginas',
  //   icon: 'fas fa-solid fa-window-maximize',
  //   route: '/office/editarcampos',
  //   role_ids: ['Administrador'] // Visible para Administrador y Licencias
  // },
  {
    tipe: 'link',
    text: 'Entradas',
    icon: 'fas fa-file',
    route: '/office/pagina',
    role_ids: ['Administrador']  // Solo visible para Administrador
  },
   {
    tipe: 'link',
    text: 'Trabajador',
    icon: 'fas fa-file',
    route: '/office/trabajador',
    role_ids: ['Administrador']  // Solo visible para Administrador
  },
   {
    tipe: 'link',
    text: 'Citas Médicas',
    icon: 'fas fa-file',
    route: '/office/citas_lista',
    role_ids: ['Administrador']  // Solo visible para Administrador
  },
  {
    tipe: 'link',
    text: 'Preguntas Frecuentes',
    icon: 'fas fa-file',
    route: '/office/preguntasfrecuentes',
    role_ids: ['Administrador']  // Solo visible para Administrador
  },
  // {
  //   tipe: 'link',
  //   text: 'Proyectos IMP',
  //   icon: 'fas fa-home',
  //   route: '/office/PubliLink',
  //   role_ids: [1, 4]  // Solo visible para Administrador
  // },

  // {
  //   tipe: 'link',
  //   text: 'Preguntas Frecuentes',
  //   icon: '',
  //   route: '/office/preguntas',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },
  //  {
  //   tipe: 'link',
  //   text: 'Usuarios',
  //   icon: 'fas fa-solid fa-user',
  //   route: '/office/usuarios_lista',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },
];
