<template>
  <tg-block class="components-demo-button">
    <template #title>
      <div>按钮/Button</div>
    </template>
    <div>
      <el-switch v-model="isPreviewAllMode" active-text="自定义参数模式" inactive-text="预览模式" />
    </div>
    <template v-if="isPreviewAllMode">
      <div class="diy-block">
        <el-form :model="btnPropsFrom" label-width="120px">
          <el-form-item label="文本：" prop="content">
            <el-input size="small" v-model="btnPropsFrom.content" />
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-select size="small" v-model="btnPropsFrom.type">
              <el-option
                v-for="(opt, optIndex) in btnTypeOptions"
                :key="optIndex"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="尺寸：" prop="size">
            <el-select size="small" v-model="btnPropsFrom.size" :disabled="isBtnTypeLink">
              <el-option
                v-for="(opt, optIndex) in btnSizeOptions"
                :key="optIndex"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否禁用：" prop="disabled">
            <el-switch v-model="btnPropsFrom.disabled" active-text="禁用" inactive-text="不禁用" />
          </el-form-item>
          <el-form-item label="图标：">
            <el-select size="small" v-model="btnPropsFrom.icon" :disabled="isBtnTypeLink">
              <el-option
                v-for="(opt, optIndex) in btnIconOptions"
                :key="optIndex"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="陪衬按钮数量：">
            <el-input-number v-model="autonum" :min="1" :max="10" />
          </el-form-item>
          <el-form-item label="显示按钮行轮廓：">
            <el-switch v-model="borderShow" />
          </el-form-item>
        </el-form>
        <div class="preview-block">
          <tg-button-line :class="[borderShowClass]">
            <tg-button v-bind="btnPropsShow">{{ btnPropsFrom.content }}</tg-button>
            <tg-button
              type="primary"
              :size="btnPropsFrom.size"
              v-for="index in autonum"
              :key="index"
              >陪衬按钮{{ index }}</tg-button
            >
          </tg-button-line>
          <div>
            <div>参数</div>
            <pre><code style="font-size: 12px;font-family: Monaco">{{JSON.stringify(btnPropsShow, null, 2)}}</code></pre>
            <div>按钮：&lt;tg-button&gt;&lt;/tg-button&gt;</div>
            <div>按钮行：&lt;tg-button-line&gt;&lt;/tg-button-line&gt;</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="button-preview-list">
        <div class="button-preview-block">
          <div>小按钮(size: mini)</div>
          <div class="mini-grid">
            <tg-button
              v-for="(btn, btnIndex) in miniBtnConfigs"
              v-bind="btn.props"
              :key="btnIndex"
              >{{ btn.content }}</tg-button
            >
          </div>
        </div>
        <div class="button-preview-block">
          <div class="mgt-10 mgb-10">中按钮(size: small)</div>
          <div class="small-grid">
            <tg-button
              v-for="(btn, btnIndex) in smallBtnConfigs"
              v-bind="btn.props"
              :key="btnIndex"
              >{{ btn.content }}</tg-button
            >
          </div>
        </div>
        <div class="button-preview-block">
          <div class="mgt-10 mgb-10">大按钮(size: large)</div>
          <div class="large-grid">
            <tg-button
              v-for="(btn, btnIndex) in largeBtnConfigs"
              v-bind="btn.props"
              :key="btnIndex"
              >{{ btn.content }}</tg-button
            >
          </div>
        </div>
        <div class="button-preview-block">
          <div>
            <tg-button
              v-for="(btn, btnIndex) in linkBtnConfigs"
              v-bind="btn.props"
              :key="btnIndex"
              >{{ btn.content }}</tg-button
            >
          </div>
        </div>
      </div>
    </template>
  </tg-block>
</template>

