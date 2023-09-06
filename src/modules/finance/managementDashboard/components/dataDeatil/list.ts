import { ref, SetupContext } from '@vue/composition-api';
import { sleep } from '@/utils/func';
import { QueryProjectTeamTrendDetail } from '@/services/finance';

export const useList = (ctx: SetupContext, tab_type: number) => {
  const loading = ref(false);
  /** 数据列表 */
  const list = ref<any[]>([]);
  const total = ref(0);
  const loadData = async (payload: any) => {
    /*if (tab_type === 0) {
      const currentYear = moment().add(0, 'years').get('year');
      QueryProjectTeamTrendDetail(
        {
          start_date: currentYear + '-01-01',
          end_date: currentYear + '-12-31',
        },
        tab_type,
      ).then(({ data }) => {
        if (data.success) {
          const completion_rate_arr = ref<any[]>([]);
          const value_arr = ref<any[]>([]);
          const gmv_all_list = data.data.datas;
          gmv_all_list.forEach((item: any, index: number) => {
            completion_rate_arr.value.push(
              item.completion_rate || item.completion_rate === 0
                ? Number(item.completion_rate || '0')
                : undefined,
            );
            const gmv_amount_num = item.gmv || item.gmv === 0 ? item.gmv / 100 : undefined;
            const settlement_gmv_amount_num =
              item.settlement_gmv || item.settlement_gmv === 0
                ? item.settlement_gmv / 100
                : undefined;
            const goal_gmv_amount_num =
              item.goal_gmv || item.goal_gmv === 0 ? item.goal_gmv / 100 : undefined;
            value_arr.value.push([gmv_amount_num, settlement_gmv_amount_num, goal_gmv_amount_num]);
          });
        }
      });
      return;
    }*/
    loading.value = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await QueryProjectTeamTrendDetail(payload, tab_type),
    ]);
    loading.value = false;
    if (response.success) {
      list.value = response.data.project_datas.map((item: any) => {
        let sub;
        if (tab_type !== 0) {
          sub = {
            depart_ment: item[0],
            project_name: item[1] === '总计' ? '业务组合计' : item[1],
            oneValue: item[2][0],
            twoValue: item[3][0],
            threeValue: item[4][0],
            fourValue: item[5][0],
            fiveValue: item[6][0],
            sixValue: item[7][0],
            sevenValue: item[8][0],
            eightValue: item[9][0],
            nineValue: item[10][0],
            tenValue: item[11][0],
            elevenValue: item[12][0],
            twelveValue: item[13][0],
            allValue: item[14],
            oneRate: item[2][1],
            twoRate: item[3][1],
            threeRate: item[4][1],
            fourRate: item[5][1],
            fiveRate: item[6][1],
            sixRate: item[7][1],
            sevenRate: item[8][1],
            eightRate: item[9][1],
            nineRate: item[10][1],
            tenRate: item[11][1],
            elevenRate: item[12][1],
            twelveRate: item[13][1],
          };
        } else {
          sub = {
            depart_ment: item[0],
            project_name: item[1],
            oneTargetValue: item[2][0],
            twoTargetValue: item[3][0],
            threeTargetValue: item[4][0],
            fourTargetValue: item[5][0],
            fiveTargetValue: item[6][0],
            sixTargetValue: item[7][0],
            sevenTargetValue: item[8][0],
            eightTargetValue: item[9][0],
            nineTargetValue: item[10][0],
            tenTargetValue: item[11][0],
            elevenTargetValue: item[12][0],
            twelveTargetValue: item[13][0],
            allTargetValue: item[14][0],
            oneCompleteValue: item[2][1],
            twoCompleteValue: item[3][1],
            threeCompleteValue: item[4][1],
            fourCompleteValue: item[5][1],
            fiveCompleteValue: item[6][1],
            sixCompleteValue: item[7][1],
            sevenCompleteValue: item[8][1],
            eightCompleteValue: item[9][1],
            nineCompleteValue: item[10][1],
            tenCompleteValue: item[11][1],
            elevenCompleteValue: item[12][1],
            twelveCompleteValue: item[13][1],
            allCompleteValue: item[14][1],
            oneCompleteRate: item[2][2],
            twoCompleteRate: item[3][2],
            threeCompleteRate: item[4][2],
            fourCompleteRate: item[5][2],
            fiveCompleteRate: item[6][2],
            sixCompleteRate: item[7][2],
            sevenCompleteRate: item[8][2],
            eightCompleteRate: item[9][2],
            nineCompleteRate: item[10][2],
            tenCompleteRate: item[11][2],
            elevenCompleteRate: item[12][2],
            twelveCompleteRate: item[13][2],
            allCompleteRate: item[14][2],
          };
        }
        return sub;
      });
      let allsub: any;
      if (tab_type !== 0) {
        allsub = {
          depart_ment: '部门合计',
          project_name: '',
          oneValue: response.data.total_datas[2][0],
          twoValue: response.data.total_datas[3][0],
          threeValue: response.data.total_datas[4][0],
          fourValue: response.data.total_datas[5][0],
          fiveValue: response.data.total_datas[6][0],
          sixValue: response.data.total_datas[7][0],
          sevenValue: response.data.total_datas[8][0],
          eightValue: response.data.total_datas[9][0],
          nineValue: response.data.total_datas[10][0],
          tenValue: response.data.total_datas[11][0],
          elevenValue: response.data.total_datas[12][0],
          twelveValue: response.data.total_datas[13][0],
          allValue: response.data.total_datas[14],
          oneRate: response.data.total_datas[2][1],
          twoRate: response.data.total_datas[3][1],
          threeRate: response.data.total_datas[4][1],
          fourRate: response.data.total_datas[5][1],
          fiveRate: response.data.total_datas[6][1],
          sixRate: response.data.total_datas[7][1],
          sevenRate: response.data.total_datas[8][1],
          eightRate: response.data.total_datas[9][1],
          nineRate: response.data.total_datas[10][1],
          tenRate: response.data.total_datas[11][1],
          elevenRate: response.data.total_datas[12][1],
          twelveRate: response.data.total_datas[13][1],
        };
      } else {
        allsub = {
          depart_ment: response.data.total_datas[0],
          project_name: '',
          oneTargetValue: response.data.total_datas[2][0],
          twoTargetValue: response.data.total_datas[3][0],
          threeTargetValue: response.data.total_datas[4][0],
          fourTargetValue: response.data.total_datas[5][0],
          fiveTargetValue: response.data.total_datas[6][0],
          sixTargetValue: response.data.total_datas[7][0],
          sevenTargetValue: response.data.total_datas[8][0],
          eightTargetValue: response.data.total_datas[9][0],
          nineTargetValue: response.data.total_datas[10][0],
          tenTargetValue: response.data.total_datas[11][0],
          elevenTargetValue: response.data.total_datas[12][0],
          twelveTargetValue: response.data.total_datas[13][0],
          allTargetValue: response.data.total_datas[14][0],
          oneCompleteValue: response.data.total_datas[2][1],
          twoCompleteValue: response.data.total_datas[3][1],
          threeCompleteValue: response.data.total_datas[4][1],
          fourCompleteValue: response.data.total_datas[5][1],
          fiveCompleteValue: response.data.total_datas[6][1],
          sixCompleteValue: response.data.total_datas[7][1],
          sevenCompleteValue: response.data.total_datas[8][1],
          eightCompleteValue: response.data.total_datas[9][1],
          nineCompleteValue: response.data.total_datas[10][1],
          tenCompleteValue: response.data.total_datas[11][1],
          elevenCompleteValue: response.data.total_datas[12][1],
          twelveCompleteValue: response.data.total_datas[13][1],
          allCompleteValue: response.data.total_datas[14][1],
          oneCompleteRate: response.data.total_datas[2][2],
          twoCompleteRate: response.data.total_datas[3][2],
          threeCompleteRate: response.data.total_datas[4][2],
          fourCompleteRate: response.data.total_datas[5][2],
          fiveCompleteRate: response.data.total_datas[6][2],
          sixCompleteRate: response.data.total_datas[7][2],
          sevenCompleteRate: response.data.total_datas[8][2],
          eightCompleteRate: response.data.total_datas[9][2],
          nineCompleteRate: response.data.total_datas[10][2],
          tenCompleteRate: response.data.total_datas[11][2],
          elevenCompleteRate: response.data.total_datas[12][2],
          twelveCompleteRate: response.data.total_datas[13][2],
          allCompleteRate: response.data.total_datas[14][2],
        };
      }
      list.value.push(allsub);
      // total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'error',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return {
    loadData,
    list,
    loading,
    total,
  };
};
