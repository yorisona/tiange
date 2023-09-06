import { defineComponent, inject, provide, ref } from '@vue/composition-api';
import latitude from './components/latitude/index.vue';
import { useRouter } from '@/use/vue-router';
import { Select } from '@gm/component';
import { useTemplateManager } from '@/modules/datacenter/multidimensional/commodity/use';
import templateList from './components/templateList/templateList.vue';
import templateSave from './components/templateSave/templateSave.vue';
// import colorClassified from './components/colorClassified/index.vue';
import colorClassified from './components/addColorClassified/index.vue';
import moment from 'moment';
import { useDialog } from '@/use/dialog';
import { useRequest } from '@gm/hooks/ahooks';
import {
  query_multidimensional_statistics_template,
  query_project_second_list,
  GetQueryDouyinReportProjects,
  query_item_color_classify_list,
} from '@/services/datacenter';
import { Confirm } from '@/use/asyncConfirm';
import { RouterDataCenter } from '@/const/router';
import { usePermission } from '@/use/permission';

export default defineComponent({
  components: {
    latitude,
  },
  setup() {
    const router = useRouter();
    const permission = usePermission();
    // 注意, 这里的formData和useTemplateManager里面的formData不一致, 点击开始分析时才同步
    // 盲猜后面肯定不用点开始分析就可以生效, 这样请直接 useTemplateManager里面的formData即可
    // 恭喜🎉，你猜对了
    /**
    const formData = reactive({
      project_id: Number(router.currentRoute.query.project_id),
      date: [moment().subtract(7, 'day'), moment().subtract(1, 'day')],
      // date: [moment('2023-02-14'), moment('2023-02-28')],
      // 已更改为Template中的category
      // category: undefined as any,
    });
     **/
    const template = useTemplateManager();
    const { formData } = template;
    const project_options = ref<TG.OptionType<any>[]>([
      { label: String(router.currentRoute.query.project_name), value: formData.project_id },
    ]);

    const dialogTemplateList = useDialog({
      component: templateList,
      width: 346,
      title: '调用模板',
      on: {
        submit(tmp: any) {
          template.loadTemplate(tmp);
        },
      },
    });
    const dialogTemplateSave = useDialog({
      component: templateSave,
      title: '模板保存',
      width: 312,
      on: {
        submit() {},
      },
    });
    const reqColorCategoryList = useRequest(query_item_color_classify_list);
    const dialogColorClassified = useDialog({
      component: colorClassified,
      title: '颜色归类',
      width: 455,
      class: 'tg-color-classified-dialog-custom',
      on: {
        submit() {
          loadDefaultTemplate(formData.category);
        },
      },
    });

    const currentDate = moment().startOf('day');
    const pickerOptions = {
      disabledDate(date: any) {
        return currentDate.isSameOrBefore(date);
      },
    };

    const reqQueryProjectSecondList = useRequest(query_project_second_list, {
      manual: true,
      transform: (res: any) => {
        return res.map((item: any) => {
          return {
            label: `${item.first_cname}/${item.second_name}`,
            value: item.second_cid,
          } as any;
        });
      },
      onSuccess: (e: any) => {
        // 如果第一次进入, 没有类目时赋值一个
        if (e.length > 0 && formData.category === undefined) {
          formData.category = e[0].value;
          template.updateLatitudeOptions();
          loadDefaultTemplate(formData.category);
        }
      },
    });
    provide('template', template);

    const loadDefaultTemplate = (second_cid: number) => {
      query_multidimensional_statistics_template({ second_cid }).then(res => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            dialogTemplateList.emit('submit', res.data.data[0]);
          } else {
            template.list = [];
          }
        }
      });
    };
    const loadCategory = () => {
      // formData.project_id = formData.project_id;
      formData.category = undefined as any;
      template.list = [];
      reqQueryProjectSecondList.runAsync({
        project_id: formData.project_id,
        start_date: moment(formData.date[0]).format('YYYY-MM-DD'),
        end_date: moment(formData.date[1]).format('YYYY-MM-DD'),
      });
      // 之前需要点击开始分析才会查询数据, 现在随便改点啥都自动查询了, 所以把外面的project_id更新到内部去
    };

    const loadProjectOptions = () => {
      GetQueryDouyinReportProjects().then(res => {
        const list = res.data.data.projects || [];
        project_options.value = list.map((it: any) => {
          return {
            label: it.project_name,
            value: it.project_id,
          };
        });
      });
    };

    const onCategoryChange = () => {
      loadDefaultTemplate(formData.category);
      template.updateLatitudeOptions();
      template.template_info = {} as any;
    };
    const onTimeChange = () => {
      formData.category = undefined as any;
      template.list = [];
      loadCategory();
    };
    const init = () => {
      loadCategory();
      loadProjectOptions();
    };

    const routes = [
      { title: '品牌商品分析', name: RouterDataCenter.commodityAnalysis },
      { title: '商品多维度分析' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    init();
    return {
      onCategoryChange,
      project_options,
      template,
      dialogTemplateList,
      dialogTemplateSave,
      dialogColorClassified,
      pickerOptions,
      reqQueryProjectSecondList,
      reqColorCategoryList,
      loadCategory,
      loadDefaultTemplate,
      onTimeChange,
      permission,
    };
  },
  render() {
    const { template } = this;
    const { formData, loading } = template;
    let disabledAnalysis = loading;
    if (!formData.project_id) {
      disabledAnalysis = true;
    } else if (!formData.date || !formData.date[0] || !formData.date[1]) {
      disabledAnalysis = true;
    } else if (!formData.category) {
      disabledAnalysis = true;
    }
    const hasEmpty = this.template.list.length <= 0;
    return (
      <div class="tg-page-container">
        <div class="header">
          <el-form
            size="mini"
            show-message={false}
            hide-required-asterisk={true}
            label-width="60px"
          >
            <div class="form-item-container">
              <el-form-item label="项目名称：" class="form-item">
                <Select
                  clearable={false}
                  disabled={template.loading}
                  options={this.project_options}
                  v-model={formData.project_id}
                  style="width:100%"
                  filterable={true}
                  onChange={this.loadCategory}
                />
              </el-form-item>
              <el-form-item label="选择日期：" class="form-item">
                <el-date-picker
                  disabled={template.loading}
                  format="yyyy.MM.dd"
                  type="daterange"
                  style="width:100%"
                  range-separator="~"
                  v-model={formData.date}
                  clearable={false}
                  picker-options={this.pickerOptions}
                  onChange={this.onTimeChange}
                />
              </el-form-item>
              <div class="form-item query-operator-item">
                <tg-button
                  disabled={disabledAnalysis}
                  class="el-btn-mini"
                  type="primary"
                  onClick={() => {
                    template.startAnalyzing();
                  }}
                >
                  开始分析
                </tg-button>
                <tg-button
                  disabled={disabledAnalysis}
                  class="mgl-8 el-btn-mini"
                  onClick={() => {
                    this.dialogTemplateSave.show(template);
                  }}
                >
                  保存模板
                </tg-button>
                <tg-button
                  disabled={disabledAnalysis}
                  class="mgl-8 el-btn-mini"
                  onClick={() => {
                    this.dialogTemplateList.show(formData.category, template);
                  }}
                >
                  调用模板
                </tg-button>
                {this.permission.edit_color_classify && (
                  <tg-button
                    disabled={disabledAnalysis}
                    class="mgl-8 el-btn-mini"
                    onClick={async () => {
                      // this.dialogTemplateList.show(formData.category, template);
                      const res = await this.reqColorCategoryList.runAsync();
                      if (res.data.success) {
                        this.dialogColorClassified.show(res.data.data);
                      }
                    }}
                  >
                    颜色归类
                  </tg-button>
                )}
              </div>
            </div>
          </el-form>
        </div>
        <div class="screening-area">
          <span>选择类目：</span>
          <Select
            clearable={false}
            filterable={true}
            disabled={template.loading}
            v-model={formData.category}
            options={this.reqQueryProjectSecondList.data}
            size="mini"
            onChange={this.onCategoryChange}
          />
        </div>
        <div class="page-body">
          {!hasEmpty && (
            <div class="chart-list">
              {this.template.list.map((item, index) => {
                return (
                  <latitude
                    key={index}
                    data={item}
                    onDelete={async () => {
                      await Confirm('确定删除吗?');
                      this.template.list.splice(index, 1);
                    }}
                  />
                );
              })}
            </div>
          )}

          <tg-button
            icon="ico-btn-add"
            type="primary"
            class="mgt-12"
            disabled={disabledAnalysis}
            onClick={template.addNewTemplate}
          >
            新增面板
          </tg-button>
          {hasEmpty && <empty-common detail-text="暂无模板" class="no-data" />}
        </div>
        <tg-mask-loading visible={this.reqColorCategoryList.loading} content="加载中，请稍候..." />
      </div>
    );
  },
});
