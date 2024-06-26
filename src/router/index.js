import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChiSiamo from '../views/ChiSiamo.vue';
import RegolamentoApp from "@/views/RegolamentoApp.vue";
import PrivacyApp from "@/views/PrivacyApp.vue";
import UserAuth from "@/components/UserAuth.vue";
import MessageForm from "@/components/MessageForm.vue";
import MessageList from "@/components/MessageList.vue";

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/PrivacyApp', name: 'PrivacyApp', component: PrivacyApp },
  { path: '/RegolamentoApp', name: 'RegolamentoApp', component: RegolamentoApp },
  { path: '/UserAuth', name: 'UserAuth', component: UserAuth },
  { path: '/ChiSiamo', name: 'ChiSiamo', component: ChiSiamo },
  { path: '/send-message', name: 'MessageForm', component: MessageForm },
  { path: '/messages', name: 'MessageList', component: MessageList }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
