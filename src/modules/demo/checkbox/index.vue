<template>
  <div class="demo">
    <h3>CheckBox 组件</h3>
    <div>组件名称 : tg-checkbox , 其余参数跟el-checkbox一致</div>
    <div></div>
    <div class="preview">
      <div>
        <div class="label">未选择</div>
        <tg-checkbox :value="false" />
      </div>
      <div>
        <div class="label">已选择</div>
        <tg-checkbox :value="true" />
      </div>
      <div>
        <div class="label">部分选择</div>
        <tg-checkbox :indeterminate="true" :value="false">全选</tg-checkbox>
      </div>
      <div>
        <div class="label">已选不可选</div>
        <tg-checkbox :value="true" :disabled="true" />
      </div>
      <div>
        <div class="label">未选不可选</div>
        <tg-checkbox :value="false" :disabled="true" />
      </div>
    </div>
    <h3>Radio 组件</h3>
    <div>组件名称 : tg-radio , 其余参数跟el-radio一致</div>
    <div></div>
    <div class="preview">
      <div>
        <div class="label">未选择</div>
        <tg-radio :value="false" :label="1" />
      </div>
      <div>
        <div class="label">已选择</div>
        <tg-radio :value="2" :label="2" />
      </div>
      <div>
        <div class="label">已选不可选</div>
        <tg-radio :value="3" :disabled="true" :label="3" />
      </div>
      <div>
        <div class="label">未选不可选</div>
        <tg-radio :disabled="true" :label="4" />
      </div>
    </div>
    <h3>Divider 组件</h3>
    <div>组件名称 : tg-divider , 其余参数跟el-divider一致</div>
    <div></div>
    <div class="preview">
      <div style="width: 100%">
        <div>分割内容</div>
        <tg-divider />
        <div>分割内容</div>
      </div>
    </div>
    <h3>Mask 组件</h3>
    <div>组件名称 : tg-mask <br /></div>
    <div></div>
    <div class="preview">
      <el-button @click="maskVisible = true">显示</el-button>
      <tg-mask :visible="maskVisible">
        <el-button @click="maskVisible = false">关闭</el-button>
      </tg-mask>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  setup() {
    const maskVisible = ref(false);
    return {
      maskVisible,
    };
  },
});
</script>
<style lang="less" scoped>
.demo {
  display: flex;
  flex-direction: column;
  padding: 0 0 0 20px;

  .preview {
    display: flex;
    margin-bottom: 40px;

    > div {
      margin-right: 20px;
      display: flex;
      flex-direction: column;

      .label {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
