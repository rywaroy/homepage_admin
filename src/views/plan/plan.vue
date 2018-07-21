<template>
  <div class="plan__content f-cb">
    <div class="fl">
      <div class="plan__time">
        <DatePicker type="date" placeholder="打卡日期" style="width: 200px" format="yyyy-MM-dd" v-model="time" confirm @on-ok="timeChange()"></DatePicker>
        <Button @click="isEdit = !isEdit">编辑</Button>
      </div>
      <div class="plan__record">
        <div :class="['plan__item f-cb', {'disable': item.isClock}]" v-for="(item, index) in list" :key="index" @click.self="clock(item.id, index)">
          <div class="plan__item-title fl">{{item.title}}</div>
          <div class="plan__item-delete" @click="deleteConfirm(item.id, index)" v-show="isEdit">
            <Icon type="close-round" size="18" color="#fff"></Icon>
          </div>
        </div>
        <div class="plan__item-add" @click="openAdd()"><Icon type="plus-round" size="20" color="#fff"></Icon></div>
      </div>
    </div>
    <div class="plan__circle">
      <i-circle
        :percent="percent"
        :size="250"
        :stroke-color="color">
        <div class="plan__circle-title">打卡进度</div>
        <div class="plan__circle-percent">{{percent}}%</div>
      </i-circle>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Cookie from 'js-cookie';

export default {
  data() {
    return {
      list: [],
      time: new Date(),
      title: '',
      isEdit: false, // 是否处于编辑状态
    };
  },
  mounted() {
    this.getPlanList();
  },
  methods: {
    getPlanList() { // 获取计划列表
      this.$http.get('/plan/list')
        .then(res => {
          const data = res.data.data.list;
          for (let i = 0; i < data.length; i++) {
            data[i].isClock = false;
          }
          this.list = data;
          this.getNowPlan();
        });
    },
    getNowPlan() { // 获取当天打卡记录
      this.$http.get('/plan/date', {
        params: {
          time: dayjs(this.time).format('YYYY-MM-DD'),
        },
      }).then(res => {
        const data = res.data.data.list;
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].isClock = false;
          for (let j = 0; j < data.length; j++) {
            if (this.list[i].id === data[j].tid) {
              this.list[i].isClock = true;
            }
          }
        }
      });
    },
    clock(id, index) { // 打卡
      if (this.list[index].isClock) {
        return;
      }
      this.$http.post('/plan/clock', {
        time: dayjs(this.time).format('YYYY-MM-DD'),
        id,
        token: Cookie.get('token'),
      }).then(() => {
        this.$Message.success('打卡成功！');
        this.list[index].isClock = true;
      });
    },
    timeChange() { // 切换时间
      this.getNowPlan();
    },
    openAdd() { // 打开增加计划弹窗
      this.$Modal.confirm({
        render: (h) => (
          h('Input', {
            props: {
              value: this.title,
              autofocus: true,
              placeholder: '输入计划名称',
            },
            on: {
              input: (val) => {
                  this.title = val;
              },
            },
          })
        ),
        onOk: () => {
          this.add();
        },
      });
    },
    add() { // 增加计划
      this.$http.post('/plan/list', {
        title: this.title,
        token: Cookie.get('token'),
      }).then(() => {
        this.title = '';
        this.getPlanList();
        this.$Message.success('增加成功!');
      });
    },
    deleteConfirm(id, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除该计划？',
        onOk: () => {
          this.deletePlan(id, index);
        },
      });
    },
    deletePlan(id, index) { // 删除计划
      this.$http.post('/plan/list/delete', {
        id,
        token: Cookie.get('token'),
      }).then(() => {
        this.list.splice(index, 1);
      });
    },
  },
  computed: {
    percent() { // 打卡进度
      if (this.list.length === 0) {
        return 0;
      } else {
        let num = 0;
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].isClock) {
            num++;
          }
        }
        console.log(num);
        return parseInt((num / this.list.length) * 100, 10);
      }
    },
    color() { // 进度条颜色
      let color = '#2d8cf0';
      if (this.percent === 100) {
        color = '#5cb85c';
      }
      if (this.percent <= 30) {
        color = '#ed3f14';
      }
      return color;
    },
  },
};
</script>

<style>
@import './plan.less';
</style>
