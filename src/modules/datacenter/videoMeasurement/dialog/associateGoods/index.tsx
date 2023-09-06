import { QueryCTRProjects, Save_Video_Item_Relation } from '@/services/datacenter';
import { GetModelListNew } from '@/services/supplier';
import { VideoRecordItem } from '@/types/tiange/datacenter';
import { useRefTabs } from '@/use/tab';
import { deepClone } from '@/utils/tools';
import { useRequest } from '@gm/hooks/ahooks';
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import moment from 'moment';

type TabType = 'model' | 'goods';
type TempFormData = TG.ParameterFirst<typeof Save_Video_Item_Relation> & {
  model_list: { id: number | undefined }[];
};
type FormData = Omit<TempFormData, 'model_ids'>;

export default defineComponent({
  setup(props, ctx) {
    const initGoodsItem = () => {
      return {
        project_id: undefined,
        sn: undefined,
      };
    };
    const initModelItem = () => {
      return {
        id: undefined,
      };
    };
    const initFormData = (): FormData => {
      return {
        video_id: undefined,
        shooting_date: undefined,
        model_list: [initModelItem()],
        relation_list: [initGoodsItem()],
      };
    };
    const reqProjectList = useRequest(QueryCTRProjects, { manual: true });
    const reqSave = useRequest(Save_Video_Item_Relation, { manual: true });
    const reqModelList = useRequest(GetModelListNew, { manual: true });
    // const isEdit = ref(false);
    const show = (data?: VideoRecordItem) => {
      formData.value.video_id = data?.video_id;
      formData.value.shooting_date = data?.shooting_date;
      // isEdit.value = data?.item_list?.length ? true : false;
      if (data?.item_list?.length) {
        formData.value.relation_list = deepClone(data.item_list) as any[];
      }
      if (!data?.model_list?.length) return;
      formData.value.model_list = deepClone(data.model_list) as any[];
    };
    const formData = ref<FormData>(initFormData());
    const addGodosItem = () => {
      formData.value.relation_list?.push(initGoodsItem());
    };
    const addModal = () => {
      formData.value.model_list?.push(initModelItem());
    };
    const onSaveBtnClick = async () => {
      if (!formData.value.video_id) return;
      const { model_list, relation_list, ...rest } = formData.value;
      const res = await reqSave.runAsync({
        model_ids: model_list.filter(el => el.id !== undefined).map(el => el.id),
        relation_list: relation_list?.filter(el => el.project_id && el.sn) || [],
        ...rest,
      });
      if (res.data.success) {
        ctx.emit('close');
        ctx.emit('submit');
        Message.success('保存成功');
      }
    };

    const tabs = useRefTabs<TabType>(
      [
        {
          label: '拍摄',
          value: 'model',
        },
        {
          label: '商品',
          value: 'goods',
        },
      ],
      'model',
    );

    const pickerOptions = {
      disabledDate(date: Date) {
        const currentMoment = moment();
        const dateMoment = moment(date);
        return dateMoment.isAfter(currentMoment);
      },
    };

    onMounted(() => {
      reqProjectList.runAsync();
      reqModelList.runAsync({
        num: 1000,
        page_num: 1,
      });
    });
    return {
      tabs,
      onSaveBtnClick,
      show,
      formData,
      addGodosItem,
      reqProjectList,
      reqModelList,
      reqSave,
      addModal,
      pickerOptions,
    };
  },
  render() {
    // const { formData } = this;
    return (
      <div class="tg-associateGoods-container">
        <tg-tabs
          height={40}
          tabs={this.tabs.tabs.value}
          v-model={this.tabs.checkedTab.value}
          // on-change={this.onGoodsTabChange}
        ></tg-tabs>
        {this.tabs.checkedTab.value === 'model' ? (
          <div class="madol-field">
            <div class="time">
              <span>拍摄时间：</span>
              <el-date-picker
                editable={false}
                clearable={true}
                size="mini"
                style="width: 296px"
                v-model={this.formData.shooting_date}
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                // on-focus={() => (this.pickDate = undefined)}
                picker-options={this.pickerOptions}
              ></el-date-picker>
            </div>
            <div class="modal-title">关联模特</div>
            <div class="modal-list">
              <div class="list">
                {(this.formData.model_list || []).map((model, modelIdx) => (
                  <div class="item" key={modelIdx}>
                    <el-select
                      filterable
                      size="mini"
                      v-model={model.id}
                      placeholder="请选择模特"
                      style="width: 100%"
                    >
                      {(this.reqModelList.data?.data || []).map((el: any) => {
                        const finder = this.formData.model_list
                          .filter((subEl: any) => subEl.id !== model.id)
                          .find((subEl: any) => subEl.id === el.id);
                        return (
                          <el-option
                            label={`${el.flower_name} (${el.real_name})`}
                            value={el.id}
                            key={el.id}
                            disabled={finder ? true : false}
                          ></el-option>
                        );
                      })}
                    </el-select>
                    <tg-icon
                      name="ico-delete"
                      on-click={() => {
                        this.formData.model_list?.splice(modelIdx, 1);
                      }}
                    ></tg-icon>
                  </div>
                ))}
                <tg-button
                  icon="ico-btn-add"
                  class="mgt-16"
                  type="primary"
                  on-click={this.addModal}
                >
                  新增模特
                </tg-button>
              </div>
            </div>
          </div>
        ) : (
          <div class="goods-field">
            <div class="tips">
              <tg-icon name="ico-warn"></tg-icon>
              <div style="margin-left: 4px">
                请填写与短视频关联的商品款号，款号需要和小店商品信息中心保持一致
              </div>
            </div>
            <div class="list">
              {this.formData.relation_list?.map((el, idx) => (
                <div class="item" key={el}>
                  <el-select
                    filterable
                    size="mini"
                    v-model={el.project_id}
                    placeholder="请选择项目"
                  >
                    {(this.reqProjectList.data || []).map((el: any) => (
                      <el-option
                        label={el.project_name}
                        value={el.project_id}
                        key={el.project_id}
                      ></el-option>
                    ))}
                  </el-select>
                  <el-input size="mini" vModel_trim={el.sn} placeholder="请填写款号"></el-input>
                  {/* {this.formData.length > 1 && ( */}
                  <tg-icon
                    name="ico-delete"
                    on-click={() => {
                      // if (this.formData.length === 1) {
                      //   return;
                      // }
                      this.formData.relation_list?.splice(idx, 1);
                    }}
                  ></tg-icon>
                  {/* )} */}
                </div>
              ))}
              <tg-button
                icon="ico-btn-add"
                class="mgt-16"
                type="primary"
                on-click={this.addGodosItem}
              >
                新增商品
              </tg-button>
            </div>
          </div>
        )}
        <tg-mask-loading visible={this.reqSave.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
