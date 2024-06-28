<template>
  <div>
    <select v-model="selectedCategory">
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedCategory = ref(null);
const categories = [
  { id:1, name: 'Biografia' },
  { id:2, name: 'Diario' },
  { id:3, name: 'Divulgativa' },
  { id:4, name: 'Eloquenza' },
  { id:5, name: 'Epistolare' },
  { id:6, name: 'Erotico' },
  { id:7, name: 'Fantascienza' },
  { id:8, name: 'Fantascienza tecnologica' },
  { id:9, name: 'Fantasy' },
  { id:10, name: 'Fiaba' },
  { id:11, name: 'Giallo' },
  { id:12, name: 'Giallo giudiziario' },
  { id:13, name: 'Giallo medico' },
  { id:14, name: 'Giallo poliziesco' },
  { id:15, name: 'Musica' },
  { id:16, name: 'Narrativa' },
  { id:17, name: 'Noir' },
  { id:18, name: 'Noir metropolitano' },
  { id:19, name: 'Poesia' },
  { id:20, name: 'Prosa' },
  { id:21, name: 'Psicologico' },
  { id:22, name: 'Racconto' },
  { id:23, name: 'Romanzo d\'appendice' },
  { id:24, name: 'Romanzo d\'avventura' },
  { id:25, name: 'Romanzo d\'azione' },
  { id:26, name: 'Romanzo dell/orrore' },
  { id:27, name: 'Romanzo di formazione' },
  { id:28, name: 'Romanzo per ragazzi' },
  { id:29, name: 'Romanzo storico' },
  { id:30, name: 'Rosa' },
  { id:31, name: 'Sociale' },
  { id:32, name: 'Sport' },
  { id:33, name: 'Storiografia' },
  { id:34, name: 'Teatro' },
  { id:35, name: 'Thriller ' },
  { id:36, name: 'Umoristico' }

];
</script>

<style scoped>
/* Stili specifici per il componente */
</style>