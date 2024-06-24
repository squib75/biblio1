<template>
  <div class="overlay">
    <div class="popup">
      <div class="close-container">
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      <h2>Logout</h2>
      <p>Sei sicuro di voler effettuare il logout?</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default {
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$emit('logout');
      } catch (error) {
        console.error('Errore durante il logout', error);
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 400px;
  max-width: 100%;
}

.close-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.close {
  font-size: 1.5em;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
}
</style>
