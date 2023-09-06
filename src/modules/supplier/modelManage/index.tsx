/*
 * @Author: 肖槿
 * @Date: 2021-11-08 16:48:07
 * @Description: 模特管理tsx
 */
import { defineComponent, ref, SetupContext, onMounted } from '@vue/composition-api';
import liverModel from '@/modules/supplier/components/model/index.vue';
import addModelDialog from '@/modules/supplier/components/addModelDialog/index.vue';
import showModel from '@/modules/supplier/components/showModel/index.vue';
import { DeleteModelForSupplier, GetModelList } from '@/services/supplier';
import { Model } from '@/types/tiange/supplier';
import { usePermission } from '@/use/permission';
import { AsyncConfirm } from '@/use/asyncConfirm';
// import { sleep } from '@/utils/func';
const useList = () => {
  const modelList = ref<Model[]>([]);
  const loading = ref(false);
  const modelTotal = ref(0);
  const queryParams = ref({
    num: 50,
    page_num: 1,
    search: '',
  });
  const getList = async () => {
    loading.value = true;
    const { data, total }: any = await GetModelList({ ...queryParams.value });
    loading.value = false;
    modelList.value = data;
    modelTotal.value = total;
  };
  return {
    modelList,
    getList,
    queryParams,
    modelTotal,
    loading,
  };
};
export default defineComponent({
  components: {
    liverModel,
    addModelDialog,
    showModel,
  },
  setup(prop, ctx: SetupContext) {
    const modelLogic = useList();
    const dialogModelRef = ref<{ show: (...args: any) => void }>();
    const showModelRef = ref<{ show: (...args: any) => void }>();
    const permission = usePermission();

    const search = () => {
      modelLogic.queryParams.value.page_num = 1;
      modelLogic.getList();
    };
    const reset = () => {
      modelLogic.queryParams.value.page_num = 1;
      modelLogic.queryParams.value.search = '';
      modelLogic.getList();
    };
    const addModelInvoke = () => {
      dialogModelRef.value?.show('新增模特');
    };
    const onKeyPress = (event: any) => {
      if (event.which !== 13) return;
      search();
    };

    const onDeleteModel = async (row: Model) => {
      const res = await AsyncConfirm(ctx, '是否确定删除此模特？');
      if (res) {
        const res = await DeleteModelForSupplier(row.id);
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          modelLogic.getList();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      }
    };
    onMounted(() => {
      modelLogic.getList();
    });
    return {
      onDeleteModel,
      search,
      reset,
      onKeyPress,
      permission,
      addModelInvoke,
      dialogModelRef,
      showModelRef,
      ...modelLogic,
    };
  },
  render() {
    return (
      <div class="supplier-model-manage">
        <tg-card class="search-box" padding={[16, 16, 4, 16]}>
          <el-form
            size="mini"
            show-message={false}
            label-width="60px"
            nativeOn={{
              submit: function ($event: Event) {
                $event.preventDefault();
              },
            }}
          >
            <div class="filter-form-div">
              <div class="filter-form-item" style="min-width: 314px">
                <el-form-item label="名称搜索：" nativeOnKeypress={this.onKeyPress}>
                  <el-input
                    v-model={this.queryParams.search}
                    placeholder="请输入模特花名/真名"
                    style="min-width: 244px"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="filter-form-item">
                <el-form-item label-width="0">
                  <div class="filter-form-item-btn">
                    <tg-button type="primary" onclick={this.search}>
                      查询
                    </tg-button>
                    <tg-button class="mgl-8" onclick={this.reset}>
                      重置
                    </tg-button>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </tg-card>
        <div class="table-box mgt-10 table-model" v-loading={this.loading}>
          {this.permission.supplier_model_add && (
            <tg-button-line class="model-addbtn">
              <tg-button type="primary" icon="ico-btn-add" onClick={this.addModelInvoke}>
                新增模特
              </tg-button>
            </tg-button-line>
          )}
          <div class="table-box mgt-16 display-picture">
            {this.modelList.map((item: Model) => {
              return (
                <liver-model
                  item={item}
                  isEdit={this.permission.supplier_model_add}
                  isDelete={this.permission.supplier_model_delete}
                  cover={item.images[0] + '?thumbnail=1'}
                  onShow={(row: any) => {
                    this.showModelRef?.show(row);
                  }}
                  onEdit={(row: Model) => {
                    this.dialogModelRef?.show('编辑模特', row);
                  }}
                  onDelete={(row: Model) => {
                    this.onDeleteModel(row);
                  }}
                />
              );
            })}
            {!this.modelList.length && (
              <div class="empty-model" style="marginTop:150px">
                <empty-common detial-text="暂无数据"></empty-common>
              </div>
            )}
          </div>
          {this.modelTotal > 20 && (
            <div
              class="block flex-none"
              style="background:#fff;margin-top: 18px; padding: 12px 16px 24px"
            >
              <el-pagination
                style="margin: 0"
                current-page={this.queryParams.page_num}
                page-sizes={[10, 20, 50, 100, 200]}
                pageSize={this.queryParams.num}
                total={this.modelTotal}
                oncurrent-change={(page_num: number) => {
                  this.queryParams.page_num = page_num;
                  this.getList();
                }}
                onsize-change={(num: number) => {
                  this.queryParams.num = num;
                  this.getList();
                }}
                layout="total, prev, pager, next, sizes, jumper"
              />
            </div>
          )}
        </div>
        <add-model-dialog ref="dialogModelRef" onSuccess={this.getList} />
        <showModel ref="showModelRef" />
      </div>
    );
  },
});
