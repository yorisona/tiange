<template>
  <tg-block class="components-demo-button">
    <div>
      <el-input-number
        size="small"
        v-model="stepActiveNumber"
        :min="0"
        :max="stepDateList.length"
      />
      <el-switch v-model="multilines" active-text="是否显示多余内容" />
    </div>
    <div>
      <tg-steps
        class="horizontal-steps"
        :steps="stepDateList"
        :active="stepActiveNumber"
        style="border: 0px solid #f00"
      />
      <tg-steps
        class="vertical-steps"
        :steps="stepDateList"
        :active="stepActiveNumber"
        direction="vertical"
      />
    </div>
  </tg-block>
</template>

<script src="./index.ts"></script>

<style lang="less">
.vertical-steps {
  transition: all 500ms ease-in-out;
}
.horizontal-step {
  transition: all 500ms ease-in-out;
}
</style>
