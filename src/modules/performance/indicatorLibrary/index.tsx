import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import styles from './index.module.less';
import {
  Delete_Indicators,
  Delete_Indicators_Tag,
  Query_Indicator_Tag,
  Query_Indicators_Library,
} from '@/services/performance';
import { EINDICATOR_TYPE, INDICATOR_TYPE_MAP, INDICATOR_TYPE_OPTIONS } from '@/const/performance';
import { Select } from '@gm/component/select';
import { Confirm } from '@/use/asyncConfirm';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import moveTag from './dialog/moveTag';
import createTagDialog from './dialog/createTag';
import { useDialog, useDrawer } from '@/use/dialog';
import createIndicator from './create/index.vue';
import { usePermission } from '@/use/permission';
import { isEmpty } from '@/utils/func';
import uploadTemplate from './dialog/uploadTemplate/index.vue';
import { FD } from '@/utils/formatData';

export default defineComponent({
  setup: () => {
    // 权限部分
    const permission = usePermission();
    // 表格列配置
    const columns: TgTableColumn<NPerformance.Indicators>[] = [
      {
        type: 'selection',
        width: 40,
      },
      {
        align: 'left',
        label: '指标名称',
        minWidth: 150,
        prop: 'name',
        filterPlacement: 'right',
        // 'show-overflow-tooltip': true,
        formatter: row => {
          const content = FD.formatEmpty(row.name);
          // content = row.is_can_delete ? content : content + ' *该指标结算值由系统自动计算*';
          const style = 'display: flex; align-items: center;';
          // style = row.is_can_delete ? style : style + 'color: #FB8500;';
          // if (!row.is_can_delete) {
          //   // return FD.formatEmpty(row.name) + ' *该指标结算值由系统自动计算*';
          //   return (
          //     <div style="color: #FB8500" class="line-clamp-1">
          //       {FD.formatEmpty(row.name) + ' *该指标结算值由系统自动计算*'}
          //     </div>
          //   );
          // }
          const contentPopover = (
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              content={content}
              open-delay={300}
            >
              <span class="line-clamp-1" slot="reference">
                {content}
              </span>
            </el-popover>
          );
          const tipPopover = row.is_can_delete ? (
            ''
          ) : (
            <el-popover
              style="flex-shrink: 0; font-size: 16px; margin-left: 4px;"
              placement="top"
              width="200"
              trigger="hover"
              content="该指标结果值由系统自动计算"
              open-delay={300}
            >
              <tg-icon
                style="color: #FB8500 !important;"
                slot="reference"
                name="ico-common-tishi-linear"
              ></tg-icon>
            </el-popover>
          );
          return (
            <span style={style}>
              {contentPopover}
              {tipPopover}
            </span>
          );
        },
      },
      {
        label: '指标类型',
        minWidth: 80,
        align: 'center',
        prop: 'indicator_type',
        formatter: row => INDICATOR_TYPE_MAP.get(row.indicator_type),
      },
      {
        label: '指标定义',
        minWidth: 180,
        prop: 'remark',
        'show-overflow-tooltip': true,
      },
      {
        label: '考核标准',
        minWidth: 200,
        prop: 'check_standard',
        'show-overflow-tooltip': true,
      },
      {
        label: '权重',
        align: 'center',
        minWidth: 60,
        formatter: row => {
          switch (row.indicator_type) {
            case EINDICATOR_TYPE.DEDUCT:
            case EINDICATOR_TYPE.BONUS:
              return '--';
            case EINDICATOR_TYPE.QUALITATIVE:
            case EINDICATOR_TYPE.RATION:
              if (isEmpty(row.weight)) return '';
              return `${row.weight}%`;
          }
        },
      },
      {
        label: '扣分上限',
        align: 'center',
        minWidth: 80,
        prop: 'decrease_limit',
        formatter: row => {
          if (row.indicator_type !== EINDICATOR_TYPE.DEDUCT) return '--';
          return row.decrease_limit;
        },
      },
      {
        label: '加分上限',
        align: 'center',
        minWidth: 80,
        prop: 'increase_limit',
        formatter: row => {
          if (row.indicator_type !== EINDICATOR_TYPE.BONUS) return '--';
          return row.increase_limit;
        },
      },
      {
        label: '操作',
        minWidth: 88,
        formatter: row => {
          return (
            <div>
              {permission.indicators_library_edit && (
                <tg-button
                  type="link"
                  onClick={() => {
                    drawerCreate.update({ title: '编辑指标' }).show(row);
                  }}
                >
                  修改
                </tg-button>
              )}
              {permission.indicators_library_delete && row.is_can_delete === 1 && (
                <tg-button
                  type="link"
                  class="mgl-12"
                  onClick={() => {
                    Confirm('确认删除该指标').then(() => {
                      reqDelete.runAsync([row.id]).then(() => {
                        reqList.reload();
                        reqQueryTag.reload();
                      });
                    });
                  }}
                >
                  删除
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];
    // 表单数据
    const initFormData = () =>
      ({
        name: undefined,
        indicator_type: undefined,
        tag_id: undefined,
      } as any);
    const formData = ref<Partial<NPerformance.IndicatorsParams>>(initFormData());
    const configTemplate = ref({
      reset: () => (formData.value = initFormData()),
      table: {
        selectionChange: (value: NPerformance.Indicators[]) => {
          selected.value = value;
        },
      },
    });
    // 接口请求部分
    const reqDelete = useRequest(Delete_Indicators, { manual: true });
    const reqList = usePagination(Query_Indicators_Library);
    const reqQueryTag = useRequest(Query_Indicator_Tag);
    const reqDelTag = useRequest(Delete_Indicators_Tag, { manual: true });
    // 弹框部分
    const dialogMoveTag = useDialog({
      component: moveTag,
      title: '移动指标',
      width: '400px',
      on: {
        submit: () => {
          reqList.reload();
          reqQueryTag.reload();
        },
      },
    });
    const createTag = useDialog({
      component: createTagDialog,

      title: '创建标签',
      width: '300px',
      on: {
        submit: reqQueryTag.reload,
      },
    });
    const drawerCreate = useDrawer({
      component: createIndicator,
      width: '523px',
      title: '新增指标',
      on: {
        submit: () => {
          reqQueryTag.reload();
          reqList.reload();
        },
      },
    });
    const dialogUploadTemplate = useDialog({
      component: uploadTemplate,
      title: '批量导入',
      width: '300px',
      footer: false,
      on: {
        submit() {
          reqList.reload();
          reqQueryTag.reload();
        },
      },
    });
    // 其他引用
    const selected = ref<NPerformance.Indicators[]>([]);
    const tempListRef = ref();
    return {
      columns,
      formData,
      configTemplate,
      reqDelete,
      selected,
      tempListRef,
      reqList,
      reqQueryTag,
      dialogMoveTag,
      createTag,
      reqDelTag,
      drawerCreate,
      permission,
      dialogUploadTemplate,
    };
  },
  render() {
    const { formData, permission } = this;
    return (
      <ListGenerallyTemplate
        ref="tempListRef"
        v-model={this.formData}
        columns={this.columns}
        service={this.reqList}
        config={this.configTemplate}
      >
        <el-form-item label="指标名称：">
          <el-input v-model={formData.name} placeholder="指标名称" />
        </el-form-item>
        <el-form-item label="指标类型：">
          <Select
            popper-class="el-select-popper-mini"
            placeholder="请选择"
            v-model={formData.indicator_type}
            options={INDICATOR_TYPE_OPTIONS}
            clearable={true}
          />
        </el-form-item>
        <div slot="btnLine" class={styles.btnLines}>
          <div class={styles.tags}>
            <span>指标标签：</span>
            <span
              class={`mgl-18 tag-item ${formData.tag_id !== undefined ? '' : 'active'} `}
              onClick={() => {
                this.formData.tag_id = undefined;
                this.reqList.pagination.reQuery(this.formData);
              }}
            >
              全部
            </span>
            {this.reqQueryTag.data?.map(it => {
              return (
                <div
                  class={`mgl-18 tag-item ${it.tag_id === formData.tag_id ? 'active' : ''} `}
                  onClick={() => {
                    this.formData.tag_id = it.tag_id;
                    this.reqList.pagination.reQuery(this.formData);
                  }}
                >
                  <span class="tag-item-title">
                    {it.name}({it.count})
                  </span>
                  {it.tag_id !== 0 &&
                    (permission.indicators_library_tag_edit ||
                      permission.indicators_library_tag_delete) && (
                      <el-popover trigger="hover" open-delay={100} popper-class={styles.popover}>
                        <i slot="reference" class="el-icon-more" />
                        {permission.indicators_library_tag_edit && (
                          <div
                            class="item"
                            onclick={() => {
                              this.createTag.update({ title: '编辑标签' }).show(it);
                            }}
                          >
                            编辑
                          </div>
                        )}

                        {permission.indicators_library_tag_delete && (
                          <div
                            class="item"
                            onclick={async () => {
                              await Confirm('确定删除该标签吗?');
                              await this.reqDelTag.runAsync(it.tag_id);
                              Message.success('删除成功');
                              this.reqQueryTag.reload();
                            }}
                          >
                            删除
                          </div>
                        )}
                      </el-popover>
                    )}
                </div>
              );
            })}
            {permission.indicators_library_tag_edit && (
              <span
                class="mgl-12 tag-item add"
                onclick={() => {
                  this.createTag.update({ title: '新增标签' }).show();
                }}
              >
                +新增标签
              </span>
            )}
          </div>
          <div class={styles.btns}>
            {permission.indicators_library_edit && (
              <tg-button
                type="primary"
                onClick={() => {
                  this.drawerCreate.update({ title: '新增指标' }).show();
                }}
              >
                新增指标
              </tg-button>
            )}
            {permission.indicators_library_edit && (
              <tg-button onClick={() => this.dialogUploadTemplate.show()}>批量导入</tg-button>
            )}

            {permission.indicators_library_move && (
              <tg-button
                class={this.selected.length === 0 ? 'normal' : ''}
                disabled={this.selected.length === 0}
                onClick={() => this.dialogMoveTag.show(this.selected)}
              >
                移动到
              </tg-button>
            )}
            {permission.indicators_library_delete && (
              <tg-button
                class={this.selected.length === 0 ? 'normal' : ''}
                disabled={this.selected.length === 0}
                onClick={() => {
                  Confirm('确定删除指标吗?').then(() => {
                    this.reqDelete
                      .runAsync(this.selected.map(it => it.id))
                      .then(() => {
                        Message.success('删除成功');
                      })
                      .then(() => {
                        this.reqList.reload();
                        this.reqQueryTag.reload();
                      });
                  });
                }}
              >
                删除
              </tg-button>
            )}
          </div>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
