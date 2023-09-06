<template>
  <div class="opinion-upload-box">
    <tg-upload
      v-if="canIUpload"
      :multiple="true"
      class="col-span-full"
      action="/api/resources/upload_file"
      :show-file-list="false"
      :data="{ type: 'visual_design', storage: 2 }"
      :beforeUpload="beforeUpload"
      :success="successHandle"
    >
      <tg-button size="mini" icon="ico-upload-lite">上传附件</tg-button>
      <span v-if="prompt" class="mgl-8" style="font-weight: 400; font-size: 12px; color: #888888">{{
        prompt
      }}</span>
      <span v-else class="mgl-8" style="font-weight: 400; font-size: 12px; color: #888888"
        >{{ uploadPrompt }}单个文件大小不超过500M</span
      >
    </tg-upload>
    <template>
      <div class="file-list-item" v-for="i in val" :key="i">
        <!-- <span class="mgr-8">{{ decodeURI(i) }}</span> -->
        <uploadName :showDelete="showDelete" @delete="deleteItem" :filepath="i" />
      </div>
    </template>
    <!-- <div v-else>无</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import uploadName from './uploadName';

export default defineComponent({
  name: 'opinion-upload',
  components: {
    uploadName,
  },
  props: {
    canIUpload: {
      type: Boolean,
      default: true,
    },
    /* 文件列表 */
    value: {
      type: Array,
      default: () => [],
    },
    modelUrl: {
      type: String,
      default: 'url',
    },
    on: {
      type: Object,
      default: () => ({}),
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    extensions: {
      type: Array,
      default: () => [],
    },
    /** 提示文案 */
    prompt: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const val = computed<string[]>(() => {
      if (Array.isArray(props.value) && typeof props.value[0] !== 'string') {
        return props.value.map((i: any) => i[props.modelUrl]);
      }
      return props.value;
    });

    const beforeUpload = (config: any): boolean =>
      ValidationFileUpload({ fileSize: 500, extensions: props.extensions as string[] })(config);

    const successHandle = (res: { data: { source: string }; error_code: number }) => {
      if (res.error_code === 0) {
        // ctx.emit('input', [...props.value, res.data.source]);
        ctx.emit('change', 'add', res.data.source);
      }
    };
    const uploadPrompt = computed(() => {
      return props.extensions.length > 0 ? `格式为(${props.extensions.join('、')}), ` : '';
    });
    const deleteItem = (filepath: string) => {
      const index = val.value.indexOf(filepath);
      // if (index > -1) {
      //   props.value.splice(index, 1);
      // }
      // ctx.emit('input', [...props.value]);
      ctx.emit('change', 'delete', val.value[index]);
    };
    return {
      beforeUpload,
      successHandle,
      deleteItem,
      val,
      uploadPrompt,
    };
  },
});
</script>

<style lang="less" scoped>
.opinion-upload-box {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  // padding-left: 10px;
  width: 100%;
  row-gap: 4px;
  .col-span-full {
    -ms-grid-column-span: 1 / -1;
    grid-column: 1 / -1;
  }
  .file-list-item {
    display: flex;
    align-items: center;
    // margin-bottom: 4px;
    /deep/ .btn {
      font-weight: 400;
      font-size: 12px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }
}
</style>
