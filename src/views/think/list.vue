<template>
  <div class="article__list">
    <div class="article__list-add">
      <Button type="primary" @click="add()">+ 说说</Button>
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
      list: [],
      page: 1,
      limit: 8,
      total: 0,
      columns: [
        {
          title: '内容',
          key: 'content',
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
            }, params.row.content ? params.row.content : '【表情】')
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
  mounted() {
    this.getList();
  },
  methods: {
    getList() { // 获取列表
      this.$http.get(this.API.think_list, {
        params: {
          page: this.page,
          limit: this.limit,
        },
      }).then(res => {
        this.list = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    delete(id) { // 删除说说
      this.$http.post(this.API.think_delete, {
        id,
        token: Cookie.get('token'),
      }).then(() => {
        this.getList();
      });
    },
    add() { // 增加说说，跳转详情页
      this.$router.push({ name: 'think_add' });
    },
    linkInfo(id) { // 跳转说说详情
      this.$router.push({ path: `/think/info/${id}` });
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

<style>

</style>
