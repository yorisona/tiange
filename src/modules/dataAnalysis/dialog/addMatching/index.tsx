import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ElFormRef } from '@/utils/form';
import { useRequest } from '@gm/hooks/ahooks';
import { Loading, Message } from 'element-ui';
import { GetQueryDouyinReportProjects, Save_Goods_Collocation } from '@/services/datacenter';
// import { FunctionSelect } from '@gm/component/select';
// import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { deepClone } from '@/utils/tools';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';
import InputLimit from '@/utils/inputLimit';
type FormData = TG.ParameterFirst<typeof Save_Goods_Collocation>;

export default defineComponent({
  name: 'newTypeDialog',
  props: {
    // data: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   },
    // },
    // edit: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
  },
  components: {
    EditTable,
    EditTableColumn,
  },
  setup(props, ctx) {
    const EditTable = ref<ExportData>(null as any);
    const formRef = ref<ElFormRef>();
    const formData = ref<FormData>({
      attachments: [],
      project_id: undefined,
      quantity: undefined,
      topic: undefined,
      id: undefined,
      type: 1,
      collocation_detail_list: [{}],
      collocation_detail_file: [],
    });

    const reqSave = useRequest(Save_Goods_Collocation, { manual: true });
    const reqProject = useRequest(GetQueryDouyinReportProjects, { manual: true });
    const onSaveBtnClick = async () => {
      if (!formRef.value) return;
      let loading: any;
      formRef.value
        .validate()
        .then(() => {
          // const { train_time, train_date, ...other } = formData.value;
          if (formData.value.type === 2) {
            formData.value.collocation_detail_list = EditTable.value.resultData;
            formData.value.collocation_detail_file = [];
          }
          const params = {
            ...formData.value,
            collocation_detail_file: formData.value.collocation_detail_file?.[0],
            collocation_detail_list:
              formData.value.type === 1
                ? []
                : JSON.stringify(formData.value.collocation_detail_list) === '[{}]'
                ? []
                : formData.value.collocation_detail_list,
          };

          // params.train_start_time = moment(`${train_date} ${train_time[0]}`).format(formatStr);
          // params.train_end_time = moment(`${train_date} ${train_time[1]}`).format(formatStr);

          return params;
        })
        .then(params => {
          loading = Loading.service({});
          return reqSave.runAsync(params);
        })
        .then(() => {
          Message.success('操作成功');
          ctx.emit('submit');
          ctx.emit('close');
        })
        .finally(() => {
          loading?.close();
        });
    };

    const show = (value: FormData) => {
      if (value) {
        // const fdata = JSON.parse(JSON.stringify(value));
        // fdata.train_date = moment(fdata.train_start_time).format('YYYY-MM-DD');
        // fdata.train_time = [
        //   moment(`${fdata.train_start_time}`).format('HH:mm'),
        //   moment(`${fdata.train_end_time}`).format('HH:mm'),
        // ];
        // if (fdata.trainer_info) {
        //   fdata.trainer_id = fdata.trainer_info.map((it: any) => it.id);
        //   fdata.trainer_info = fdata.trainer_info.map((it: any) => ({
        //     label: it.username,
        //     value: it.id,
        //   }));
        // }
        formData.value = deepClone({
          ...formData.value,
          ...value,
          collocation_detail_list: value.collocation_detail_list?.length
            ? value.collocation_detail_list
            : [{}],
        }) as any;
        if (JSON.stringify(formData.value.collocation_detail_list) !== '[{}]')
          formData.value.type = 2;
        console.log(
          formData.value,
          JSON.stringify(formData.value.collocation_detail_list),
          'formData.value',
        );
      }
    };

    onMounted(() => {
      reqProject.runAsync();
    });
    return { formData, onSaveBtnClick, formRef, show, reqProject, EditTable };
  },
  render() {
    const { formData } = this;
    return (
      <div class="company-container">
        <el-form
          ref="formRef"
          label-width="70px"
          size="mini"
          attrs={{
            model: formData,
          }}
        >
          <el-form-item label="盘点范围：">
            <el-radio v-model={formData.type} label={1}>
              导入搭配信息
            </el-radio>
            <el-radio v-model={formData.type} label={2}>
              录入搭配信息
            </el-radio>
          </el-form-item>
          <el-form-item
            label="搭配主题："
            prop="topic"
            rules={{ required: true, trigger: 'blur', message: '请输入搭配主题' }}
          >
            <el-input maxLength={30} placeholder="请输入搭配主题" v-model={formData.topic} />
          </el-form-item>
          <el-form-item
            label="所属项目："
            prop="project_id"
            rules={{ required: true, trigger: 'change', message: '选择输入并选择所属项目' }}
          >
            <el-select
              style="width: 100%"
              clearable
              filterable
              placeholder="请输入并选择所属项目"
              v-model={formData.project_id}
            >
              {this.reqProject.data?.projects.map((el: any) => (
                <el-option
                  label={el.project_name}
                  value={el.project_id}
                  key={el.project_id}
                ></el-option>
              ))}
            </el-select>
            {/* <FunctionSelect
              style="width:100%"
              modeType={EFunctionSelectType.FLOWER_NAME}
              v-model={formData.project_id}
              multiple
              placeholder="选择输入并选择所属项目"
              clearable={true}
              defaultValue={formData.project_id}
            /> */}
          </el-form-item>
          <el-form-item
            label="搭配数量："
            prop="quantity"
            rules={{ required: true, trigger: 'blur', message: '请输入搭配数量' }}
          >
            <el-input
              placeholder="请输入搭配数量"
              v-model={formData.quantity}
              on-input={(value: string) => {
                formData.quantity = InputLimit.Interger(value);
              }}
            />
          </el-form-item>
          <el-form-item
            label="上传附件："
            prop="attachments"
            rules={{ required: true, trigger: 'change', message: '请上传附件' }}
          >
            <div class="upload-box">
              <tg-upload
                class="col-span-full"
                multiple={true}
                action="/api/resources/upload_file"
                data={{ type: 'visual_design', storage: 2 }}
                show-file-list={false}
                beforeUpload={ValidationFileUpload({
                  fileSize: 100,
                })}
                success={(res: any) => {
                  if (!res.success) {
                    Message.error(res.message);
                    return;
                  }
                  formData.attachments?.push(res.data.source);
                  this.formRef?.validateField('attachments');
                }}
              >
                <tg-button icon="ico-upload-lite" v-model={formData.attachments}>
                  上传附件
                </tg-button>
                <span class="tips">支持ppt,pdf,xlsx,xls,doc.,docx等格式上传</span>
              </tg-upload>
              <upload-file-list v-model={formData.attachments} />
            </div>
          </el-form-item>
          {formData.type === 1 ? (
            <el-form-item
              label="上传明细："
              // prop="collocation_detail_file"
              // rules={{ required: true, trigger: 'change', message: '请上传明细' }}
            >
              <div class="upload-box">
                <tg-upload
                  class="col-span-full"
                  multiple={true}
                  action="/api/resources/upload_file"
                  data={{ type: 'collocation_detail', storage: 1 }}
                  show-file-list={false}
                  beforeUpload={ValidationFileUpload({
                    fileSize: 100,
                    excel: true,
                  })}
                  limit={1}
                  v-model={formData.collocation_detail_file}
                  success={(res: any) => {
                    if (!res.success) {
                      Message.error(res.message);
                      return;
                    }
                    formData.collocation_detail_file?.push(res.data.source);

                    this.formRef?.validateField('collocation_detail_file');
                  }}
                >
                  <tg-button
                    disabled={formData.collocation_detail_file?.length === 1 ? true : false}
                    icon="ico-upload-lite"
                    v-model={formData.collocation_detail_file}
                  >
                    上传明细
                  </tg-button>
                  <a
                    class="download mgl-8"
                    // target="_blank"
                    href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/goods_collocation_detail_template.xlsx"
                    download
                    onClick={(event: any) => {
                      event.stopPropagation();
                    }}
                  >
                    下载模板
                  </a>
                  <span class="tips">支持xlsx,xls等格式上传</span>
                </tg-upload>
                <upload-file-list v-model={formData.collocation_detail_file} />
              </div>
            </el-form-item>
          ) : (
            <el-form-item
              label="搭配明细："
              class="lineFeed"
              // prop="collocation_detail_list"
              // rules={{ required: true, trigger: 'change', message: '请填写明细' }}
            >
              <EditTable
                border
                max-height="252"
                ref="EditTable"
                class="edit-table"
                data-source={formData.collocation_detail_list}
                isAutonomy
              >
                <edit-table-column
                  align="left"
                  prop="sn_1"
                  label="款号一"
                  hasFormItem
                  formItemProps={{
                    'show-message': false,
                  }}
                  // rules={[{ required: true, trigger: 'change' }]}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      return (
                        <el-input
                          size="mini"
                          v-model={row.sn_1}
                          v-auto-placeholder
                          clearable={false}
                        />
                      );
                    },
                  }}
                />
                <edit-table-column
                  prop="sn_2"
                  label="款号二"
                  hasFormItem
                  formItemProps={{
                    'show-message': false,
                  }}
                  scopedSlots={{
                    default: ({ row, $index }: any) => {
                      return (
                        <el-input
                          size="mini"
                          v-model={row.sn_2}
                          v-auto-placeholder
                          clearable={false}
                        />
                      );
                    },
                  }}
                />
                <edit-table-column
                  prop="sn_3"
                  label="款号三"
                  hasFormItem
                  formItemProps={{
                    'show-message': false,
                  }}
                  scopedSlots={{
                    default: ({ row, $index }: any) => {
                      return (
                        <el-input
                          size="mini"
                          v-model={row.sn_3}
                          v-auto-placeholder
                          clearable={false}
                        />
                      );
                    },
                  }}
                />
                <edit-table-column
                  prop="sn_4"
                  label="款号四"
                  hasFormItem
                  formItemProps={{
                    'show-message': false,
                  }}
                  scopedSlots={{
                    default: ({ row, $index }: any) => {
                      return (
                        <el-input
                          size="mini"
                          v-model={row.sn_4}
                          v-auto-placeholder
                          clearable={false}
                        />
                      );
                    },
                  }}
                />
                <edit-table-column
                  label="操作"
                  align="center"
                  width="48"
                  scopedSlots={{
                    default: ({ actions, $index }: any) => {
                      return (
                        <tg-icon
                          class="ico-btn"
                          name="ico-btn-delete"
                          disabled={this.EditTable.resultData.length === 1}
                          onClick={() => {
                            if (this.EditTable.resultData.length === 1) return;
                            actions.deleteRow($index);
                          }}
                        />
                      );
                    },
                  }}
                ></edit-table-column>
                <div slot="addBtn">
                  <el-button
                    onClick={() => {
                      this.EditTable.editActions.addRow(
                        {},
                        {
                          isToBottom: true,
                          isEditing: false,
                        },
                      );
                    }}
                    incn="add"
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    class="add-btn"
                  >
                    新增
                  </el-button>
                </div>
              </EditTable>
            </el-form-item>
          )}
        </el-form>
      </div>
    );
  },
});
