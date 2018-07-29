<template>
  <div class="think__info">
    <Input v-model="content" type="textarea" placeholder="说点什么..." :autosize="{minRows: 5,maxRows: 5}" />
    <div class="think__info-imgs f-cb">
      <div class="think__info-img bg-cover" v-for="(item, index) in photos" :key="index" :style="{backgroundImage: `url(${item})`}">
        <div class="think__info-mask" @click="deleteImage(index)">
          <Icon type="android-delete" size="40" color="#fff"></Icon>
        </div>
      </div>
      <div class="think__info-imgbtn" @click="showAdd = true;">
        <Icon type="plus-round" size="50" color="#ccc" class="think__info-icon"></Icon>
      </div>
    </div>
    <Button type="primary" class="think__info-btn" @click="publish()">发布</Button>
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
import Cookie from 'js-cookie';

export default {
  data() {
    return {
      isEdit: this.$route.params.id ? true : false, // 是否为编辑状态
      content: '',
      photos: [],
      formCustom: {
        url: '',
      },
      rules: {
        url: [{
          required: true,
          message: '图片不能为空',
          trigger: 'blur',
        }],
      },
      showAdd: false,
    };
  },
  mounted() {
    this.isEdit && this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http.get(this.API.think_info, {
        params: {
          id: this.$route.params.id,
        },
      }).then(res => {
        this.content = res.data.data.content;
        this.photos = res.data.data.photos;
      });
    },
    deleteImage(index) {
      this.photos.splice(index, 1);
    },
    ok() {
      if (!this.formCustom.url) {
        return;
      }
      this.photos.push(this.formCustom.url);
      this.formCustom.url = '';
    },
    publish() {
      if (!this.content && this.photos.length === 0) {
        this.$Message.error('请输入内容或者上传图片');
        return;
      }
      this.$http.post(this.$route.params.id ? this.API.think_edit : this.API.think_add, {
        content: this.content,
        photos: this.photos.join(','),
        id: this.$route.params.id,
        token: Cookie.get('token'),
      }).then(() => {
        this.$router.push({ name: 'think_list' });
      });
    },
  },
};
</script>

<style>
@import './think.less';
</style>
