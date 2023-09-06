/*
 * @Author: 肖槿
 * @Date: 2021-07-22 18:29:09
 * @Description: kol基础信息
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-30 17:24:20
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\newGenerateKol\components\base\base.tsx
 */
import { defineComponent, ref, watch, inject, set, onMounted } from '@vue/composition-api';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';
import { areaType, KolTagEnum, kolTagList } from '@/const/kolConst';
import { ElForm } from 'element-ui/types/form';
import { AreaType } from '@/types/tiange/kol';
import { getCompanyNameAndId, uploadCase } from '@/api/medium';
// import { getPositiveNumber } from '@/utils/string';
import { deepClone } from '@/utils/tools';
import { getFirstAvatarName } from '@/utils/format';
const { debounce } = lodash;
import lodash from '@/utils/lodash/custom';
import { sleep } from '@/utils/func';
// mediaType, newKolTagList, newPlatformList
type uploadedFile = {
  url: string;
  name: string;
};

export default defineComponent({
  components: {},
  setup(_, ctx) {
    const kolForm = ref({
      kol_name: '', // kol名字
      kol_tag: '', // kol标签
      business_type: '', // 业务类型
      areas: [], // 擅长领域
      kol_company_id: undefined, // 所属公司
    });
    const currentTagList = ref(kolTagList);
    const kolBusinessTypeOptions = ref([
      { value: BusinessTypeEnum.marketing, label: '整合营销' },
      { value: BusinessTypeEnum.mcn, label: '创新项目' },
    ]);
    const brandFormRef = ref<ElForm | null>(null);
    const descriptionAccepts = 'docx,pdf,jpg,xlsx,doc,png';
    const companyList: any = ref([]);
    const kolTag: any = inject('kolTag');
    const changeKolTag = () => {
      kolTag.value = kolForm.value.kol_tag;
    };
    const getCompanyList = async () => {
      const params = {
        num: 10000,
        page: 1,
      };
      const [_, { data: response }] = await Promise.all([
        await sleep(500),
        await getCompanyNameAndId(params),
      ]);
      if (response.success) {
        companyList.value = response.data;
      }
    };
    const brandList = ref<string[]>([]);
    const isIndeterminate = ref(false);
    const loadLoading = ref(false);
    const myAreaType: any = ref(deepClone(areaType));
    const currentBrand = ref({
      brand: '',
      key: -1,
    });
    const formRules = {
      kol_name: [{ required: true, message: '请输入花名', maxlength: 20, trigger: 'blur' }],
      kol_tag: [{ required: true, message: '请选择达人标签', trigger: 'change' }],
      business_type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
      areas: [{ required: true, message: '请选择擅长类目', trigger: 'change' }],
      kol_company_id: [
        { required: true, message: '请选择关联供应商管理中的公司', trigger: 'change' },
      ],
    };
    const addBrandVisiable = ref(false);
    const editData: any = inject('editData');
    const handleCheckedChange = (val: number[]) => {
      const len = val.length;
      isIndeterminate.value = len > 0 && len < myAreaType.value.length;
    };
    const uploadFile = async (params: any) => {
      const file = params.file;
      const size = 5;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const hasSuffix = descriptionAccepts.includes(fileType.toLowerCase());
      if (!hasSuffix) {
        ctx.root.$message.warning('上传格式不正确！');
        return;
      }
      if (size && file.size > size * 1024 * 1024) {
        ctx.root.$message.warning(`上传文件大小不能超过 ${size}MB!`);
        return;
      }
      loadLoading.value = true;
      const form = new FormData();
      form.append('file', file);
      const { data } = await uploadCase(form);
      loadLoading.value = false;
      if (data.success) {
        fileList.value.push({
          name: file.name,
          url: data.data.source,
        });
      } else {
        ctx.root.$message.warning(data.message);
      }
    };
    const fileList = ref<uploadedFile[]>([]);
    const handleExceed = (files: any, fileList: any) => {
      ctx.root.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`,
      );
    };
    const validate = async () => {
      try {
        const result = await (ctx.refs.formRef as ElForm).validate();
        if (result) {
          if (brandList.value.length < 1) {
            ctx.root.$message.warning('请添加合作品牌');
            return Promise.reject();
          }
          const obj: any = { ...kolForm.value };
          obj.areas = obj.areas.toString();
          obj.cooperation_brand = brandList.value.filter(item => !!item && item);
          obj.case = fileList.value.map((item: uploadedFile) => item.url).toString();
          return Promise.resolve(obj);
        } else {
          return Promise.reject();
        }
      } catch (error) {
        ctx.root.$message.warning('请完善表单信息');
        return Promise.reject();
      }
    };
    const inputHandler = (val: any, key: any, form: any, num: number) => {
      let _val = val.replace(/\D/g, '');
      if (_val === '') {
        form[key] = '';
      } else {
        _val = parseInt(_val, 10);
        if (_val > num) {
          _val = num;
        }
      }
      form[key] = _val + '';
    };
    const handleBrandDelete = (key: number) => {
      brandList.value.splice(key);
    };
    const handleBrandEdit = (brand: any, key: number) => {
      currentBrand.value.brand = brand;
      currentBrand.value.key = key;
      addBrandVisiable.value = true;
    };
    const showBrandCardForm = () => {
      currentBrand.value.brand = '';
      currentBrand.value.key = -1;
      addBrandVisiable.value = true;
    };
    const onAddBrandModalClose = () => {
      addBrandVisiable.value = true;
    };
    const resetForm = () => {
      currentBrand.value.brand = '';
      currentBrand.value.key = -1;
    };
    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      addBrandVisiable.value = false;
    };
    const saveCurrentBrand = (brand: string, key: number) => {
      if (key !== -1) {
        set(brandList.value, key, brand);
      } else {
        brandList.value.push(brand);
      }
    };
    const brandSubmit = () => {
      brandFormRef.value?.validate(valid => {
        if (valid) {
          if (currentBrand.value.key !== -1) {
            set(brandList.value, currentBrand.value.key, currentBrand.value.brand);
          } else {
            brandList.value.push(currentBrand.value.brand);
          }
          addBrandVisiable.value = false;
        } else {
          return false;
        }
      });
    };
    const onSaveBtnClick = debounce(brandSubmit, 200);
    const dialogRef = ref<{ show: (title: string, data?: any) => void } | null>(null);
    watch(
      () => editData,
      (val: any) => {
        const { kol_name, kol_tag, cooperation_brand, areas, kol_company_id } = val.value.kol_info;
        let { business_type } = val.value.kol_info;
        if (business_type.length === 1) {
          business_type = business_type[0];
        } else {
          business_type = '';
        }
        let editAreas = myAreaType.value
          .filter((item: AreaType) => areas.includes(item.value))
          .map((item: AreaType) => item.key);
        if (editAreas.length > 3) {
          editAreas = [];
        }
        kolForm.value = {
          kol_name,
          kol_tag,
          business_type,
          kol_company_id,
          areas: editAreas,
        };
        if (val.value.kol_info.case !== null) {
          const caseArr = val.value.kol_info.case.split(',');
          if (caseArr.length) {
            const arr: uploadedFile[] = [];
            caseArr.forEach((item: string) => {
              if (item) {
                const caseItem = item.split('/');
                arr.push({
                  name: caseItem[caseItem.length - 1],
                  url: item,
                });
              }
            });
            fileList.value = arr;
          }
        }
        brandList.value = cooperation_brand.map((item: any) => item);
      },
      {
        deep: true,
      },
    );
    watch(
      () => kolForm.value.business_type,
      (val: any) => {
        if (val === BusinessTypeEnum.marketing) {
          currentTagList.value = [
            {
              value: KolTagEnum.GRASS_KOL,
              label: '种草达人',
            },
            {
              value: KolTagEnum.LIVE_KOL,
              label: '直播达人',
            },
          ];
        } else if (val === BusinessTypeEnum.mcn) {
          currentTagList.value = [
            {
              value: KolTagEnum.TAOBAO_KOL,
              label: '淘宝KOL',
            },
            {
              value: KolTagEnum.TAOBAO_KOC,
              label: '淘宝KOC',
            },
            {
              value: KolTagEnum.DOUYIN_KOL,
              label: '抖音KOL',
            },
            {
              value: KolTagEnum.DOUYIN_KOC,
              label: '抖音KOC',
            },
          ];
        }
        if (!currentTagList.value.find((item: any) => item.value === kolForm.value.kol_tag)) {
          kolForm.value.kol_tag = '';
          kolTag.value = '';
        }
      },
    );
    onMounted(() => {
      getCompanyList();
    });
    return {
      kolForm,
      BusinessTypeOptions,
      myAreaType,
      validate,
      handleExceed,
      handleCheckedChange,
      uploadFile,
      fileList,
      formRules,
      loadLoading,
      brandList,
      companyList,
      kolTagList,
      isIndeterminate,
      descriptionAccepts,
      inputHandler,
      handleBrandDelete,
      handleBrandEdit,
      addBrandVisiable,
      onAddBrandModalClose,
      currentBrand,
      showBrandCardForm,
      dialogRef,
      getFirstAvatarName,
      onCloseBtnClick,
      brandFormRef,
      saveCurrentBrand,
      onSaveBtnClick,
      editData,
      kolTag,
      changeKolTag,
      kolBusinessTypeOptions,
      currentTagList,
    };
  },
  render() {
    return (
      <div class="base-info">
        {this.editData?.kol_info &&
          this.editData?.kol_info?.verify_reason &&
          this.editData?.kol_info?.verify_status === -1 && (
            <div class="warning-box">
              <i class="el-icon-warning"></i>
              <span style="font-weight: 600">{this.editData?.kol_info?.verify_reason}</span>
            </div>
          )}
        <el-form
          attrs={{ model: this.kolForm }}
          rules={this.formRules}
          ref="formRef"
          label-position="top"
          size="mini"
        >
          <div class="form-container">
            <div class="base-item-title" style="margin-top: 0">
              <span class="star">* </span>
              <span class="title">达人基础信息</span>
            </div>
            <div class="flex-line-box">
              <div class="flex-line-item">
                <el-form-item label="达人名称" prop="kol_name">
                  <el-input
                    placeholder="请输入达人名称"
                    v-model={this.kolForm.kol_name}
                    maxlength={20}
                    show-word-limit={true}
                  />
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="业务类型" prop="business_type">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.kolForm.business_type}
                    placeholder="请选择业务类型"
                    style={{ width: '100%' }}
                  >
                    {this.kolBusinessTypeOptions.map(item => (
                      <el-option label={item.label} value={item.value}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="达人标签：" prop="kol_tag">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.kolForm.kol_tag}
                    placeholder="请选择达人标签"
                    style={{ width: '100%' }}
                    onChange={this.changeKolTag}
                  >
                    {this.currentTagList.map(item => (
                      <el-option label={item.label} value={item.value}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-line-item">
                <el-form-item label="所属公司：" prop="kol_company_id">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.kolForm.kol_company_id}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    filterable
                  >
                    {this.companyList.map((item: any) => (
                      <el-option label={item.company_name} value={item.company_id}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <span slot="label" class="base-item-title">
              <span class="star">* </span>
              <span class="title">擅长类目</span>
              <span class="tips">（最多选3项）</span>
            </span>
            <div class="flex-line-box">
              <el-form-item prop="areas">
                <el-checkbox-group
                  style="margin-left: 2px"
                  v-model={this.kolForm.areas}
                  onChange={this.handleCheckedChange}
                  max={3}
                >
                  {this.myAreaType.map((item: any) => (
                    <el-checkbox label={item.key} key={item.key}>
                      <p class="checkbox-p">{item.value}</p>
                    </el-checkbox>
                  ))}
                </el-checkbox-group>
              </el-form-item>
            </div>
            <span slot="label" class="base-item-title">
              <span class="star">* </span>
              <span class="title">已合作品牌</span>
              <span class="tips">（最少添加1个）</span>
            </span>
            <div class="flex-line-box" style="margin-bottom: 16px; column-gap: 30px;">
              {this.brandList.map((item: string, key: number) => {
                const firstName = getFirstAvatarName(item);
                return (
                  <div>
                    <el-form-item>
                      <div class="brand-item-card">
                        <div class="item-avatar">{firstName}</div>
                        <div class="item-content">
                          <div class="item-brand-name">{item}</div>
                        </div>
                        <div class="operation-area">
                          <tg-icon
                            class="ico-btn"
                            name="ico-delete"
                            onClick={() => this.brandList.splice(key, 1)}
                          />
                          <tg-icon
                            class="ico-btn"
                            name="ico-edit-lite"
                            onClick={() => this.handleBrandEdit(item, key)}
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                );
              })}
              <div>
                {this.brandList.length < 5 ? (
                  <div
                    class="add-brand-btn"
                    icon="ico-btn-add"
                    style="margin-top: 0"
                    onClick={this.showBrandCardForm}
                  >
                    <i class="el-icon-plus avatar-uploader-icon" />
                    <span>点击添加</span>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>

            <el-dialog
              visible={this.addBrandVisiable}
              append-to-body={true}
              close-on-click-modal={false}
              close-on-press-escape={false}
              wrapperClosable={false}
              width="478px"
              top="20vh"
              class="customer-dialog brand-form-modal tg-dialog-vcenter"
              onClose={this.onCloseBtnClick}
            >
              <fragments slot="title">
                {this.currentBrand.key !== -1 ? '编辑品牌' : '添加品牌'}
              </fragments>
              <div class="dialog-content">
                <el-form
                  attrs={{ model: this.currentBrand }}
                  ref="brandFormRef"
                  label-position="top"
                  size="mini"
                  label-width="98px"
                  label-height="18px"
                >
                  <el-form-item
                    class="brand"
                    label="品牌名称："
                    prop="brand"
                    rules={{ required: true, message: '请输入品牌名称', trigger: 'blur' }}
                  >
                    <el-input
                      maxlength="10"
                      size="mini"
                      style="width: 360px"
                      v-model={this.currentBrand.brand}
                      placeholder="请输入品牌名称"
                      ref="brandFormRef"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <template slot="footer" style="height: 50px">
                <tg-button onClick={this.onCloseBtnClick}>取消</tg-button>
                <tg-button type="primary" onClick={this.onSaveBtnClick}>
                  保存
                </tg-button>
              </template>
            </el-dialog>
            <br />
            <el-form-item style="margin-left: 9px">
              <span slot="label" class="base-item-title add-kol-case">
                <span class="title">达人案例</span>
              </span>
              {this.fileList.length < 5 && (
                <el-upload
                  class="upload-demo"
                  action=""
                  httpRequest={this.uploadFile}
                  accept={this.descriptionAccepts}
                  show-file-list={false}
                  before-remove={this.beforeRemove}
                  multiple
                  max={5}
                  on-exceed={this.handleExceed}
                >
                  <tg-button
                    v-loading={this.loadLoading}
                    icon="ico-btn-upload"
                    style=" display: block"
                    className="mgb-12"
                    onClick={() => {
                      this.dialogRef?.show('添加案例');
                    }}
                  >
                    添加案例
                  </tg-button>
                  <span slot="tip" class="el-upload__tip" style="margin-left: 20px">
                    支持扩展名：.docx .doc .pdf .jpg .xlsx .png
                  </span>
                </el-upload>
              )}

              <div class="file-list">
                {this.fileList.map((item: uploadedFile, key: number) => {
                  const fileName = item.name ? item.name : item.url;
                  return (
                    <el-col span={8}>
                      <div class="cases" key={key}>
                        <p class="labels">案例{key + 1}：</p>
                        <p class="text">{fileName}</p>
                        <span
                          class="mgr-12 operation"
                          onClick={() => {
                            if ((item as any).lid === undefined) {
                              (item as any).lid = Date.now();
                            }
                            this.dialogRef?.show('编辑案例', {
                              ...item,
                            });
                          }}
                        >
                          {/*<tg-icon name="ico-edit" className="case-edit" />*/}
                        </span>
                        <span
                          class="operation"
                          onClick={() => {
                            this.fileList.splice(key, 1);
                          }}
                        >
                          <tg-icon name="ico-btn-delete" className="case-delete" />
                        </span>
                      </div>
                    </el-col>
                  );
                })}
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
});