<script lang="ts">
import { ButtonType } from '@/types/components/button.enum';
import { ObjectFilterEmpty } from '@/utils/func';
import { computed, defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const isPreviewAllMode = ref(true);

    const btnPropsFrom = ref({
      disabled: false,
      type: 'default',
      size: 'default',
      icon: '',
      content: '按钮',
    });

    const autonum = ref(1);
    const borderShow = ref(false);

    const borderShowClass = computed(() => (borderShow.value ? 'border-show' : ''));

    const btnPropsShow = computed(() => {
      const { disabled, type, size, icon } = btnPropsFrom.value;

      if (type === ButtonType.link) {
        return disabled ? { type, disabled } : { type };
      } else {
        return disabled
          ? ObjectFilterEmpty({ disabled, type, size, icon })
          : ObjectFilterEmpty({ type, size, icon });
      }
    });

    const btnTypeOptions = [
      { label: '默认/次要-default', value: 'default' },
      { label: '主要-primary', value: 'primary' },
      { label: '负向-negative(删除/重置)', value: 'negative' },
      { label: '链接-link', value: 'link' },
    ];

    const btnSizeOptions = [
      { label: '默认-default(同small)', value: 'default' },
      { label: '大-large', value: 'large' },
      { label: '中-small', value: 'small' },
      { label: '小-mini', value: 'mini' },
    ];

    const btnIconOptions = [
      {
        label: '无',
        value: '',
      },
      {
        label: '添加(ico-btn-add)',
        value: 'ico-btn-add',
      },
      {
        label: '编辑(ico-edit-lite)',
        value: 'ico-edit-lite',
      },
      {
        label: '编辑(ico-edit)',
        value: 'ico-edit',
      },
      {
        label: '删除(ico-btn-delete)',
        value: 'ico-btn-delete',
      },
      {
        label: '导出(ico-btn-export)',
        value: 'ico-btn-export',
      },
      {
        label: '上传(ico-btn-upload)',
        value: 'ico-btn-upload',
      },
    ];

    const isBtnTypeLink = computed(() => btnPropsFrom.value.type === ButtonType.link);

    const miniBtnConfigs = [
      { props: { type: 'primary', size: 'mini' }, content: '小主要' },
      { props: { type: 'primary', size: 'mini', disabled: true }, content: '小主要' },
      { props: { type: 'primary', size: 'mini', icon: 'ico-btn-add' }, content: '小次要' },
      {
        props: { type: 'primary', size: 'mini', icon: 'ico-btn-add', disabled: true },
        content: '小次要',
      },
      { props: { size: 'mini' }, content: '小次要' },
      { props: { size: 'mini', disabled: true }, content: '小次要' },
      { props: { size: 'mini', icon: 'ico-btn-add' }, content: '小次要' },
      { props: { size: 'mini', icon: 'ico-btn-add', disabled: true }, content: '小次要' },
      { props: { type: 'negative', size: 'mini' }, content: '重置' },
      { props: { type: 'negative', size: 'mini', disabled: true }, content: '重置' },
      { props: { type: 'negative', size: 'mini', icon: 'ico-btn-delete' }, content: '删除' },
      {
        props: { type: 'negative', size: 'mini', icon: 'ico-btn-delete', disabled: true },
        content: '删除',
      },
    ];

    const smallBtnConfigs = [
      { props: { type: 'primary', size: 'small' }, content: '中主要' },
      { props: { type: 'primary', size: 'small', disabled: true }, content: '中主要' },
      { props: { type: 'primary', size: 'small', icon: 'ico-btn-add' }, content: '中主要' },
      {
        props: { type: 'primary', size: 'small', icon: 'ico-btn-add', disabled: true },
        content: '中主要',
      },
      { props: { size: 'small' }, content: '中次要' },
      { props: { size: 'small', disabled: true }, content: '中次要' },
      { props: { size: 'small', icon: 'ico-btn-add' }, content: '中次要' },
      { props: { size: 'small', icon: 'ico-btn-add', disabled: true }, content: '中次要' },
      { props: { type: 'negative', size: 'small' }, content: '重置' },
      { props: { type: 'negative', size: 'small', disabled: true }, content: '重置' },
      { props: { type: 'negative', size: 'small', icon: 'ico-btn-delete' }, content: '删除' },
      {
        props: { type: 'negative', size: 'small', icon: 'ico-btn-delete', disabled: true },
        content: '删除',
      },
    ];

    const largeBtnConfigs = [
      { props: { type: 'primary', size: 'large' }, content: '大主要' },
      { props: { type: 'primary', size: 'large', disabled: true }, content: '大主要' },
      { props: { type: 'primary', size: 'large', icon: 'ico-btn-add' }, content: '大主要' },
      {
        props: { type: 'primary', size: 'large', icon: 'ico-btn-add', disabled: true },
        content: '大主要',
      },
      { props: { size: 'large' }, content: '大次要' },
      { props: { size: 'large', disabled: true }, content: '大次要' },
      { props: { size: 'large', icon: 'ico-btn-add' }, content: '大次要' },
      { props: { size: 'large', icon: 'ico-btn-add', disabled: true }, content: '大次要' },
      { props: { type: 'negative', size: 'large' }, content: '重置' },
      { props: { type: 'negative', size: 'large', disabled: true }, content: '重置' },
      { props: { type: 'negative', size: 'large', icon: 'ico-btn-delete' }, content: '删除' },
      {
        props: { type: 'negative', size: 'large', icon: 'ico-btn-delete', disabled: true },
        content: '删除',
      },
    ];

    const linkBtnConfigs = [
      { props: { type: 'link' }, content: '查看' },
      { props: { type: 'link', disabled: true }, content: '查看' },
      { props: { type: 'link' }, content: '编辑' },
      { props: { type: 'link', disabled: true }, content: '编辑' },
      { props: { type: 'link' }, content: '删除' },
      { props: { type: 'link', disabled: true }, content: '删除' },
    ];

    return {
      isPreviewAllMode,
      btnPropsFrom,
      btnPropsShow,
      autonum,
      borderShow,
      borderShowClass,
      isBtnTypeLink,
      btnTypeOptions,
      btnSizeOptions,
      btnIconOptions,
      miniBtnConfigs,
      smallBtnConfigs,
      largeBtnConfigs,
      linkBtnConfigs,
    };
  },
});
</script>

<style lang="less">
.components-demo-button {
  .mini-grid {
    display: grid;
    width: 300px;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    row-gap: 20px;
  }
  .small-grid {
    display: grid;
    width: 300px;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    row-gap: 20px;
  }
  .large-grid {
    display: grid;
    width: 340px;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    row-gap: 20px;
  }

  .diy-block {
    display: grid;
    grid-template-areas: '. .';
    grid-template-columns: 300px auto;
    column-gap: 40px;
  }
  .border-show {
    box-shadow: 0 0 1px 1px var(--theme-color);
  }

  .button-preview-list {
    display: flex;
    > div {
      flex: none;
    }
  }
}
</style>
