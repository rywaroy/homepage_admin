<style lang="less">
	@import "./home.less";
	@import "../../styles/common.less";
</style>
<template>
	<div class="home-main">
		<Row :gutter="10">
			<Col :md="24" :lg="8">
			<Row class-name="home-page-row1" :gutter="10">
				<Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
				<Card>
					<Row type="flex" class="user-infor">
						<Col span="8">
							<Row class-name="made-child-con-middle" type="flex" align="middle">
								<img class="avator-img" :src="avatorPath" />
							</Row>
						</Col>
						<Col span="16" style="padding-left:6px;">
							<Row class-name="made-child-con-middle" type="flex" align="middle">
								<div>
									<b class="card-user-infor-name">{{user}}</b>
									<p>super admin</p>
								</div>
							</Row>
						</Col>
					</Row>
					<div class="line-gray"></div>
					<Row class="margin-top-8">
						<Col span="8">
						<p class="notwrap">上次登录时间:</p>
						</Col>
						<Col span="16" class="padding-left-8">{{last_time | time}}</Col>
					</Row>
					<Row class="margin-top-8">
						<Col span="8">
						<p class="notwrap">上次登录地点:</p>
						</Col>
						<Col span="16" class="padding-left-8">{{last_location}}</Col>
					</Row>
				</Card>
				</Col>
			</Row>
			</Col>
			<Col :md="24" :lg="16">
			<Row :gutter="5" v-if="load">
				<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
				<infor-card id-name="user_created_count" :end-val="totalVisit" iconType="android-person-add" color="#2d8cf0" intro-text="历史浏览量"></infor-card>
				</Col>
				<Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
				<infor-card id-name="visit_count" :end-val="todayVisit" iconType="ios-eye" color="#64d572" :iconSize="50" intro-text="今日浏览量"></infor-card>
				</Col>
			</Row>
			</Col>
		</Row>
		<Row :gutter="10" class="margin-top-10">
			<Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
			<Card>
				<p slot="title" class="card-title">
					<Icon type="ios-pulse-strong"></Icon>
					数据来源统计
				</p>
				<div class="data-source-row">
					<data-source-pie :data="data" v-if="load"></data-source-pie>
				</div>
			</Card>
			</Col>
		</Row>
	</div>
</template>

<script>
	import Cookie from 'js-cookie';
	import time from 'js-time.js';
	import dataSourcePie from './components/dataSourcePie.vue';
	import inforCard from './components/inforCard.vue';

	export default {
		name: 'home',
		components: {
			dataSourcePie,
			inforCard,
		},
		data() {
			return {
				last_time: null,
				last_location: null,
				totalVisit: 0,
				todayVisit: 0,
				load: false,
				user: '',
				data: {},
			};
		},
		created() {
			this.last_time = Cookie.get('last_time');
			this.last_location = Cookie.get('last_location');
			this.user = Cookie.get('user');
		},
		mounted() {
			this.getInfo();
		},
		computed: {
			avatorPath() {
				return localStorage.avatorImgPath;
			},
		},
		methods: {
			cancelAdd() {
				this.showAddNewTodo = false;
				this.newToDoItemValue = '';
			},
			getInfo() { // 获取博客访问信息
				this.$http.get(this.API.base_visit).then(res => {
						const data = res.data.data;
						this.totalVisit = data.total;
						this.todayVisit = data.date;
						this.data = [
							{
								value: data.iphone,
								name: 'iphone',
								itemStyle: {
									normal: {
										color: '#9bd598',
									},
								},
							},
							{
								value: data.android,
								name: 'android',
								itemStyle: {
									normal: {
										color: '#ffd58f',
									},
								},
							},
							{
								value: data.pc,
								name: 'pc',
								itemStyle: {
									normal: {
										color: '#abd5f2',
									},
								},
							},
							{
								value: data.ipad,
								name: 'ipad',
								itemStyle: {
									normal: {
										color: '#ab8df2',
									},
								},
							},
							// {
							// 	value: 302340,
							// 	name: 'others',
							// 	itemStyle: {
							// 		normal: {
							// 			color: '#e14f60',
							// 		},
							// 	},
							// },
						];
						this.load = true;
					});
			},
		},
		filters: {
			time(value) {
				return time(value).format('YYYY-MM-DD HH:mm:ss');
			},
		},
	};
</script>