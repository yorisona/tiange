import { defineComponent } from '@vue/composition-api';
import styles from './index.module.less';
import { VNode } from 'vue';
export default defineComponent({
  props: {
    showExport: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    onEnterKey(e: any) {
      if (e.key !== 'Enter') return;
      const input = e.target as HTMLInputElement;
      if (input.tagName.toUpperCase() !== 'INPUT') return;
      if (input.className !== 'el-input__inner') return;
      if (!input.parentElement) return;
      let className = input.parentElement?.className || '';
      if (!className.includes('el-input')) return;
      // 这里额外处理, 如果是下拉框中的input也跳过,  后期看情况添加其他表单中的input
      className = input.parentElement?.parentElement?.className || '';
      if (className.includes('el-select')) return;
      this.$emit('search');
    },
  },
  render() {
    return (
      <div
        class={['tg-card', styles.searchBar, 'gm-generally-search-bar']}
        onKeyup={this.onEnterKey}
      >
        <el-form
          size="mini"
          show-message={false}
          hide-required-asterisk={true}
          label-width="60px"
          ref="formRef"
          nativeOn={{
            submit: (e: Event) => {
              e.preventDefault();
            },
          }}
        >
          <div class={[styles.formItemContainer, 'gm-generally-form']}>
            {this.$slots.default?.map((item: VNode) => {
              return <div class={[styles.formItem, 'gm-generally-form-item']}>{item}</div>;
            })}
            {this.$slots.searchBtn ? (
              this.$slots.searchBtn
            ) : (
              <div
                class={[styles.formItemSearchOperating, 'gm-generally-form-item-buttons']}
                style={{
                  flex: this.showExport ? 'flex: 1 1 auto' : '0 0 auto',
                }}
              >
                <tg-button type="primary" onClick={() => this.$emit('search')}>
                  查询
                </tg-button>
                <tg-button class="mgl-8" onClick={() => this.$emit('reset')}>
                  重置
                </tg-button>
                {this.showExport && (
                  <tg-button
                    class="mgl-8"
                    disabled={this.disabledExport}
                    onClick={() => this.$emit('export')}
                  >
                    导出
                  </tg-button>
                )}
              </div>
            )}
            <div class="mgl-16 mgb-8" onClick={() => this.$emit('other')}>
              {this.$slots.otherBtns}
            </div>
          </div>
        </el-form>
      </div>
    );
  },
});
