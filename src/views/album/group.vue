<template>
  <div class="album__content">
    <div class="album__content-btn">
      <Button type="primary" @click="showAdd = true">+ 照片</Button>
    </div>
    <div class="album__list f-cb">
      <div class="album__list-card" v-for="(item, index) in list" :key="index">
        <Card>
          <div class="album__list-img bg-cover" :style="{backgroundImage: `url(${item.url})`}"></div>
          <div class="album__list-mask" @click="deleteConfirm(item.id, index)">
            <Icon type="android-delete" size="80" color="#fff" class="album__list-icon"></Icon>
          </div>
        </Card>
      </div>
    </div>

    <Modal
      v-model="showAdd"
      title="增加照片"
      @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="rules">
        <FormItem label="照片" prop="url">
          <Input type="text" v-model="formCustom.url" />
        </FormItem>
      </Form>
      <p>推荐使用<a href="https://github.com/Molunerfinn/PicGo" target="_blank">PicGo</a>图床工具</p>
    </Modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [],
      showAdd: false,
      formCustom: {
        url: '',
      },
      rules: {
        url: [{
          required: true,
          message: '封面图不能为空',
          trigger: 'blur',
        }],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() { // 获取相册列表
      this.$http.get(this.API.album_group, { params: { id: this.$route.params.id } })
        .then(res => {
          this.list = res.data.data;
        });
    },
    ok() { // 确认添加
      this.$refs.formCustom.validate(valid => {
        if (valid) {
          this.add();
        }
      });
    },
    add() {
      this.$http.post(this.API.album_group, {
        url: this.formCustom.url,
        id: this.$route.params.id,
      }).then(() => {
        this.$Message.success('添加成功');
        this.formCustom.url = '';
        this.getList();
      });
    },
    deleteConfirm(id, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除该照片？',
        onOk: () => {
          this.deleteGroup(id, index);
        },
      });
    },
    deleteGroup(id, index) {
      this.$http.post(this.API.album_group_delete, {
        id,
      }).then(() => {
        this.$Message.success('删除成功');
        this.list.splice(index, 1);
      });
    },
  },
};
</script>

<style>
@import './list.less';
</style>
