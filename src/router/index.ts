import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import HomeView from '../views/VistaAdministrador.vue'
import { usarAuthStore } from '../stores/autentificacionStore';
import { addStyle, removeStyle } from '../utils/stylesManager';
import { usePaginaStore } from '../stores/paginaStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/office",
    name: "office_admin",
    component: HomeView,
    meta: { requiresAuth: true, style: "" },
    children: [
      // {
      //   path: "home_admin",
      //   name: "Home_Admin",
      //   component: () => import("../views/administrador/home_admin.vue"),
      //   meta: { requiresAuth: true },
      // },
      {
        path: "trabajador",
        name: "ModuloTrabajador",
        component: () => import("../views/administrador/trabajador_lista.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "registrartrabajador",
        name: "registrarTrabajador",
        component: () =>
          import("../views/administrador/trabajador_registrar.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "editartrabajador/:id",
        name: "editarTrabajador",
        component: () => import("../views/administrador/trabajador_editar.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "citas_lista",
        name: "ModuloCitas",
        component: () => import("../views/administrador/citas_lista.vue"),
        meta: { requiresAuth: true },
      },
      // {
      //   path: "clientes_lista",
      //   name: "ClientesLista",
      //   component: () => import("../views/administrador/cliente_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "crearnegocio",
      //   name: "CrearNegocio",
      //   component: () => import("../views/administrador/negocio_crear.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "editarnegocio/:id",
      //   name: "EditarNegocio",
      //   component: () => import("../views/administrador/negocio_detalles.vue"),
      //   // props: true,
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "usuarios_lista",
      //   name: "ListaUsuarios",
      //   component: () => import("../views/administrador/usuarios_lista.vue"),
      //   // props: true,
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "vercuponespendientes",
      //   name: "VerCuponesPendientes",
      //   component: () =>
      //     import("../views/administrador/cupones_pendientes.vue"),
      //   // props: true,
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "vercuponesusados",
      //   name: "VerCuponesUsados",
      //   component: () => import("../views/administrador/cupones_usados.vue"),
      //   // props: true,
      //   meta: { requiresAuth: true },
      // },

      // {
      //   path: "familiar",
      //   name: "Familiar",
      //   component: () => import("../views/administrador/familiar_lista.vue"),
      //   // props: true,
      //   meta: { requiresAuth: true },
      // },
      {
        path: "trabajadordetalle/:id",
        name: "TrabajadorDetalle",
        component: () =>
          import("../views/administrador/trabajador_detalle.vue"),
        props: true,
        meta: { requiresAuth: true },
      },
      //------------------------------------------------------------------------------------
      //MODULO TRABAJADOR ---------------------------------------------------------------------
      //------------------------------------------------------------------------------------

      // {
      //   path: "negocios_lista",
      //   name: "ListarNegocios",
      //   component: () => import("../views/administrador/negocio_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "ofertas_lista",
      //   name: "OfertasListas",
      //   component: () => import("../views/administrador/ofertas_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "convenios_lista",
      //   name: "Convenio_Lista",
      //   component: () => import("../views/administrador/convenio_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "oficina",
      //   component: () => import("../views/administrador/oficina_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "categoria",
      //   component: () => import("../views/administrador/categoria_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
      {
        path: "SliderPrincipal",
        component: () => import("../views/administrador/slider_lista.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "pagina",
        name: "Pagina",
        component: () => import("../views/administrador/pagina_lista.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "pagina_crear",
        name: "Pagina_crear",
        component: () => import("../views/administrador/pagina_front.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/editar/:id",
        name: "Pagina_editar",
        component: () => import("../views/administrador/pagina_front.vue"),
      },
      {
        path: "PubliLink",
        component: () => import("../views/administrador/publiLink_List.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "EditarCampos",
        name: "editarcampos",
        component: () => import("../views/administrador/pagina_campos.vue"),
        meta: { requiresAuth: true },
      },
      // {
      //   path: "Preguntas",
      //   name: "preguntas",
      //   component: () => import("../views/administrador/preguntas_lista.vue"),
      //   meta: { requiresAuth: true },
      // },
    ],
  },
  {
    path: "/beneficios",
    name: "ApBeneficios",
    component: () => import("../views/VistaPrincipal.vue"),
    meta: { style: "/src/assets/css/landing.css" },
    beforeEnter: async (to, from, next) => {
      const paginaStore = usePaginaStore();
      if (!paginaStore.pagina) {
        await paginaStore.almacenaPagina();
      }
      next();
    },
    children: [
      {
        path: "/",
        name: "Inicio",
        component: () => import("../views/beneficios/inicio.vue"),
      },

      {
        path: "/",
        name: "Inicio",
        component: () => import("../views/home/loggin_admin.vue"),
      },
      // {
      //   path: "generarpassword",
      //   name: "GenerarPassword",
      //   component: () => import("../views/beneficios/loggin_generarpass.vue"),
      // },
      {
        path: "recuperarpassword",
        name: "RecuperarPassword",
        component: () => import("../views/home/loggin_recuperar_pass.vue"),
      },

      {
        path: "novedades",
        name: "Novedades",
        component: () => import("../views/beneficios/noticia_list.vue"),
      },
      {
        path: "novedades/:id/:titulo?",
        name: "NovedadesTitulo",
        component: () => import("../views/beneficios/noticia_view.vue"),
      },
      // {
      //   path: "carrito",
      //   name: "Carrito",
      //   component: () => import("../views/beneficios/ListaOfertasCupones.vue"),
      // },
      {
        path: "politicasyprivacidad",
        name: "PoliticasyPrivacidad",
        component: () => import("../views/beneficios/PoliticasyPrivacidad.vue"),
      },
      {
        path: "terminosycondiciones",
        name: "TerminosyCondiciones",
        component: () => import("../views/beneficios/TerminosyCondiciones.vue"),
      },
      {
        path: "registro_citas",
        name: "RegistroCitas",
        component: () => import("../views/beneficios/formulario_cita.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/home/pagina_404.vue"), // Aquí importas tu componente de 404
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const authStore = usarAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.trabajador) {
    if (!authStore.token_id) {
      next({ name: 'Loggin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  const toParent = to.matched[0]?.meta?.style as string | undefined;
  const fromParent = from.matched[0]?.meta?.style as string | undefined;

  if (fromParent && fromParent !== toParent) {
    removeStyle(fromParent);
  }
  if (toParent && toParent !== fromParent) {
    addStyle(toParent);
  }
});

export default router;
