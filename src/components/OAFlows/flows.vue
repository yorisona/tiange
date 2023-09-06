<template>
  <div class="oa-flows">
    <div class="oa-flows-hd">审批进度</div>
    <div class="oa-flows-bd">
      <el-steps direction="vertical" :active="length">
        <el-step v-if="receivedPersons !== '' && isProcessing">
          <template #icon>
            <tg-icon name="ico-waiting" style="font-size: 14px" />
          </template>
          <template #description>
            <div class="oa-flow-content" style="color: #a4b2c2">{{ receivedPersons }}</div>
            <div class="oa-flow-content" style="color: #a4b2c2">待处理</div>
          </template>
        </el-step>
        <el-step v-for="(node, index) in flows" :key="index">
          <template #icon>
            <tg-icon name="ico-cross-red" style="font-size: 16px" v-if="node.isFailureNode" />
            <tg-icon name="ico-tick" style="font-size: 16px" v-else />
          </template>
          <template #description>
            <div class="oa-flow-content">{{ node.nodeName }}</div>
            <div class="oa-flow-content">
              <span>审批人：{{ node.operatorName }}</span>
              <span class="fg-failure" v-if="node.isFailureNode && get_node_result(node)"
                >({{ get_node_result(node) }})</span
              >
            </div>
            <div class="oa-flow-footer">{{ node.operateDate }} {{ node.operateTime }}</div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script src="./flows.ts"></script>

<style lang="less">
@import './flows.less';
</style>
