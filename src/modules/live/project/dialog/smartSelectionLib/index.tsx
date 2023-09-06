import { defineComponent, onMounted, ref } from '@vue/composition-api';
import InputLimit from '@/utils/inputLimit';
import { useRequest } from '@gm/hooks/ahooks';
import selectionGoodsPreview from '@/modules/live/project/dialog/selectionGoodsPreview/index.vue';
import { useDialog } from '@/use/dialog';
import { preview_smart_select_product, query_project_live_room_info } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import { Message } from 'element-ui';
import { FD } from '@/utils/formatData';
import moment from 'moment';
type PreviewParams = TG.ParameterFirst<typeof preview_smart_select_product> & {
  add_type?: E.project.SmartSelectionLibAddWay;
};
export default defineComponent({
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const initItem = () => ({
      custom_select_type: undefined,
      custom_select_num: undefined,
    });
    const reqDisplay = useRequest(query_project_live_room_info, { manual: true });
    const reqSave = useRequest(preview_smart_select_product, { manual: true });
    const formData = ref<PreviewParams>({
      project_id,
      add_type: undefined,
      select_type: undefined,
      shop_live_id: undefined,
      smart_select_num: undefined,
      custom_select_data: [initItem()],
    });
    const dialogSelectionPreview = useDialog({
      component: selectionGoodsPreview,
      title: '智能商品库',
      width: 598,
      cancelText: '上一步',
      okText: '确定添加',
      on: {
        submit() {
          ctx.emit('close');
          ctx.emit('submit');
        },
        close() {
          ctx.emit('close');
        },
      },
    });
    const methods = {
      show() {},
      async onSaveBtnClick() {
        const {
          add_type,
          shop_live_id,
          smart_select_num,
          custom_select_data,
          select_type,
          ...rest
        } = formData.value;
        if (add_type === undefined || add_type === null) {
          Message.error('请选择添加方式');
          return;
        }
        if (select_type === undefined || select_type === null) {
          Message.error('请选择选品方式');
          return;
        }
        if (
          E.project.LiveToolGoodsSelectType.SmartSelection === select_type &&
          +(smart_select_num || 0) < 30
        ) {
          Message.warning('智能选品时，选品数量不能少于30');
          return;
        }
        const res = await reqSave.runAsync({
          select_type,
          shop_live_id:
            select_type === E.project.LiveToolGoodsSelectType.HistoryDisplay
              ? shop_live_id
              : undefined,
          smart_select_num:
            select_type === E.project.LiveToolGoodsSelectType.SmartSelection
              ? smart_select_num
              : undefined,
          custom_select_data:
            select_type === E.project.LiveToolGoodsSelectType.CustomSelection
              ? custom_select_data?.filter(
                  el => el.custom_select_type !== undefined || +el.custom_select_num > 0,
                )
              : undefined,
          ...rest,
        });
        if (res.data.success) {
          const previewList = res.data.data?.data || [];
          if (!previewList.length) {
            Message.error('未匹配到商品，请修改后重试');
            return;
          } else {
            dialogSelectionPreview.show({
              add_type,
              project_id,
              datas: previewList,
            });
          }
        }
      },
      onAddHandler() {
        formData.value.custom_select_data?.push(initItem());
      },
      onDeleteHandler(index: number) {
        formData.value.custom_select_data?.splice(index, 1);
      },
      selectionCondationDisabled(
        selectValue: E.project.SelectionCondition | undefined,
        optionValue: E.project.SelectionCondition,
      ) {
        const typeList = formData.value.custom_select_data?.map(el => el.custom_select_type) || [];
        const index = typeList.indexOf(optionValue);
        return !FD.isEmpty(selectValue)
          ? selectValue === optionValue
            ? false
            : index !== -1
          : index !== -1;
      },
    };
    onMounted(() => {
      const formatStr = 'yyyy-MM-DD';
      reqDisplay.runAsync({
        project_id,
        start_date: moment().subtract(7, 'days').format(formatStr),
        end_date: moment().subtract(1, 'days').format(formatStr),
      });
    });
    return { formData, reqDisplay, reqSave, ...methods };
  },
  render() {
    const { formData } = this;
    return (
      <div class="tg-smart-selection-lib-page-container">
        <el-form props={{ model: formData }} label-width="0" size="mini">
          <div class="header">添加方式</div>
          <el-radio-group class="add-way-radio-group" v-model={formData.add_type}>
            {E.project.SmartSelectionLibAddWayOption.map(el => (
              <el-radio key={el.value} label={el.value}>
                {el.label}
              </el-radio>
            ))}
          </el-radio-group>
          <div class="header selection-goods">选品</div>
          <el-form-item class="mgt-12 mgb-18">
            <el-radio
              v-model={formData.select_type}
              label={E.project.LiveToolGoodsSelectType.HistoryDisplay}
            >
              使用历史直播商品
            </el-radio>
            <el-select
              v-model={formData.shop_live_id}
              placeholder="选择场次"
              loading={this.reqDisplay.loading}
              style="width: 240px; margin-left: 12px"
              onChange={() => {
                formData.select_type = E.project.LiveToolGoodsSelectType.HistoryDisplay;
              }}
            >
              {this.reqDisplay.data?.map((el: any) => (
                <el-option
                  label={`${el.start_time}-${el.end_time}`}
                  value={el.shop_live_id}
                  key={el.shop_live_id}
                ></el-option>
              ))}
            </el-select>
          </el-form-item>
          <el-radio
            v-model={formData.select_type}
            label={E.project.LiveToolGoodsSelectType.SmartSelection}
          >
            智能选品
          </el-radio>
          <el-form-item label="选品数量：" label-width="62px" class="mgt-12 mgl-18 mgb-18">
            <el-input
              v-model={formData.smart_select_num}
              maxlength={10}
              placeholder="请输入选品数量"
              style="width: 180px"
              on-input={(value: string) => {
                formData.smart_select_num = InputLimit.Interger(value);
                formData.select_type = E.project.LiveToolGoodsSelectType.SmartSelection;
              }}
            />
            <span style="margin-left: 8px; color: #C1C1C1;">单次生成商品不能少于30款</span>
          </el-form-item>
          <el-radio
            v-model={formData.select_type}
            label={E.project.LiveToolGoodsSelectType.CustomSelection}
          >
            自定义选品
          </el-radio>
          <el-form-item>
            <div class="custion-selection-list mgt-12 mgl-18">
              {formData.custom_select_data?.map((item: any, index: number) => {
                return (
                  <div class="custom-selection-item" key={index}>
                    <el-select
                      clearable
                      v-model={item.custom_select_type}
                      placeholder="请选择选品条件"
                      style="width: 240px"
                      onChange={() => {
                        formData.select_type = E.project.LiveToolGoodsSelectType.CustomSelection;
                      }}
                    >
                      {E.project.SelectionConditionOption.map(el => (
                        <el-option
                          disabled={this.selectionCondationDisabled(
                            item.custom_select_type,
                            el.value,
                          )}
                          label={el.label}
                          value={el.value}
                          key={el.value}
                        ></el-option>
                      ))}
                    </el-select>
                    <div style="display: flex; align-items: center;">
                      <span style="flex-shrink: 0">选品数量：</span>
                      <el-input
                        v-model={item.custom_select_num}
                        placeholder="请输入选品数量"
                        maxlength={10}
                        style="width: 204px"
                        on-input={(value: string) => {
                          item.custom_select_num = InputLimit.Interger(value);
                          formData.select_type = E.project.LiveToolGoodsSelectType.CustomSelection;
                        }}
                      ></el-input>
                    </div>
                    <tg-icon
                      disabled={(formData.custom_select_data?.length || 0) === 1}
                      name="ico-common-shanchu-linear"
                      onClick={() => this.onDeleteHandler(index)}
                    ></tg-icon>
                  </div>
                );
              })}
            </div>
            {(formData.custom_select_data?.length || 0) < 6 && (
              <tg-button
                icon="ico-btn-add"
                type="primary"
                onClick={this.onAddHandler}
                class="mgl-18"
              >
                添加选品
              </tg-button>
            )}
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.reqSave.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
