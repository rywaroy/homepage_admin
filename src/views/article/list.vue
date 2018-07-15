<template>
  <div class="article__list">
    <div class="article__list-add">
      <Button type="primary" @click="add()">+ 文章</Button>
    </div>
    <Table border :columns="columns" :data="list"></Table>
    <div class="article__list-page">
      <Page :total="total" :current.sync="page" :page-size="limit"></Page>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Cookie from 'js-cookie';

export default {
  data() {
    return {
      list: [], // 文章列表
      page: 1,
      limit: 8,
      total: 0,
      columns: [
        {
          title: '标题',
          key: 'title',
          render: (h, params) => (
            h('div', {
              class: {
                'article__list-title': true,
              },
              on: {
                click: () => {
                  this.linkInfo(params.row.id);
                },
              },
            }, params.row.title)
          ),
        },
        {
          title: '时间',
          key: 'time',
          width: 150,
          render: (h, params) => (
            h('div', dayjs(params.row.time).format('YYYY-MM-DD HH:mm'))
          ),
        },
        {
          title: '标签',
          key: 'tag_name',
          width: 100,
        },
        {
          title: '阅读量',
          key: 'watch',
          width: 100,
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          render: (h, params) => (
            h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.setTop(params.row.id, params.row.top, params.index);
                  },
                },
              }, params.row.top > 0 ? '取消置顶' : '置顶'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: '此操作将永久删除该文件, 是否继续?',
                      onOk: () => {
                        this.delete(params.row.id);
                      },
                    });
                  },
                },
              }, '删除'),
            ])
          ),
        },
      ],
    };
  },
  methods: {
    getList() { // 获取文章列表
      this.$http.get(this.API.article_list, {
        params: {
          page: this.page,
          limit: this.limit,
        },
      }).then(res => {
        this.list = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    setTop(id, top, index) { // 文章置顶
      const newTop = top === 0 ? 1 : 0;
      this.$http.post(this.API.article_top, {
        id,
        top: newTop,
        token: Cookie.get('token'),
      }).then(() => {
        this.list[index].top = newTop;
      });
    },
    delete(id) { // 删除文章
      this.$http.post(this.API.article_delete, {
        id,
        token: Cookie.get('token'),
      }).then(() => {
        this.getList();
      });
    },
    add() { // 增加文章，跳转详情页
      this.$router.push({ name: 'article_add' });
    },
    linkInfo(id) { // 跳转文章详情
      this.$router.push({ path: `/article/info/${id}` });
    },
  },
  watch: {
    page: {
      handler() {
        this.getList();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less">
	@import './list.less';
</style>
