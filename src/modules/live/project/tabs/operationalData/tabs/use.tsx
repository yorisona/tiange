import { watch, reactive, ref, set, nextTick, Ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
// import { numberFormat } from '@/utils/formatMoney';

// 表格行列转换
interface IConversionRow {
  columns: {
    label: string;
    align?: string;
    prop?: string;
    type?: string;
    formatter?: (text?: any, row?: any, column?: any, idx?: number) => any;
    sortable?: string;
  }[];
  data: Ref<any[]>;
  onSortChange?: (...args: any[]) => void;
  defaultSort?: { order: string | null; prop: string };
  headerNames?: any[];
}
interface TableColumnWithJSX<T extends Record<string, any>> extends TableColumn<T> {
  renderHeader?: () => JSX.Element;
}

/**
 * 表格数据行列转换
 * @param columns
 * @param data
 */
export const useTableConversionRow = ({ columns, data, headerNames }: IConversionRow) => {
  // 定义表格转换后的真实列
  const converColumns = ref<TableColumn<any>[]>([]);
  const converData = ref<any>([]);
  // let defaultFoldMap: any[] = [];
  // 折叠映射
  const foldMap = ref<Map<any, any[]>>(new Map());
  // const foldFuc =
  // 计算列
  const execColumns = (data: any[]) => {
    const columnsLength = columns.length;
    const _data: any[] = new Array(columnsLength).fill(1).map((_, index) => index);
    const _columns: TableColumn<any>[] = new Array(Math.max(data.length + 1))
      .fill(1)
      .map((_, colIndex) => {
        const config: TableColumnWithJSX<any> = {
          // label: headerNames[colIndex] || `key_${colIndex}`, // 使用外部定义的表头名字或默认值
          label: `key_${colIndex}`,
          prop: columns[colIndex]?.prop,
          align: 'center',
          minWidth: 164,
          // renderHeader: () => {
          //   return typeof headerNames[colIndex] === 'function'
          //     ? headerNames[colIndex]()
          //     : headerNames[colIndex] || `key_${colIndex}`;
          // },
          formatter(row, column, _, index) {
            const cColumn = columns[index];

            if (colIndex === 0) {
              const hasSort = cColumn?.sortable;
              let header = columns[index]?.label;

              if ((columns[index] as any)?.renderHeader !== undefined) {
                header = (columns[index] as any).renderHeader(columns[index]);
              }
              // 有折叠则默认折叠
              // if (
              //   hasSort &&
              //   !foldMap.value.has(columns[index].prop) &&
              //   !defaultFoldMap.includes(columns[index].prop)
              // ) {
              //   const endIndex = columns.findIndex(v => v.prop === cColumn.sortable);

              //   if (endIndex === -1) return;

              //   foldMap.value.set(columns[index].prop, columns.slice(index + 1, endIndex + 1));
              //   columns.splice(index + 1, endIndex - index);
              //   defaultFoldMap.push(columns[index].prop);
              //   execColumns(data);
              // }
              return (
                <div
                  class="first_column_sort"
                  style={hasSort && 'cursor:pointer;'}
                  onclick={() => {
                    if (!hasSort) return;

                    const currentProp = columns[index].prop;
                    const foldColumns = foldMap.value.get(currentProp);

                    if (!foldColumns) {
                      // 折叠
                      const endIndex = columns.findIndex((v: any) => v.prop === cColumn.sortable);
                      if (endIndex === -1) return;

                      foldMap.value.set(currentProp, columns.slice(index + 1, endIndex + 1));
                      columns.splice(index + 1, endIndex - index);
                    } else {
                      // 展开
                      columns.splice(index + 1, 0, ...foldColumns);
                      foldMap.value.delete(currentProp);
                    }

                    execColumns(data);
                  }}
                >
                  {hasSort && (
                    <fragments>
                      <span
                        class={'el-icon-arrow-down mgr-6'}
                        style={
                          foldMap.value.has(columns[index].prop)
                            ? 'transform:rotate(-90deg); '
                            : 'transform:rotate(0deg);'
                        }
                        onclick={(e: MouseEvent) => {
                          e.stopPropagation();
                        }}
                      />
                    </fragments>
                  )}
                  <span class="first_column">{header}</span>
                </div>
              );
            }
            const cRow = data[colIndex - 1];
            if (cRow === undefined) return '';
            let cText = cRow[cColumn?.prop as any];
            if (cText === null) cText = '--';

            if (cColumn?.formatter !== undefined) {
              return cColumn.formatter(cText, cRow, cColumn, colIndex);
            }

            return cText;
          },
        };

        // 如果是第一列,设置为固定
        if (colIndex === 0) {
          delete config.minWidth;
          config.width = 170;
          config.align = 'left';
          config.fixed = 'left';
        }
        return config;
      });

    converColumns.value = _columns;
    converData.value = _data;
  };

  execColumns(data.value);

  watch(
    () => data.value,
    () => {
      foldMap.value = new Map();
      // defaultFoldMap = [];
      // console.log('触发', columns);

      execColumns(data.value);
    },
  );

  return reactive({
    columns: converColumns,
    data: converData,
  });
};

// export const useVexTableConversionRow = ({columns, data}: any) => {
//   const converColumns = ref<TableColumn<any>[]>([]);
// };

export const columnTemplate = (row: any, field: string, cb?: (val: string, row: any) => void) => {
  if (row?.[`field_edit_${field}_${row.latitude}`] === undefined)
    set(row, `field_edit_${field}_${row.latitude}`, false);
  // let inputVal = row[field] || '';
  return (
    <div id={`field_edit_${field}_${row.latitude}`}>
      {row?.[`field_edit_${field}_${row.latitude}`] ? (
        <el-input
          size="mini"
          type="textarea"
          rows="2"
          value={row[field]}
          onInput={(e: any) => {
            row[field] = e;
          }}
          onBlur={() => {
            set(row, `field_edit_${field}_${row.latitude}`, false);
            cb && cb(row[field], row);
          }}
        />
      ) : (
        <div
          style="height:60px;line-height:18px;white-space: pre-wrap;overflow: auto;"
          onDblclick={() => {
            set(row, `field_edit_${field}_${row.latitude}`, true);
            nextTick(() => {
              (document.getElementById(`field_edit_${field}_${row.latitude}`) as any)
                .querySelector('.el-textarea__inner')
                .focus();
            });
          }}
        >
          {row[field] || <span style="color:var(--text-four-color)">双击输入填写</span>}
        </div>
      )}
    </div>
  );
};
