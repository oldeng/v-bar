#预览

![预览](http://test.com/public/v-bar.gif)

#使用

```
<template>
  <div class="sector">
    <div>
        <button @click="refresh">刷新</button>
    </div>
    <div class="bar-container">
      <v-bar ref="v-bar"></v-bar>
    </div>
  </div>
</template>
<script>
import { VBar } from "../../dist/v-bar.umd.js";
import '../../dist/v-bar.css';
import { range, shuffle } from 'lodash';

var options = {
  animation: true,
  legend: [
    {
      name: "系列一",
      background: "green",
      color: "white",
      fontSize: "12px",
      align: "",
      width: 10,
      height: 10,
      x: 80,
      y: 20
    },
    {
      name: "系列二",
      background: "white",
      color: "white",
      fontSize: "12px",
      align: "",
      width: 10,
      height: 10,
      x: 200,
      y: 20
    }
  ],
  grid: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  xAxis: {
    name: "x轴线",
    color: "red",
    splitWidth: 6,
    fontSize: 12,
    fontFamily: "微软雅黑",
    data: ["aa", "B", "C", "D"]
  },
  yAxis: {
    name: "",
    color: "red",
    splitWidth: 6,
    fontSize: 14,
    fontFamily: "微软雅黑",
    data: [1, 2, 3, 4, 5],
    interval: 10,
    min: 0,
    max: 100
  },
  series: [
    {
      name: "已经办理业务",
      background: "white",
      width: 30,
      spliteColor: "white",
      data: [30, 20, 30, 40]
    },
    {
      name: "未经办理业务",
      background: "green",
      width: 30,
      spliteColor: "white",
      data: [40, 30, 20, 10]
    }
  ]
};
export default {
  methods: {
    refresh() {
      this.$refs["v-bar"].setOptions(
        Object.assign(options, {
          series: [
            {
              name: "已经办理业务",
              background: "white",
              width: 30,
              spliteColor: "white",
              data: shuffle([13, 22, 45, 66])
            },
            {
              name: "未经办理业务",
              background: "green",
              width: 30,
              spliteColor: "white",
              data: shuffle([23, 32, 20, 10])
            }
          ]
        })
      );
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs["v-bar"].setOptions(options);
    });
  },
  components: {
    VBar
  }
};
</script>
<style lang="less" scoped>
.sector {
  .bar-container {
    margin: 0 auto;
    width: 400px;
    height: 400px;
    border: 1px solid red;
  }
}
</style>

```
