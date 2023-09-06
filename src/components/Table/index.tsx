/**
 * 基于el-table封装的表格组件
 */
import { defineComponent, PropType, ref, watch, h } from '@vue/composition-api';
import { TgTableColumn, IDataTypeEnum, IDataType } from '@/types/vendor/column';
import { numberFormat } from '@/utils/formatMoney';
import moment from 'moment';

/** el-table需要调用的方法 */
const elTableMethod = ['setCurrentRow', 'clearFilter'];
/** 数据显示类型 */
const dataTypeDefault: { [key in IDataTypeEnum]: IDataType } = {
  text: { type: 'text', toFixed: 2 },
  money: { type: 'money', dec_point: '.', thousands_sep: ',' },
  number: { type: 'number' },
  enum: { type: 'enum' },
  date: { type: 'date' },
  datetime: { type: 'datetime' },
};
export default defineComponent({
  name: 'TgTable',
  props: {
    /** 列数组 */
    columns: Array as PropType<TgTableColumn<any>[]>,
    /**
     * 合并行或列的计算方法
     * 类型：Function({ row, column, rowIndex, columnIndex })
     */
    'span-method': {},
    /**
     * 是否在表尾显示合计行
     * 类型：Boolean
     */
    'show-summary': {},
    /**
     * 自定义的合计计算方法
     * 类型：Function({ columns, data })
     */
    'summary-method': {},
    /** Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。 */
    height: {
      type: String,
    },
    /** 显示的数据 */
    data: {
      type: Array as PropType<any[]>,
    },
    /**
     * 分页数据
     * 类型：参见el-pagination, https://element.eleme.cn/#/zh-CN/component/pagination
     */
    pagination: {
      type: Object as PropType<any>,
    },
    stripe: {
      type: Boolean,
      default: () => false,
    },
    border: {
      type: Boolean,
      default: () => false,
    },
    'sort-by': {},
    'default-sort': {},
  },
  setup(props) {
    /** 传递给真实table的列配置 */
    const ProcessColumns = ref<undefined | any[]>();

    const map = () => {
      if (props.columns) {
        ProcessColumns.value = props.columns.map(column => {
          // 读取出所有配置属性
          const result = {
            ...column,
          };
          // 没有配置自定义格式化才启用
          if (column.formatter !== undefined) {
            // 支持字符串模板
            if (typeof column.formatter === 'string') {
              result.formatter = row => {
                const variableRegex = /\{(.+?)\}/g;
                let hasPlusSign = false;
                const formattedString = (column.formatter as string).replace(
                  variableRegex,
                  (match, variable) => {
                    // 判断符,为假返回'--
                    if (variable.startsWith('?')) {
                      const key: string =
                        variable.slice(1) === 'A' ? column.prop : variable.slice(1);
                      const value = row[key];
                      return value || (hasPlusSign = true);
                    }
                    // 如果是表达式, 就使用 eval() 方法执行表达式求值
                    if (/[+/*]/.test(variable)) {
                      const expression = variable.replace(
                        /(\w+)/g,
                        (word: string) => row[word] || word,
                      );
                      try {
                        const value = eval(expression);
                        return value;
                      } catch (error) {
                        console.error(`Error evaluating expression: ${expression}`, error);
                      }
                    }
                    // 支持A默认值
                    const { prop } = column;
                    const value = variable === 'A' && prop ? row[prop] : row[variable];
                    return value || '';
                  },
                );

                return hasPlusSign ? '--' : formattedString;
              };
            } else {
              result.formatter = (...args) => {
                return (column.formatter as any).apply({ $createElement: h }, args);
              };
            }
          } else {
            let dataTypeConfig: IDataType;
            if (typeof column.dataType === 'string' || typeof column.dataType === 'undefined') {
              dataTypeConfig = dataTypeDefault[column.dataType || 'text'];
            } else {
              dataTypeConfig = {
                ...dataTypeDefault[column.dataType.type || 'text'],
                ...column.dataType,
              };
            }

            result.formatter = (row: any) => {
              const OriginalVal = row[(column as any).prop];
              let newVal = OriginalVal;
              // 如果数据没有 则填写 --
              if (OriginalVal === undefined || OriginalVal === null || OriginalVal === '')
                return '--';
              // 如果有数字单位, 那就除以单位, 默认按分处理
              if (dataTypeConfig.unit && Number(newVal) !== 0) {
                newVal = (OriginalVal / dataTypeConfig.unit).toFixed(dataTypeConfig.toFixed);
              }
              switch (dataTypeConfig.type) {
                case 'money':
                  newVal = numberFormat(
                    newVal,
                    dataTypeConfig.toFixed as number,
                    dataTypeConfig.dec_point,
                    dataTypeConfig.thousands_sep,
                  );
                  break;
                case 'enum':
                  newVal = dataTypeConfig.enum.get(newVal) ?? '--';
                  break;
                case 'date':
                  newVal = moment(newVal).format(dataTypeConfig.format || 'YYYY.MM.DD');
                  break;
                case 'datetime':
                  newVal = moment(newVal).format(dataTypeConfig.format || 'YYYY.MM.DD HH:mm:ss');
                  break;
              }

              // 如果需要补充前缀 就补充前缀
              if (dataTypeConfig.prefix) {
                newVal = `${dataTypeConfig.prefix}${newVal}`;
              }
              // 如果需要补充后缀,就在后面追加后缀
              if (dataTypeConfig.suffix) {
                newVal = `${newVal}${dataTypeConfig.suffix}`;
              }
              return newVal;
            };
          }

          return result;
        });
      } else {
        ProcessColumns.value = [];
      }
    };
    map();

    watch(() => props.columns, map, { deep: true });

    const elTableMethods: { [key: string]: () => void } = {};
    const tableRef = ref<any>();
    elTableMethod.forEach(key => {
      elTableMethods[key] = (...args: any[]) => {
        tableRef?.value[key](...args);
      };
    });

    const clearSort = () => {
      tableRef.value?.clearSort();
    };

    return {
      tableRef,
      clearSort,
      ProcessColumns,
      ...elTableMethods,
    };
  },
  render() {
    const props = {
      attrs: this.$attrs,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      props: this.$props,
    };
    const pagination: any = this.pagination;
    const empty = this.$slots.empty ? (
      <fragments slot="empty">{this.$slots.empty}</fragments>
    ) : (
      <empty-common slot="empty" />
    );
    const table = (
      <el-table {...props} ref="tableRef">
        {this.$slots.default}
        {this.ProcessColumns &&
          this.ProcessColumns.map((col, colIndex) => {
            return <el-table-column key={col.key || colIndex} props={{ ...col }} />;
          })}
        {empty}
      </el-table>
    );
    if (pagination === undefined) return table;
    return (
      <div class="el-table-container">
        {table}
        {pagination.total > 0 && (
          <el-pagination
            total={pagination.total}
            page-size={pagination.page_size}
            page-sizes={pagination.page_sizes}
            layout={pagination.layout || 'total, prev, pager, next'}
            current-page={pagination.page_num}
            oncurrent-change={pagination.onCurrentChange}
            onsize-change={pagination.onSizeChange}
          />
        )}
      </div>
    );
  },
});
