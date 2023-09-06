import { defineComponent, PropType } from '@vue/composition-api';

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
      require: false,
    },
    // 是否是冲销单
    is_reverse: {
      type: Boolean,
      default: false,
    },
    btnTitle: {
      type: String,
      default: '',
    },
  },
  name: 'WriteOff',
  render() {
    const nodes = [];

    let baseIndex = 0;
    if ((this.write_off_header?.length ?? 0) === 3) {
      baseIndex = -1;
    }
    if ((this.write_off_infos?.length ?? 0) > 0) {
      nodes.push(
        <div class={this.btnTitle ? 'point' : 'status point'} key="key4">
          <el-popover placement="bottom-end" trigger="hover" popper-class="achievement-popover">
            <div slot="reference">
              {this.btnTitle !== '' && (
                <div key="key1" class={this.is_reverse ? 'reverse-red' : ''}>
                  {this.btnTitle}
                </div>
              )}
              {this.btnTitle === '' && this.write_off_status === 2 && (
                <div class="status" key="key1">
                  已核销
                </div>
              )}
              {this.btnTitle === '' && this.write_off_status === 1 && (
                <div class="status yellow" key="key2">
                  <span class="">部分核销</span>
                </div>
              )}
              {this.btnTitle === '' && this.write_off_status === 0 && (
                <div class="status yellow" key="key3">
                  未核销
                </div>
              )}
            </div>
            <div
              style={baseIndex === 0 ? 'width: 584px' : 'width: 434px'}
              class="writeoff-popover-content"
            >
              <div class="table-header">
                <table>
                  <colgroup>
                    {baseIndex === 0 ? <col style="width:152px" /> : ''}
                    <col />
                    <col style="width:128px" />
                    <col style="width:128px" />
                  </colgroup>
                  <thead>
                    <tr>
                      {baseIndex === 0 ? <th>{this.write_off_header[baseIndex]}</th> : ''}
                      <th
                        align={
                          this.write_off_header[baseIndex + 1].indexOf('金额') > -1 ? 'right' : ''
                        }
                      >
                        {this.write_off_header[baseIndex + 1]}
                      </th>
                      <th
                        align={
                          this.write_off_header[baseIndex + 2].indexOf('金额') > -1 ? 'right' : ''
                        }
                      >
                        {this.write_off_header[baseIndex + 2]}
                      </th>
                      <th
                        align={
                          this.write_off_header[baseIndex + 3].indexOf('金额') > -1 ? 'right' : ''
                        }
                      >
                        {this.write_off_header[baseIndex + 3]}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="table-body">
                <table>
                  <colgroup>
                    {baseIndex === 0 ? <col style="width:152px" /> : ''}
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
                            align={
                              this.write_off_header[baseIndex + 2].indexOf('金额') > -1
                                ? 'right'
                                : ''
                            }
                          >
                            {item[baseIndex + 2]}
                          </td>
                          <td
                            align={
                              this.write_off_header[baseIndex + 3].indexOf('金额') > -1
                                ? 'right'
                                : ''
                            }
                          >
                            <div>
                              {item[baseIndex + 3]}
                              <span class="label">
                                {item.length > baseIndex + 4 ? '/ ' + item[baseIndex + 4] : ''}
                              </span>
                            </div>
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
    } else {
      if (this.btnTitle !== '') {
        nodes.push(
          <div class={this.is_reverse ? 'reverse-red' : ''} key="key1">
            <span>{this.btnTitle}</span>
          </div>,
        );
      } else if (this.write_off_status === 2) {
        nodes.push(
          <div class="status" key="key1">
            <span>已核销</span>
          </div>,
        );
      } else if (this.write_off_status === 1) {
        nodes.push(
          <div class="status" key="key2">
            <span class="yellow">部分核销</span>
          </div>,
        );
      } else if (this.write_off_status === 0) {
        nodes.push(
          <div class="status" key="key3">
            <span class="yellow">未核销</span>
          </div>,
        );
      }
    }

    return <div>{nodes}</div>;
  },
});
