<template>
  <div id="app" class="app-container">
    <!-- Menu orizzontale visibile su tutte le pagine -->
    <HorizontalMenu />
    <main class="content">
    <!-- Router view per caricare le viste dinamicamente -->
    <router-view />
    </main>
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
<style>
/* Gli stili sono gestiti in /assets/styles.css */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

}

.content {
  flex: 1;
  width: 100%;
}
</style>
