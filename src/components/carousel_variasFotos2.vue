<template>
  <div class="slider-container">
    <div ref="slickSlider" class="slider center">
      <!-- <div v-for="(item, index) in listaSliders_categoria" :key="index" class="slider-item p-2">
        <router-link :to="item.linkRouter">
          <img :src="item.urlimagen" :alt="'Image ' + index" />
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css'; // Importar los estilos de Slick
import 'slick-carousel/slick/slick-theme.css'; // Importar los estilos del tema de Slick+
// import { DOC_URL } from '../config';
// import { useCategorias } from '../composables/useCategorias';


export default defineComponent({
  name: 'CarouselCategorias',  setup(_, { emit }) {
    // const { listaSliders_categoria, Listar_Categorias } = useCategorias();
    const slickSlider = ref<HTMLElement | null>(null);
    const carouselId = 'carouselCategorias';
    // const defaultImage = { url: `${DOC_URL}/uploads/img_card_default.avif` };

    

    onMounted(async () => {
      // await Listar_Categorias();
      cargarSlider();
    });



    const cargarSlider = () => {
      if (slickSlider.value) { // Verificar si la referencia existe
        $(slickSlider.value).slick({
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 7,
          autoplay: true,
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '5px',
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1,
              },
            },
          ],
        });
      }
    };


    return {
      // DOC_URL,
      carouselId,
      // defaultImage,
      // listaSliders_categoria
    };
  }
});
</script>


<style scoped>
.slider-container {
  width: 100%;
  margin: 0 auto;
}

.slick-slider {
  width: 100%;
}

.slick-slide img {
  width: 100%;
  height: auto;
}

.slider-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
  border-radius: 20px !important;
}

.slider-item img {
  border-radius: 120px !important;
}
</style>

