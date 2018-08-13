<template>
	<div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';

export default {
	name: 'dataSourcePie',
	props: {
		data: {
			type: Object,
		},
	},
	mounted() {
		this.$nextTick(() => {
			const dataSourcePie = echarts.init(document.getElementById('data_source_con'));
			const option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				legend: {
					orient: 'vertical',
					left: 'right',
					data: ['iphone', 'android', 'pc', 'ipad'],
				},
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: '66%',
					center: ['50%', '60%'],
					data: this.data,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				}],
			};
			dataSourcePie.setOption(option);
			window.addEventListener('resize', () => {
				dataSourcePie.resize();
			});
		});
	},
};
</script>
