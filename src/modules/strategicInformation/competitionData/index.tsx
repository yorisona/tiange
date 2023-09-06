import { defineComponent, ref, set } from '@vue/composition-api';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { useRouter } from '@/use/vue-router';
import { RouterNameStrategicInformation } from '@/const/router';
import { Get_Have_Data_Year, Query_Opponent_Data } from '@/services/strategicInformation';
import { usePermission } from '@/use/permission';
import { numberFormat } from '@/utils/formatMoney';
import moment from 'moment';

type ColumnsData = TG.ReadProperty<
  TG.HttpListResultType<typeof Query_Opponent_Data>,
  'cooperative_brand_data'
>[0];
type FormData = TG.PaginationParams<typeof Query_Opponent_Data>;
export default defineComponent({
  setup() {
    const columns: TgTableColumn<ColumnsData>[] = [
      {
        label: '品牌',
        minWidth: 139,
        prop: 'name',
        fixed: 'left',
        'show-overflow-tooltip': true,
      },
      {
        label: '抖音号',
        align: 'left',
        minWidth: 131,
        prop: 'douyin_num',
        'show-overflow-tooltip': true,
      },
      ...new Array(12).fill(1).map((_, index) => {
        return {
          label: `${index + 1}月 (万元)`,
          minWidth: 90,
          align: 'right',
          prop: `month_${index + 1}`,
          formatter(row, column: any) {
            const value = row[column.property];
            if (typeof value === 'string') return value;
            return numberFormat(row[column.property], 2) ?? '--';
          },
        } as TgTableColumn<any>;
      }),
      {
        label: '合计 (万元)',
        fixed: 'right',
        align: 'right',
        prop: 'total',
        minWidth: 131,
        formatter(row: any, column: any) {
          return numberFormat(row[column.property], 2) ?? '--';
        },
      },
    ];
    const router = useRouter();
    const list = ref<any[]>([]);
    const hasNext = ref(true);
    let defaultSearchYear = moment().format('YYYY');
    const initFormData = () => ({ search_year: defaultSearchYear } as any);
    const formData = ref<FormData>(initFormData());
    const reqService = usePagination(Query_Opponent_Data, {
      transform(res) {
        res.data.forEach(item => {
          const total: any = { name: '合计 (万元)' };
          Object.assign(total, item.total);
          item.cooperative_brand_data.push(total);
        });
        // return res.data as any;
        return res;
      },
      onSuccess(data: any) {
        const currentPage = reqService.params[0].page_num;

        if (currentPage === 1) {
          list.value = [];
        }
        const total = data.total;
        const pageSize = reqService.pagination.num;
        hasNext.value = currentPage * pageSize < total;

        list.value.push(...data.data);
      },
      manual: true,
    });
    const permission = usePermission();
    const getSummaries = (params: any, summary: any) => {
      const { columns } = params;
      let sums = new Array(columns.length);
      columns.forEach((column: any, index: number) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        sums[index] = summary[column.property];
      });
      sums = sums.map(value => (value === undefined ? '--' : value));

      return sums;
    };
    const listSwitch = ref([]);
    const jumpToSetting = () => {
      const { href } = router.resolve({ name: RouterNameStrategicInformation.competitionSettings });
      window.open(href, '_blank');
      // router.push({ name: RouterNameStrategicInformation.competitionSettings });
    };

    const config: ITemplateConfig = {
      reset() {
        formData.value = initFormData();
      },
    };
    const ContainerBody = ref<HTMLElement>();

    const CheckedNext = (e: Event) => {
      if (!ContainerBody.value) return;
      const Container = e.target as HTMLElement;
      const DomHeight = Container.offsetHeight;
      const distance = ContainerBody.value.offsetHeight - (DomHeight + Container.scrollTop);
      if (distance < 10 && hasNext.value && !reqService.loading) {
        reqService.pagination.onCurrentChange(reqService.pagination.page_num + 1);
      }
    };
    // Get_Have_Data_Year
    Get_Have_Data_Year()
      .then(res => {
        if (res.data.success) {
          defaultSearchYear = String(res.data.data);
          formData.value.search_year = defaultSearchYear;
        }
      })
      .then(() => {
        reqService.runAsync({} as any, formData.value);
      });
    return {
      columns,
      reqService,
      getSummaries,
      listSwitch,
      router,
      jumpToSetting,
      formData,
      config,
      permission,
      list,
      hasNext,
      CheckedNext,
      ContainerBody,
    };
  },
  render() {
    const {
      columns,
      reqService,
      listSwitch,
      jumpToSetting,
      formData,
      config,
      permission,
      list,
      CheckedNext,
    } = this;
    return (
      <ListGenerallyTemplate
        service={reqService}
        v-model={formData}
        config={config}
        class="page-container"
      >
        <el-form-item label="公司名称：">
          <el-input placeholder="请输入公司名称" v-model={formData.name} />
        </el-form-item>
        <el-form-item label="品牌名称：">
          <el-input placeholder="请输入品牌名称" v-model={formData.brand_name} />
        </el-form-item>
        <el-form-item label="统计时间：">
          <el-date-picker
            value-format="yyyy"
            type="year"
            placeholder="请选择统计时间"
            v-model={formData.search_year}
          />
        </el-form-item>
        <div class="bodyContainer" slot="bodyContainer" onscroll={CheckedNext}>
          {permission.strategicInformation_setting && (
            <div class="btnLine">
              <tg-button onClick={jumpToSetting}>竞对设置</tg-button>
            </div>
          )}
          <div class={`company-container ${list.length === 0 && 'nodata'}`} ref="ContainerBody">
            {list.map((item, index) => {
              const openMenu = listSwitch[index] === true;
              const switchIcon = openMenu ? 'ico-arrow-up' : 'ico-arrow-down';
              const switchName = openMenu ? '收起详情' : '展开详情';
              const toggleOpenMenu = () => {
                set(listSwitch, index, !openMenu);
              };
              return (
                <div class="company-item">
                  <div class="company-info">
                    <div class="header">
                      <div class="title">
                        <span class="company-name">{item.name}</span>
                        <span class="company-year">{item.year}年 GMV：</span>
                        <span class="company-gmv">{numberFormat(item.total.total, 2)}万元</span>
                      </div>
                      <div class="expansion" onClick={toggleOpenMenu}>
                        <tg-icon name={switchIcon} />
                        <span>{switchName}</span>
                      </div>
                    </div>
                    {openMenu && (
                      <div class="companyDetails">
                        <span>公司简介：</span>
                        <span>{item.introduction ?? '--'}</span>
                        <span>团队情况：</span>
                        <span>{item.team_info ?? '--'}</span>
                        <span>头部达人：</span>
                        <span>{item.head_person ?? '--'}</span>
                        <span>备注：</span>
                        <span>{item.remark ?? '--'}</span>
                      </div>
                    )}
                  </div>
                  <tg-table border columns={columns} data={item.cooperative_brand_data} />
                </div>
              );
            })}
            {list.length === 0 && <empty-common />}
          </div>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
