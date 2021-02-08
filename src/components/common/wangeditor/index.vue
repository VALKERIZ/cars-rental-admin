<template>
  <div ref="editorDom"></div>
</template>

<script>
// 富文本编辑器
import Editor from "wangeditor";
export default {
  name: "Wangeditor",
  components: {},
  mounted() {
    this.editor = new Editor(this.$refs.editorDom);
    this.editor.customConfig.onchange = (html) => {
      this.$emit("update:content", html);
    };
    this.editor.create(); // 创建富文本实例
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    clear() {
      this.editor.txt.clear();
    },
  },
  watch: {
    value: {
      handler(newValue) {
        this.editor.txt.html(newValue);
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
