<template>
  <div class="article__tag">
    <div class="article__tag-item" v-for="(item, index) in list" :key="index" :style="{background: item.color}">{{item.title}}</div>
    <Button type="primary" size="large" @click="add()">+ 增加</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http.get(this.API.article_tag)
        .then(res => {
          this.list = res.data.data;
        });
    },
    add() {

    },
  },
};
</script>

<style lang="less">
	@import './tag.less';
</style>
