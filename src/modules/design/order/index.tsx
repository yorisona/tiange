import { ref, defineComponent, h, onActivated } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { FunctionSelect, Select } from '@gm/component/select';
import {
  Query_Design_Order,
  Query_Design_Type_Department,
  Query_Visual_Design_Assign_Order,
  Get_Visual_Design_Search_Brand,
  Query_Design_Level,
} from '@/services/design';
import { FormType, projectType_option } from './useOrder';
import { RouterNameDesign } from '@/const/router';
import designCard from '@/modules/design/components/designCard/index.vue';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';

export default defineComponent({
  components: { designCard },
  setup: (props, ctx) => {
    const formData = ref<FormType>({
      brand_name: '',
      brand_id: undefined,
      department_name: undefined,
      order_status: 0,
      project_name: '',
      department_id: undefined,
      project_type: undefined,
      team_id: undefined,
      execute_person_name: '',
      level_id: undefined,
    });
    const config = {
      reset() {
        formData.value.project_name = '';
        formData.value.order_status = 0;
        formData.value.department_name = undefined;
        formData.value.brand_name = '';
        formData.value.brand_id = undefined;
        formData.value.department_id = undefined;
        formData.value.project_type = undefined;
        formData.value.team_id = undefined;
        formData.value.execute_person_name = '';
        formData.value.level_id = undefined;
        formData.value.executor_id = undefined;
      },
      table: {
        border: true,
        rowClick: (row: any) => {
          ctx.root.$router.push({
            name: RouterNameDesign.design_order_detail,
            query: {
              order_id: row.id,
            },
          });
          // window.open(routeUrl.href, '_blank');
        },
      },
    };
    const reqList = usePagination(Query_Design_Order, {
      defaultParams: [{ num: 20, page_num: 1 }, formData.value],
    });
    const reqHasInit = useRequest(Query_Visual_Design_Assign_Order);
    const reqLevel = useRequest(Query_Design_Level, {
      transform(res) {
        return res.data.map((item: any) => {
          return {
            value: item.id,
            label: item.tips,
          };
        });
      },
    });
    const reqBrand = useRequest(Get_Visual_Design_Search_Brand, {
      defaultParams: [formData.value.brand_name as any],
      manual: true,
    });
    const projectTypeOptions = ref();
    const query_projectType_option = async (v: any) => {
      if (!v) {
        formData.value.project_type = undefined;
        projectTypeOptions.value = [];
        return;
      }
      projectTypeOptions.value = await projectType_option(v);
    };
    const reqProject = useRequest(Query_Design_Type_Department, {
      transform(res) {
        return res.map((item: any) => {
          return {
            value: item.id,
            label: item.label,
          };
        });
      },
    });

    const onTableChange = (value: number) => {
      reqList.pagination.reQuery(formData.value);
    };
    onActivated(() => {
      reqList.reload();
      reqHasInit.reload();
    });

    return {
      reqProject,
      reqHasInit,
      reqBrand,
      onTableChange,
      config,
      formData,
      reqList,
      projectTypeOptions,
      reqLevel,
      query_projectType_option,
    };
  },
  render() {
    const { formData, columns, config, reqList, onTableChange, reqProject, reqHasInit, reqBrand } =
      this;
    const { pagination } = reqList;

    return (
      <ListGenerallyTemplate
        columns={columns}
        v-model={formData}
        config={config}
        service={this.reqList}
        routes={this.routes}
        class="page-container"
      >
        <el-form-item label="项目级别：">
          <Select
            popper-class="el-select- popper-mini"
            showAll={true}
            placeholder="请选择项目级别"
            style={{ width: '144px' }}
            v-model={formData.level_id}
            options={this.reqLevel.data as any}
          />
        </el-form-item>
        <el-form-item label="项目方：">
          <Select
            style={{ width: '144px' }}
            popper-class="el-select- popper-mini"
            remote
            remote-method={(e: string) => {
              reqBrand.run(e);
            }}
            filterable
            placeholder="请选择项目方"
            v-model={formData.brand_id}
            options={(reqBrand.data as any)?.map((item: any) => {
              return {
                value: item.id,
                label: item.name,
              };
            })}
          />
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
            style={{ width: '144px' }}
            v-model={formData.project_name}
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="项目类型：">
          <Select
            style={{ width: '144px' }}
            popper-class="el-select- popper-mini"
            showAll={true}
            placeholder="请选择项目类型"
            v-model={formData.project_type}
            options={reqProject.data as any}
          />
        </el-form-item>
        <el-form-item label="设计师：">
          <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入设计师花名"
            v-model={formData.executor_id}
          />
        </el-form-item>
        <div slot="middle" class="group">
          <el-radio-group size="mini" v-model={formData.order_status} onChange={onTableChange}>
            <el-radio-button label={0}>全 部</el-radio-button>
            <el-radio-button label={1}>
              <span class="subscript-box">
                待接单
                {reqHasInit.data && <span class="subscript">角标</span>}
              </span>
            </el-radio-button>
            <el-radio-button label={2}>设计中</el-radio-button>
            <el-radio-button label={3}>待审核</el-radio-button>
            <el-radio-button label={4}>已交付</el-radio-button>
            <el-radio-button label={5}>其他</el-radio-button>
          </el-radio-group>
        </div>
        <div slot="bodyContainer" class={`body-container ${reqList.data?.length === 0 && 'empty'}`}>
          <div class="card-box" v-loading={reqList.loading}>
            {reqList.data?.map(item => {
              return (
                <design-card
                  key={item.id}
                  position="order"
                  value={item}
                  onClick={() => {
                    if (item.external_status !== 7) {
                      this.$router.push({
                        name: RouterNameDesign.design_order_detail,
                        query: {
                          order_id: String(item.id),
                        },
                      });
                    }
                  }}
                />
              );
            })}
          </div>
          {reqList.data?.length === 0 && <empty-common />}
        </div>
        <div class="pagination" slot="footer">
          <el-pagination
            total={pagination.total}
            page-size={pagination.page_size}
            page-sizes={pagination.page_sizes}
            layout={pagination.layout || 'total, prev, pager, next'}
            current-page={pagination.page_num}
            oncurrent-change={pagination.onCurrentChange}
            onsize-change={pagination.onSizeChange}
          />
        </div>
      </ListGenerallyTemplate>
    );
  },
});
