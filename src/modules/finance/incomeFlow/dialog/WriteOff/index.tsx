import { defineComponent, PropType } from '@vue/composition-api';
import { usePageJump } from '@/utils/pageJump';

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
    btnTitle: {
      type: String,
      default: '',
    },
    projects: {
      type: Array as PropType<{ business_type: number; project_id: number }[]>,
      default: () => [],
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
          <el-popover
            placement="top-end"
            trigger="hover"
            hide-after={300}
            popper-class="achievement-popover"
          >
            <div slot="reference">
              <div key="key1" class="key1">
                {this.btnTitle}
              </div>
            </div>
            <div
              style={baseIndex === 0 ? 'width: 594px' : 'width: 434px'}
              class="writeoff-popover-content"
            >
              <div class="table-header">
                <table>
                  <colgroup>
                    {baseIndex === 0 ? <col style="width:152px" /> : ''}
                    <col />
                    <col style="width:128px" />
                    <col style="width:148px" />
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
                    <col style="width:148px" />
                  </colgroup>
                  <tbody>
                    {this.write_off_infos?.map((item, item_index) => {
                      return (
                        <tr>
                          {baseIndex === 0 ? (
                            <td
                              class={
                                this.projects && this.projects[item_index] ? 'project-div' : ''
                              }
                              on-click={() => {
                                if (this.projects && this.projects[item_index]) {
                                  const { jumpProjectDetail } = usePageJump();
                                  const parent_tab =
                                    this.projects[item_index].business_type === 1
                                      ? 'settlement_income'
                                      : 'income';
                                  jumpProjectDetail(this.projects[item_index].business_type, {
                                    project_id: this.projects[item_index].project_id,
                                    tab: parent_tab,
                                    liveType: 'calendar',
                                    newWindow: true,
                                  });
                                }
                              }}
                            >
                              {item[baseIndex]}
                            </td>
                          ) : (
                            ''
                          )}
                          <td>{item[baseIndex + 1]}</td>
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
      nodes.push(
        <div class={this.is_reverse ? 'reverse-red' : ''} key="key1">
          <span>{this.btnTitle}</span>
        </div>,
      );
    }

    return <div>{nodes}</div>;
  },
});
