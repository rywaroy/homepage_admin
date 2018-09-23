<template>
  <div class="article__tag">
    <div class="article__tag-item" v-for="(item, index) in list" :key="index" :style="{background: item.color}" @click="deleteConfirm(item.id)">{{item.title}}</div>
    <Button type="primary" size="large" @click="add()">+ 增加</Button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [],
      title: '',
      color: '',
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
    add() { // 添加标签
      this.$Modal.confirm({
        render: (h) => (
          h('div', [
            h('Input', {
              props: {
                value: this.title,
                autofocus: true,
                placeholder: '标签名字',
              },
              style: {
                marginBottom: '5px',
              },
              on: {
                input: (val) => {
                  this.title = val;
                },
              },
            }),
            h('Input', {
              props: {
                value: this.color,
                placeholder: '标签颜色',
              },
              on: {
                input: (val) => {
                  this.color = val;
                },
              },
            }),
          ])
        ),
        onOk: () => {
          this.addTag();
        },
      });
    },
    addTag() { // 添加
      if (!this.title) {
        this.$Message.error('请输入文章标签名');
        return;
      }
      if (!this.color) {
        this.$Message.error('请输入文章标签颜色');
        return;
      }
      this.$http.post(this.API.article_tag, {
        title: this.title,
        color: this.color,
      }).then(() => {
        this.$Message.success('添加成功');
        this.title = '';
        this.color = '';
        this.getList();
      });
    },
    deleteConfirm(index) { // 确认删除
      this.$Modal.confirm({
        title: '删除',
        content: '确认删除该标签',
        onOk: () => {
          this.deleteTag(index);
        },
      });
    },
    deleteTag(id) { // 删除标签
      this.$http.post(this.API.article_tag_delete, {
        id,
      }).then(() => {
        this.$Message.success('删除成功');
        this.getList();
      });
    },
  },
};
</script>

<style lang="less">
	@import './tag.less';
</style>
