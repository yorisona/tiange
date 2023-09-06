import { defineComponent, PropType, ref, nextTick, h } from '@vue/composition-api';
import styles from './index.module.less';
import { TgTableColumn } from '@/types/vendor/column';
import { VNode } from 'vue';
import { usePagination } from '@gm/hooks/ahooks';
import { ExportList } from '@/modules/datacenter/competitor/use';
import { FormList } from '@gm/templates/form';
export interface ITemplateConfig {
  auto?: boolean;
  /** 点击重置按钮调用 **/
  reset?: IAnyFunc;
  table?: Record<string, unknown> & {
    rowClick?: TG.anyFunc;
    summaryMethod?: TG.anyFunc;
    showSummary?: boolean;
    selectionChange?: TG.anyFunc;
  };
  showExport?: boolean;
  exportURL?: string;
  export?: TG.anyFunc;
  emptyText?: string | undefined;
  searchBefor?: TG.anyFunc;
  [key: string]: any;
}

export default defineComponent({
  components: {
    FormList,
  },
  props: {
    /** 绑定表格的列 **/
    columns: {
      type: Array as PropType<TgTableColumn<unknown>[]>,
      default: () => [],
    },
    /** 绑定表格的数据**/
    value: {
      type: Object as any,
    },
    /** 顶部面包屑的配置 **/
    routes: {},
    service: {
      required: true,
      type: Function as PropType<ReturnType<typeof usePagination>>,
    },
    config: {
      type: Object as PropType<ITemplateConfig>,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const formRef = ref<IFormRef>();
    const { reset } = props.config || {};
    const reqData = props.service;
    const search = () => {
      let value = props.value;
      if (props.config.searchBefor) {
        value = props.config.searchBefor();
      }
      return reqData.pagination.reQuery(value);
    };
    const onReset = () => {
      if (reset) reset();
      nextTick(search);
    };
    const onExport = () => {
      if (props.config.exportURL) {
        let value = props.value;
        if (props.config.searchBefor) {
          value = props.config.searchBefor();
        }

        ExportList(value, props.config.exportURL);
      }
    };
    const onOtherBtn = () => {
      if (props.config.onOtherBtn) {
        props.config.onOtherBtn();
        nextTick(search);
      }
    };
    if (props.config?.auto) {
      search();
    }

    const tableRef = ref<any>();

    return { formRef, onReset, reqData, search, onExport, onOtherBtn, tableRef };
  },
  render() {
    let bodyContainer: VNode | VNode[] | undefined = this.$slots.bodyContainer;
    if (!bodyContainer) {
      bodyContainer = (
        <div class={styles.bodyContainer}>
          {this.$slots.btnLine && <div class={styles.btnLine}>{this.$slots.btnLine}</div>}
          <div class={styles.tableContainer}>
            <tg-table
              ref="tableRef"
              stripe
              border={this.config?.table?.border}
              v-loading={this.reqData?.loading}
              columns={this.columns}
              height={'100%'}
              data={this.reqData?.data}
              pagination={this.reqData?.pagination}
              onSelection-change={this.config?.table?.selectionChange}
              show-summary={this.config?.table?.showSummary}
              summary-method={this.config?.table?.summaryMethod}
              onrow-click={this.config?.table?.rowClick}
            >
              <div class="tg-page-empty" slot="empty">
                <empty-common detail-text={this.config?.emptyText || '暂无数据'} />
              </div>
            </tg-table>
          </div>
        </div>
      );
    }

    return (
      <div class={['tg-page-container', styles.template]}>
        {this.routes && <tg-breadcrumbs routes={this.routes} />}
        {this.$slots.searchBefor}
        {this.$slots.default &&
          h(
            'form-list',
            {
              on: {
                search: this.search,
                reset: this.onReset,
                export: this.onExport,
                other: this.onOtherBtn,
              },
              props: {
                showExport: this.config.showExport,
              },
            } as any,
            [
              ...(this.$slots.default as any),
              (this.$slots.searchBtn || []).map((data: any) => {
                return h(data.tag, data.data, data.children);
              }),
              <div slot="otherBtns">{this.$slots.otherBtns}</div>,
            ],
          )}
        {this.$slots.middle}
        {bodyContainer}
        {this.$slots.footer}
      </div>
    );
  },
});
