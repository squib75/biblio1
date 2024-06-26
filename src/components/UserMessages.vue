<template>
  <div>
    <MessageList :nickname="nickname" />
    <MessageForm :nickname="nickname" />
  </div>
</template>

<script>
import MessageList from './MessageList.vue';
import MessageForm from './MessageForm.vue';

export default {
  props: ['nickname'],
  components: {
    MessageList,
    MessageForm
  }
};
</script>
