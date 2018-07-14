import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import util from './libs/util';
import axios from './libs/axios';
import API from './api/api';

Vue.use(iView);
Vue.prototype.$http = axios.Axios;
Vue.prototype.API = API;

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
	data: {
		currentPageName: '',
	},
	mounted() {
		this.currentPageName = this.$route.name;
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
		this.$store.commit('initCachepage');
		// 权限菜单过滤相关
		this.$store.commit('updateMenulist');
		// iview-admin检查更新
		util.checkUpdate(this);
	},
	created() {
		const tagsList = [];
		appRouter.map((item) => {
			if (item.children.length <= 1) {
				tagsList.push(item.children[0]);
			} else {
				tagsList.push(...item.children);
			}
		});
		this.$store.commit('setTagsList', tagsList);
	},
});
