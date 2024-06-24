<template>
  <div class="overlay">
    <div class="popup">
      <div class="close-container">
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      <component :is="currentView" @switch-view="switchView" @close="$emit('close')" />
    </div>
  </div>
</template>

<script>
import UserLogin from './UserLogin.vue';
import UserPasswordForgot from './UserPasswordForgot.vue';
import UserRegister from './UserRegister.vue';

export default {
  components: {
    UserLogin,
    UserPasswordForgot,
    UserRegister
  },
  data() {
    return {
      currentView: 'UserLogin'
    };
  },
  methods: {
    switchView(view) {
      this.currentView = view;
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.close {
  cursor: pointer;
  font-size: 20px;
  padding: 3px;
  border: 1px solid #000;
}
</style>
