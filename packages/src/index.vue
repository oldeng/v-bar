<template>
  <div ref="bar" class="v-bar"></div>
</template>
<script>
import Bar from './bar';

export default {
  name: 'VBar',
  methods: {
    setOptions (options) {
      this.bar.setOptions(options);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.bar = Bar.init(this.$refs['bar']);
    })
  },
};
</script>
<style lang="less" scoped>
.v-bar {
  width: 100%;
  height: 100%;
}
</style>