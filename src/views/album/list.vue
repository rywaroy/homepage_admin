<template>
  <div class="album__content">
    <div class="album__content-btn">
      <Button type="primary" @click="showAdd = true">+ 相册</Button>
    </div>
    <div class="album__list f-cb">
      <div class="album__list-card" v-for="(item, index) in list" :key="index">
        <Card>
          <a href="javascript:;" slot="extra">
            <Icon type="android-delete" size="24" color="#999" @click="deleteConfirm(item.id, index)"></Icon>
          </a>
          <p slot="title">{{item.title}}</p>
          <div class="album__list-img bg-cover" :style="{backgroundImage: `url(${item.img})`}" @click="linkGroup(item.id)"></div>
        </Card>
      </div>
    </div>

    <Modal
      v-model="showAdd"
      title="增加相册"
      @on-ok="ok">
      <Form ref="formCustom" :model="formCustom" :rules="rules">
        <FormItem label="相册标题" prop="title">
          <Input type="text" v-model="formCustom.title" />
        </FormItem>
        <FormItem label="封面图" prop="url">
          <Input type="text" v-model="formCustom.url" />
        </FormItem>
      </Form>
      <p>推荐使用<a href="https://github.com/Molunerfinn/PicGo" target="_blank">PicGo</a>图床工具</p>
    </Modal>
  </div>
</template>

<script>
import Cookie from 'js-cookie';

export default {
  data() {
    return {
      list: [],
      showAdd: false, // 是否显示增加弹窗
      formCustom: {
        title: '',
        url: '',
      },
      rules: {
        title: [{
          required: true,
          message: '相册标题不能为空',
          trigger: 'blur',
        }],
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
      this.$http.get(this.API.album_list)
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
    add() { // 添加相册
      this.$http.post(this.API.album_list, {
        title: this.formCustom.title,
        url: this.formCustom.url,
        token: Cookie.get('token'),
      }).then(() => {
        this.$Message.success('添加成功');
        this.getList();
      });
    },
    deleteConfirm(id, index) { // 删除相册
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除该相册？',
        onOk: () => {
          this.deleteAlbum(id, index);
        },
      });
    },
    deleteAlbum(id, index) { // 确认删除
      this.$http.post(this.API.album_delete, {
        id,
        token: Cookie.get('token'),
      }).then(() => {
        this.list.splice(index, 1);
      });
    },
    linkGroup(id) { // 跳转相册集
      this.$router.push({ path: `/album/group/${id}` });
    },
  },
};
</script>

<style>
@import './list.less';
</style>
