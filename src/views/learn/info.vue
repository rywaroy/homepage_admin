<template>
  <div class="article__info">
    <div class="article__info-line">
      <Input v-model="title" placeholder="标题" style="width: 600px" />
    </div>
    <div class="article__info-line">
      <Input v-model="intro" placeholder="简介" style="width: 600px" />
    </div>
    <div class="article__info-line">
      <Input v-model="tag" placeholder="标签" style="width: 200px" />
    </div>
    <div class="article__info-line">
      <Card>
        <textarea id="iview_admin_markdown_editor" style="display:none;"></textarea>
      </Card>
    </div>
    <div class="article__info-line">
      <Button type="primary" size="large" @click="update()" v-if="isEdit">更新</Button>
      <Button type="primary" size="large" @click="publish()" v-else>发布</Button>
    </div>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';

export default {
  data() {
    return {
      title: '',
      intro: '',
      html: '',
      md: '',
      tag: '',
      isEdit: this.$route.params.id ? true : false, // 是否为编辑状态
      simplemde: null,
    };
  },
  mounted() {
    if (this.isEdit) {
      this.getInfo();
    } else {
      this.init();
    }
  },
  methods: {
    init() {
      this.simplemde = new SimpleMDE({
        element: document.getElementById('iview_admin_markdown_editor'),
        toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'heading-smaller', 'heading-bigger', 'heading-1', 'heading-2', 'heading-3', '|', 'code', 'quote', 'unordered-list', 'clean-block', '|', 'link', 'image', 'table', 'horizontal-rule', '|', 'preview', 'guide'],
      });
      if (this.md) {
        this.simplemde.value(this.md);
      }
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
      if (!this.tag) {
        this.$Message.error('请选择文章标签');
        return false;
      }
      if (!this.simplemde.value()) {
        this.$Message.error('请输入文章内容');
        return false;
      }
      return true;
    },
    publish() { // 发布文章
      if (!this.validate()) {
        return;
      }
      this.$http.post(this.API.learn_add, {
        title: this.title,
        md: this.simplemde.value(),
        html: this.simplemde.markdown(this.simplemde.value()),
        intro: this.intro,
        tag: this.tag,
      }).then(() => {
        this.$Message.success('发表成功');
        this.$router.push({ name: 'learn_list' });
      });
    },
    getInfo() { // 获取文章详情
      this.$http.get(this.API.learn_info + this.$route.params.id)
        .then(res => {
          this.intro = res.data.data.intro;
          this.title = res.data.data.title;
          this.md = res.data.data.md;
          this.tag = res.data.data.tag;
          this.init();
        });
    },
    update() { // 更新文章
      if (!this.validate()) {
        return;
      }
      this.$http.patch(this.API.learn_update + this.$route.params.id, {
        title: this.title,
        md: this.simplemde.value(),
        html: this.simplemde.markdown(this.simplemde.value()),
        intro: this.intro,
        tag: this.tag,
      }).then(() => {
        this.$Message.success('更新成功');
        this.$router.push({ name: 'learn_list' });
      });
    },
  },
};
</script>

<style lang="less">
@import './simplemde.min.css';
.CodeMirror, .CodeMirror-scroll {
  min-height: 450px !important;
}
.CodeMirror{
  height: 400px;
}
.article__info-line {
  margin-bottom: 10px;
}
</style>
