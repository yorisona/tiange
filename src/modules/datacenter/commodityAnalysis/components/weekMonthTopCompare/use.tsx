/*
 * @Author: 肖槿
 * @Date: 2021-12-01 13:46:32
 * @Description: ——
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 16:10:00
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\use.tsx
 */
import { watch, reactive, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';

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
  data: any[];
  onSortChange?: (...args: any[]) => void;
  defaultSort?: { order: string | null; prop: string };
}

/**
 * 表格数据行列转换
 * @param columns
 * @param data
 */
export const useTableConversionRow = ({ columns, data }: IConversionRow) => {
  // 定义表格转换后的真实列
  const converColumns = ref<TableColumn<any>[]>([]);
  const converData = ref<any>([]);
  // 计算列
  const execColumns = (data: any[]) => {
    const columnsLength = columns.length;
    const _data: any[] = new Array(columnsLength).fill(1).map((_, index) => index);
    const _columns: TableColumn<any>[] = new Array(Math.max(data.length + 1, 10))
      .fill(1)
      .map((_, colIndex) => {
        const config: TableColumn<any> = {
          label: `key_${colIndex}`,
          align: 'center',
          minWidth: 164,
          formatter(row, column, _, index) {
            const cColumn = columns[index];
            if (colIndex === 0) {
              const hasSort = cColumn.sortable === 'custom';
              let header = columns[index].label;
              if ((columns[index] as any).renderHeader !== undefined) {
                header = (columns[index] as any).renderHeader(columns[index]);
              }
              return (
                <div
                  class="first_column_sort"
                  onclick={() => {
                    if (!hasSort) return;
                  }}
                >
                  <span class="first_column">{header}</span>
                  {hasSort && (
                    <span class={`caret-wrapper`}>
                      <i
                        class="sort-caret ascending"
                        onclick={(e: MouseEvent) => {
                          e.stopPropagation();
                        }}
                      />
                      <i
                        class="sort-caret descending"
                        onclick={(e: MouseEvent) => {
                          e.stopPropagation();
                        }}
                      />
                    </span>
                  )}
                </div>
              );
            }
            const cRow = data[colIndex - 1];
            if (cRow === undefined) return '';
            let cText = cRow[cColumn.prop as any];
            if (cText === null) cText = '--';

            if (cColumn.formatter !== undefined) {
              return cColumn.formatter(cText, cRow, cColumn, colIndex);
            }

            return cText;
          },
        };
        // 如果是第一列,设置为固定
        if (colIndex === 0) {
          delete config.minWidth;
          config.width = 130;
          config.fixed = 'left';
        }
        return config;
      });

    converColumns.value = _columns;
    converData.value = _data;
  };

  execColumns(data);

  watch(
    () => data,
    () => {
      execColumns(data);
    },
  );

  return reactive({
    columns: converColumns,
    data: converData,
  });
};
