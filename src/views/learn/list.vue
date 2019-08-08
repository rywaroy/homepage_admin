<template>
  <div class="article__list">
    <div class="article__list-add">
      <Button type="primary" @click="add()">+ 笔记</Button>
    </div>
    <Table border :columns="columns" :data="list"></Table>
    <div class="article__list-page">
      <Page :total="total" :current.sync="page" :page-size="limit"></Page>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

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
          title: '类型',
          key: 'sign',
          width: 100,
        },
        {
          title: '标签',
          key: 'tag.title',
          width: 100,
          render: (h, params) => (
            h('div', params.row.tag.title)
          ),
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
                    this.$Modal.confirm({
                      title: '提示',
                      content: '此操作将永久删除该内容, 是否继续?',
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
      this.$http.get(this.API.learn_list, {
        params: {
          page: this.page,
          limit: this.limit,
        },
      }).then(res => {
        this.list = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    delete(id) { // 删除文章
      this.$http.delete(this.API.learn_delete + id)
        .then(() => {
          this.getList();
        });
    },
    add() { // 增加文章，跳转详情页
      this.$router.push({ name: 'learn_add' });
    },
    linkInfo(id) { // 跳转文章详情
      this.$router.push({ path: `/learn/info/${id}` });
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
