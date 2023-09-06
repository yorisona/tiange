import { ref, defineComponent, h } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { useRequest } from '@gm/hooks/ahooks';
import { QueryallowScrapped } from '@/services/fixedAssets';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({});
    const show = (val: any) => {
      formData.value = val;
      console.log(formData.value, 'formData.value');
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = async () => {
      const validate = formData.value.receive_relation_list.some((i: any) => {
        return i.receive_status === E.fixedassets.ReceiveStatusEnum.not_receive;
      });
      if (validate) {
        ctx.root.$message.warning('请处理领用状态');
        return;
      }
      const params = formData.value.receive_relation_list.map(
        ({ relation_id, receive_status, id }: any) => ({
          relation_id,
          receive_status,
          asset_id: id,
        }),
      );
      ctx.emit('submit', {
        id: formData.value.id,
        asset_relation_list: params,
      });
    };
    const QueryFixedAssetListReq = useRequest(QueryallowScrapped);
    const aseet_option = ref<any[]>([]);
    const aseet_NameOption = ref<any[]>([]);
    return {
      formData,
      show,
      onSaveBtnClick,
      close,
      QueryFixedAssetListReq,
      aseet_option,
      aseet_NameOption,
    };
  },
  render() {
    const { formData } = this;
    const columns: any = [
      {
        label: '资产编号',
        prop: 'asset_code',
        align: 'left',
        'show-overflow-tooltip': true,
        minWidth: 120,
        formatter: (row: any) => {
          return (
            <Select
              size="mini"
              filterable={true}
              remote={true}
              v-model={row.asset_code}
              disabled={row.receive_status !== E.fixedassets.ReceiveStatusEnum.not_receive}
              placeholder="请输入资产编号"
              clearable={false}
              remote-method={(val: string) => {
                this.QueryFixedAssetListReq.runAsync({} as any, {
                  asset_code: val,
                }).then(res => {
                  const option = res.data.data.data
                    .map((item: any) => {
                      return { ...item, label: item.asset_code, value: item.id };
                    })
                    .filter((item: any) => {
                      return row.asset_id !== item.id;
                    });
                  // this.$set(row, 'option', option);
                  this.aseet_option = option;
                });
              }}
              onChange={(val: any) => {
                const asset = this.aseet_option.find((item: any) => item.id === val);
                if (asset) {
                  row.id = asset.id;
                  row.asset_id = asset.id;
                  row.asset_code = asset.asset_code;
                  row.asset_name = asset.asset_name;
                  row.asset_class_name = asset.asset_class_name;
                  row.asset_model = asset.asset_model;
                  row.asset_type_name = asset.asset_type_name;
                }
              }}
              options={this.aseet_option || []}
            />
          );
        },
      },
      {
        label: '名称',
        prop: 'asset_name',
        align: 'center',
        'show-overflow-tooltip': true,
        formatter: (row: any) => {
          return (
            <Select
              disabled={row.receive_status !== E.fixedassets.ReceiveStatusEnum.not_receive}
              size="mini"
              filterable={true}
              remote={true}
              v-model={row.asset_name}
              placeholder="请输入资产编号"
              clearable={false}
              remote-method={(val: string) => {
                this.QueryFixedAssetListReq.runAsync({} as any, {
                  asset_name: val,
                }).then(res => {
                  const option = res.data.data.data
                    .map((item: any) => {
                      return {
                        ...item,
                        label: `资产编号：${item.asset_code} 名称：${item.asset_name} 分类：${item.asset_class_name}`,
                        value: item.id,
                      };
                    })
                    .filter((item: any) => {
                      return row.asset_id !== item.id;
                    });
                  // this.$set(row, 'option', option);
                  this.aseet_NameOption = option;
                });
              }}
              onChange={(val: any) => {
                const asset = this.aseet_NameOption.find((item: any) => item.id === val);
                if (asset) {
                  row.id = asset.id;
                  row.asset_id = asset.id;
                  row.asset_code = asset.asset_code;
                  row.asset_name = asset.asset_name;
                  row.asset_class_name = asset.asset_class_name;
                  row.asset_model = asset.asset_model;
                  row.asset_type_name = asset.asset_type_name;
                }
              }}
              options={this.aseet_NameOption || []}
            />
          );
        },
      },
      {
        label: '分类',
        prop: 'asset_class_name',
        align: 'center',
        'show-overflow-tooltip': true,
      },
      {
        label: '规格型号',
        prop: 'asset_model',
        align: 'center',
        'show-overflow-tooltip': true,
      },
      {
        label: '资产类型',
        prop: 'asset_type_name',
        align: 'center',
        'show-overflow-tooltip': true,
      },
      {
        label: '领用状态',
        align: 'center',
        prop: 'receive_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.ReceiveStatusEnumMap,
        },
      },
    ];
    if (formData.receive_status === E.fixedassets.ReceiveStatusEnum.not_receive) {
      columns.push({
        label: '操作',
        align: 'center',
        formatter: (row: any) => {
          if (row.receive_status === E.fixedassets.ReceiveStatusEnum.not_receive) {
            return (
              <div>
                <tg-button
                  type="link"
                  onClick={() => {
                    row.receive_status = E.fixedassets.ReceiveStatusEnum.receive;
                  }}
                >
                  发放
                </tg-button>
                <tg-button
                  type="link"
                  class="mgl-6"
                  onClick={() => {
                    row.receive_status = E.fixedassets.ReceiveStatusEnum.rejected;
                  }}
                >
                  拒绝
                </tg-button>
              </div>
            );
          } else {
            return (
              <tg-button
                type="link"
                class="mgl-6"
                onClick={() => {
                  row.receive_status = E.fixedassets.ReceiveStatusEnum.not_receive;
                }}
              >
                取消
              </tg-button>
            );
          }
        },
      });
    }
    return (
      <el-form class="from-wrap" model={formData}>
        <el-form-item label="申请人：">
          <span style="color:var(--text-color)">{formData.add_by_name}</span>
        </el-form-item>
        <el-form-item>
          <div class="mgb-6">领用明细：</div>
          <tg-table max-height="252" border data={formData.receive_relation_list} columns={columns}>
            <template slot="empty">
              {/* <span>暂无数据</span> */}
              <fragments></fragments>
            </template>
          </tg-table>
        </el-form-item>
        <el-form-item label="费用承担：">
          <span>{`${formData.department_name ? formData.department_name : ''}${
            formData.project_name ? '项目：' + formData.project_name : ''
          }`}</span>
        </el-form-item>
        <el-form-item label="附件：">
          <div class="file-box">
            {formData.file_urls?.length > 0
              ? formData.file_urls.map((i: any) => (
                  <file-item
                    limitNameWidth={80}
                    // showPreview={false}
                    filepath={i}
                    readonly={true}
                  />
                ))
              : '--'}
          </div>
        </el-form-item>
        <el-form-item label="申请原因：">
          <span>{formData.remark ?? '--'}</span>
        </el-form-item>
      </el-form>
    );
  },
});
