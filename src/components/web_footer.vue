<template>
  <footer class="footer bg-blue-800 text-white py-6">
    <div>
      <div class="bg-blue-900 py-2 position-relative">
        <div class="text-center">
          <p class="mb-1 pt-2">
            <RouterLink to="/beneficios/terminosycondiciones" class="hover:underline">Términos y Condiciones</RouterLink> |
            <RouterLink to="/beneficios/politicasyprivacidad" class="hover:underline">Políticas de Privacidad</RouterLink>
             <!-- <RouterLink to="/beneficios/loggin_admin" class="hover:underline">Login Gestión</RouterLink> -->
          </p>

          <p class="text-sm text-info">© Todos los derechos reservados.</p>
        </div>
        <div class="footer-preguntas-link position-absolute end-0 top-50 translate-middle-y pe-4">
        </div>
      </div>
    </div>
    
  </footer>
</template>


<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
setup() {

  


}
};
</script>

<style lang="scss" scoped>
.footer ul li {
  margin-bottom: 8px; /* Ajusta este valor según la separación deseada */
}

.footer h2 {
  color: white; /* Hace que los títulos sean blancos */
  margin-top: 15px; /* Agrega margen superior para separarlos del borde */
}

.fondo_img {
background-image: url("../assets/images/banner/b2.avif");
background-color: rgb(0, 15, 37); /* color de fondo semitransparente */
background-blend-mode: multiply;
}

.footer-link {
  color: #ffffff;
  margin: 0 5px;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
.footer a {
text-decoration: none;
color: white;
}
.footer a:hover {
text-decoration: underline;
}

</style>