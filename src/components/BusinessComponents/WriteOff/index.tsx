import { defineComponent, PropType } from '@vue/composition-api';
import Money, { MoneyUnit } from '@/utils/money';
import Decimal from 'decimal.js';
const money = new Money();
const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `${money.format(num, MoneyUnit.Yuan)}`;
/**
 * 核销状态Table列
 */
export default defineComponent({
  props: {
    write_off_infos: Array as PropType<string[]>,
    write_off_header: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    write_off_status: {
      type: Number,
    },
    // 是否是冲销单
    is_reverse: {
      type: Boolean,
      default: false,
    },
  },
  name: 'WriteOff',
  render() {
    const nodes = [];

    let baseIndex = 0;
    if ((this.write_off_header?.length ?? 0) === 3) {
      baseIndex = -1;
    }

    if (this.write_off_status === 2) {
      nodes.push(
        <div class="status" key="key1">
          <label>状态：</label>
          <span>已核销</span>
        </div>,
      );
    } else if (this.write_off_status === 1) {
      nodes.push(
        <div class="status" key="key2">
          <label>状态：</label>
          <span class="yellow">部分核销</span>
        </div>,
      );
    } else if (this.write_off_status === 0) {
      nodes.push(
        <div class="status" key="key3">
          <label>状态：</label>
          <span class="yellow">未核销</span>
        </div>,
      );
    }
    if ((this.write_off_infos?.length ?? 0) > 0) {
      nodes.push(
        <div class="status" key="key4">
          <label>详情：</label>
          <el-popover placement="bottom-end" trigger="hover" popper-class="achievement-popover">
            <a slot="reference">预览</a>
            <div
              style={baseIndex === 0 ? 'width: 604px' : 'width: 444px'}
              class="writeoff-popover-content"
            >
              <div class="table-header">
                <table>
                  <colgroup>
                    {baseIndex === 0 ? <col style="width:172px" /> : ''}
                    <col />
                    <col style="width:128px" />
                    <col style="width:128px" />
                  </colgroup>
                  <thead>
                    <tr>
                      {baseIndex === 0 ? <th>{this.write_off_header[baseIndex]}</th> : ''}
                      <th>{this.write_off_header[baseIndex + 1]}</th>
                      <th align="right">{this.write_off_header[baseIndex + 2]}</th>
                      <th>{this.write_off_header[baseIndex + 3]}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="table-body">
                <table>
                  <colgroup>
                    {baseIndex === 0 ? <col style="width:172px" /> : ''}
                    <col />
                    <col style="width:128px" />
                    <col style="width:128px" />
                  </colgroup>
                  <tbody>
                    {this.write_off_infos?.map(item => {
                      const is_reverse_order = /-/u.test(item[baseIndex + 2]);
                      return (
                        <tr>
                          {baseIndex === 0 ? <td>{item[baseIndex]}</td> : ''}
                          <td class={is_reverse_order ? 'reverse-red' : ''}>
                            {item[baseIndex + 1]}
                          </td>
                          <td
                            class={
                              is_reverse_order ||
                              new Decimal(item[baseIndex + 2]).lessThan(new Decimal(0))
                                ? 'reverse-red'
                                : ''
                            }
                            align="right"
                          >
                            {moneyFormat(item[baseIndex + 2] as any)}
                          </td>
                          <td>
                            <div>{item[baseIndex + 3]}</div>
                            <div class="label">{item[baseIndex + 4]}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </el-popover>
        </div>,
      );
    }

    return <div>{nodes}</div>;
  },
});
