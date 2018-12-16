<template>
  <div class="article__info">
    <Spin fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载组件中...</div>
    </Spin>
    <div class="article__info-line">
      <Input v-model="title" placeholder="文章标题" style="width: 600px" />
    </div>
    <div class="article__info-line">
      <Input v-model="intro" placeholder="文章简介" style="width: 600px" />
    </div>
    <div class="article__info-line">
      <Select v-model="tagId" style="width:200px">
        <Option v-for="(item, index) in tagList" :value="item.id" :key="index">{{ item.title }}</Option>
      </Select>
    </div>
    <div class="article__info-line">
      <Card shadow>
        <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
      </Card>
    </div>
    <div class="article__info-line">
      <Button type="primary" size="large" @click="update()" v-if="isEdit">更新</Button>
      <Button type="primary" size="large" @click="publish()" v-else>发布</Button>
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce';

export default {
  data() {
    return {
      title: '',
      intro: '',
      content: '',
      tagList: [], // 标签列表
      tagId: '',
      spinShow: true,
      isEdit: this.$route.params.id ? true : false, // 是否为编辑状态
    };
  },
  mounted() {
    if (this.isEdit) {
      this.getInfo();
    } else {
      this.init();
    }
    this.getTag();
  },
  destroyed() {
      tinymce.get('tinymceEditer').destroy();
  },
  methods: {
    init() { // 富文本编辑器初始化
      this.$nextTick(() => {
        const height = 400;
        const vm = this;
        tinymce.init({
          selector: '#tinymceEditer',
          branding: false,
          elementpath: false,
          height,
          language: 'zh_CN.GB2312',
          menubar: 'edit insert view format table tools',
          plugins: [
              'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
              'searchreplace visualblocks visualchars code fullpage',
              'insertdatetime media nonbreaking save table contextmenu directionality',
              'emoticons paste textcolor colorpicker textpattern imagetools codesample',
          ],
          toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
          autosave_interval: '20s',
          image_advtab: true,
          table_default_styles: {
              width: '100%',
              borderCollapse: 'collapse',
          },
          setup(editor) {
            editor.on('init', () => {
              vm.spinShow = false;
              if (vm.content) {
                tinymce.get('tinymceEditer').setContent(vm.content);
              }
            });
            editor.on('keydown', () => {
              vm.content = tinymce.get('tinymceEditer').getContent();
            });
          },
        });
      });
    },
    getTag() { // 获取文章标签
      this.$http.get(this.API.article_tag)
        .then(res => {
          this.tagList = res.data.data;
        });
    },
    validate() { // 验证数据
      if (!this.title) {
        this.$Message.error('请输入文章标题');
        return false;
      }
      if (!this.intro) {
        this.$Message.error('请输入文章简介');
        return false;
      }
      if (!this.tagId) {
        this.$Message.error('请选择文章标签');
        return false;
      }
      if (!this.content) {
        this.$Message.error('请输入文章内容');
        return false;
      }
      return true;
    },
    publish() { // 发布文章
      if (!this.validate()) {
        return;
      }
      this.$http.post(this.API.article_add, {
        title: this.title,
        content: this.content,
        intro: this.intro,
        tagId: this.tagId,
      }).then(() => {
        this.$Message.success('发表成功');
        this.$router.push({ name: 'article_list' });
      });
    },
    getInfo() { // 获取文章详情
      this.$http.get(this.API.article_info + this.$route.params.id)
        .then(res => {
          this.intro = res.data.data.intro;
          this.title = res.data.data.title;
          this.content = res.data.data.content;
          this.tagId = res.data.data.tagid;
          this.init();
        });
    },
    update() { // 更新文章
      if (!this.validate()) {
        return;
      }
      this.$http.patch(this.API.article_update + this.$route.params.id, {
        title: this.title,
        content: this.content,
        intro: this.intro,
        tagId: this.tagId,
      }).then(() => {
        this.$Message.success('更新成功');
        this.$router.push({ name: 'article_list' });
      });
    },
  },
};
</script>

<style lang="less">
	@import './info.less';
</style>
