import { defineComponent, inject } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination } from '@gm/hooks/ahooks';
import { RouterNamePerformance } from '@/const/router';
import { Query_User_Performance_Detail_Record } from '@/services/performance';
import { useRouter } from '@/use/vue-router';

const routes = [
  { title: '员工绩效档案', name: RouterNamePerformance.report.record },
  { title: '员工考核详情' },
];
export default defineComponent({
  setup: () => {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const router = useRouter();
    const userid = router.currentRoute.params.id;

    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '考核名称',
        minWidth: 100,
        prop: 'assessment_management_name',
      },
      {
        align: 'center',
        label: '考核周期',
        prop: 'assessment_cycle',
      },
      {
        align: 'center',
        label: '考评组',
        prop: 'evaluation_group_name',
      },
      {
        align: 'center',
        label: '考核结果',
        prop: 'result',
      },
      {
        align: 'center',
        label: '考核等级',
        prop: 'level',
      },
      {
        label: '操作',
        minWidth: 60,
        formatter: row => {
          return (
            <div>
              <tg-button
                type="link"
                onClick={() => {
                  const { href } = router.resolve({
                    name: RouterNamePerformance.report.detailDetail,
                    params: {
                      id: row.assessment_management_id as any,
                      userid: row.id as any,
                    },
                    query: {
                      id: userid,
                    },
                  });
                  window.open(href);
                }}
              >
                查看
              </tg-button>
            </div>
          );
        },
      },
    ];

    const reqList = usePagination(Query_User_Performance_Detail_Record, {
      defaultParams: [
        { num: 20, page_num: 1 },
        {
          user_id: userid,
        },
      ],
    });

    return {
      columns,
      reqList,
    };
  },
  render() {
    return <ListGenerallyTemplate columns={this.columns} service={this.reqList} />;
  },
});
