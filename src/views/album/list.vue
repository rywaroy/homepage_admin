<template>
  <div class="album__content">
    <div class="album__content-btn">
      <Button type="primary" @click="showAdd = true">+ 相册</Button>
    </div>
    <div class="album__list f-cb">
      <div class="album__list-card" v-for="(item, index) in list" :key="index">
        <Card>
          <a href="javascript:;" slot="extra">
            <Icon type="android-delete" size="24" color="#999"></Icon>
          </a>
          <p slot="title">{{item.title}}</p>
          <div class="album__list-img bg-cover" :style="{backgroundImage: `url(${item.img})`}"></div>
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
    getList() {
      this.$http.get(this.API.album_list)
        .then(res => {
          this.list = res.data.data;
        });
    },
    ok() {
      this.$refs.formCustom.validate(valid => {
        if (valid) {
          this.add();
        }
      });
    },
    add() {
      this.$http.post(this.API.album_list, {
        title: this.formCustom.title,
        url: this.formCustom.url,
        token: Cookie.get('token'),
      }).then(() => {
        this.$Message.success('添加成功');
        this.getList();
      });
    },
  },
};
</script>

<style>
@import url('./list.less');
</style>
