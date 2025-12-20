import './styles/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import i18n from '@/i18n';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// Initialize the app immediately
const app = createApp(App);
app.use(ElementPlus);
app.use(i18n);
app.mount('#app');
