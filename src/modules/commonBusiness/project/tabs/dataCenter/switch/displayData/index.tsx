import { defineComponent, onMounted, PropType, watch } from '@vue/composition-api';

import { useTable } from './useTable';

export default defineComponent({
  name: 'displayData',
  props: {
    currentDate: {
      type: Object as PropType<moment.Moment>,
      require: true,
    },
  },
  setup(props, ctx) {
    const tableLogic = useTable(ctx);
    watch(
      () => props.currentDate,
      newDate => {
        tableLogic.reload(newDate);
      },
    );

    onMounted(() => {
      tableLogic.reload(props.currentDate);
    });

    const methods = {};
    return {
      ...tableLogic,
      ...methods,
    };
  },
  render() {
    // const { tableUse } = this;
    return (
      <div class="s2b2c-display-data-page-container">
        <vxe-table
          border
          highlight-hover-row
          tooltip-config={{
            theme: 'light',
          }}
          show-overflow
          height={'100%'}
          v-loading={this.loading}
          data={this.tableData?.date_list}
        >
          <template slot="empty">
            <empty-common detail-text="暂无数据"></empty-common>
          </template>
          <vxe-colgroup title="基础信息" header-class-name={this.baseInfoClassName} align="center">
            {this.baseInfoColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                fixed={v.fixed}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="数据大屏"
            header-class-name={this.dataScreenClassName}
            align="center"
          >
            {this.dataScreenColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="流量指标"
            header-class-name={this.flowTargetClassName}
            align="center"
          >
            {this.flowTargetColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="互动指标"
            header-class-name={this.interaactiveTargetClassName}
            align="center"
          >
            {this.interactiveTargetColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>

          <vxe-colgroup
            title="商品指标"
            header-class-name={this.productTargetClassName}
            align="center"
          >
            {this.productTargetColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="交易指标"
            header-class-name={this.tradeTargetClassName}
            align="center"
          >
            {this.tradeTargetColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="用户画像-看播用户"
            header-class-name={this.viewerClassName}
            align="center"
          >
            {this.viewerColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup
            title="用户画像-成交用户"
            header-class-name={this.dealClassName}
            align="center"
          >
            {this.dealColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
          <vxe-colgroup title="带货分" header-class-name={this.baseInfoClassName} align="center">
            {this.bringGoodsGradeColumns.map(v => (
              <vxe-column
                header-class-name={v.className}
                title={v.label}
                field={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </vxe-colgroup>
        </vxe-table>
      </div>
    );
  },
});
