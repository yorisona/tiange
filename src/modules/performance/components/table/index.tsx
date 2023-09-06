import { defineComponent, PropType } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
export default defineComponent({
  props: {
    columns: {
      type: Array as PropType<TgTableColumn<any>[]>,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    spanMethod: {
      type: Function as PropType<TG.anyFunc>,
      default: () => () => {},
    },
    summaryMethod: {
      type: Function as PropType<TG.anyFunc>,
    },
  },
  render() {
    const { columns, data, spanMethod } = this;
    const dataDom: any[] = [];
    let tableBodyStyle = '';
    // 计算有多少单元格, 宽度
    let tableWidth = 0;
    const maxColunWidth = columns.reduce((a: number, item: any) => {
      let width = '0';
      if (item.width !== undefined) {
        width = item.width;
      } else if (item.minWidth !== undefined) {
        width = item.minWidth;
      }
      return a + parseInt(width, 10);
    }, 0);
    tableBodyStyle = columns
      .map(item => {
        let width = '1fr';
        let currentWidth = 0;
        if (item.width !== undefined) {
          width = typeof item.width === 'string' ? item.width : `${item.width}px`;
          currentWidth = parseInt(width, 10);
        } else if (item.minWidth !== undefined) {
          width = typeof item.minWidth === 'string' ? item.minWidth : `${item.minWidth}px`;
          currentWidth = parseInt(width, 10);
        }
        tableWidth += currentWidth as number;
        if (currentWidth !== 0) {
          width = `minmax(${width},${currentWidth / maxColunWidth}fr)`;
        }

        return width;
      })
      .join(' ');
    tableBodyStyle = `grid-template-columns:${tableBodyStyle};width: ${tableWidth + 100}px`;

    data.forEach((row: any, rowIndex) => {
      columns.forEach((column: any, columnIndex) => {
        column.property = column.prop;
        let dom;
        const span = spanMethod({ row, columnIndex, column, rowIndex });
        if (span[0] === 0) return;
        const tableCellStyle = `grid-row-end: span ${span[0]}`;
        const className = ['tg-table-cell'];
        if (columnIndex === 0) {
          className.push('bl');
        }
        if (column.align === 'center') {
          className.push('is-center');
        } else if (column.align === 'right') {
          className.push('is-right');
        } else {
          className.push('is-left');
        }
        if (column.formatter) {
          dom = (
            <div class={className} style={tableCellStyle}>
              {column.formatter(row, row[column.prop], columnIndex, rowIndex)}
            </div>
          );
        } else {
          dom = (
            <div class={className} style={tableCellStyle}>
              {row[column.prop]}
            </div>
          );
        }
        dataDom.push(dom);
      });
      console.groupEnd();
    });
    return (
      <div class="tg-table">
        <div class="tg-table-body" style={tableBodyStyle}>
          {columns.map((item: any) => {
            const label = item['render-header'] ? item['render-header']() : item.label;
            return <div class="tg-table-header tg-table-cell tg-table-cell-header">{label}</div>;
          })}
          {dataDom}
          {this.summaryMethod &&
            this.summaryMethod({ columns }).map((item: any, columnIndex: number) => {
              const className = ['tg-table-cell ', 'summary-cell'];
              const column = columns[columnIndex];
              if (column.align === 'center') {
                className.push('is-center');
              } else if (column.align === 'right') {
                className.push('is-right');
              } else {
                className.push('is-left');
              }
              if (columnIndex === 0) {
                className.push('bi');
              }
              return <div class={className}>{item}</div>;
            })}
        </div>
      </div>
    );
  },
});
