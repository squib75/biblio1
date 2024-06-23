<template>
  <div id="app">
    <!-- Menu orizzontale visibile su tutte le pagine -->
    <HorizontalMenu />
    <!-- Router view per caricare le viste dinamicamente -->
    <router-view />
    <FooterBase />
  </div>
</template>

<script>
import HorizontalMenu from './components/HorizontalMenu.vue';
import FooterBase from "@/components/FooterBase.vue";

export default {
  name: 'App',
  components: {
    FooterBase,
    HorizontalMenu
  }
};
</script>

<!-- Gli stili sono gestiti in /assets/styles.css -->