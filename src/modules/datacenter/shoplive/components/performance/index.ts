import { defineComponent, ref, watch } from '@vue/composition-api';
import { formatAmount, transformSecond } from '@/utils/string';
import videoPlayer from './videoPlayer.vue';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import formatPriceForm from '@/utils/formatData';
import {
  GetShopLivePerfromanceScreen,
  GetShopLivePerfromanceTrendList,
  GetShopLivePerfromanceProductDetail,
  GetShopLivePerfromanceKoiDetail,
} from '@/services/datacenter/shoplive';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'performanceSell',
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    updata: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseEcharts,
    videoPlayer,
  },
  setup(props, ctx) {
    const router = useRouter();
    const from_project: boolean = router.currentRoute.query.from_project === '1';
    const days = ['上架', '讲解', '注释'];
    const title: any[] = [];
    const singleAxis: any[] = [];
    const series = ref<any[]>([]);
    days.forEach(function (day: string, idx: number) {
      title.push({
        textBaseline: 'middle',
        top: ((idx + 0.5) * 25) / 3 + 63 + '%',
        text: day,
        textStyle: {
          color: 'var(--text-second-color)',
          fontSize: 12,
          fontWeight: 400,
        },
        left: 20,
      });
      singleAxis.push({
        left: 60,
        right: 58,
        type: 'category',
        // boundaryGap: false,
        data: [] as any[],
        top: (idx * 25) / 3 + 5 + 61 + '%',
        height: 8,
        axisLabel: {
          color: 'var(--text-second-color)',
          fontSize: 11,
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: [2, 2],
            dashOffset: -15,
            bottom: 10,
            color: 'rgba(52,63,76,0.30)',
            width: '1',
          },
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
        axisTick: {
          show: false,
        },
      });
      series.value.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [] as any[],
        symbol: 'circle', //roundRect
        color: ['#FFBF00', '#7048E8', '#00B942'][idx],
        symbolSize: function (val: number) {
          return val;
        },
      });
    });
    series.value.push({
      gridIndex: 0,
      itemStyle: {
        color: '#2877FF',
      },
      name: '实时在线人数',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [] as any[],
      emphasis: {
        focus: 'series',
      },
    });
    series.value.push({
      gridIndex: 0,
      smooth: true,
      name: '直播间进入人数',
      type: 'line',
      itemStyle: {
        color: '#57C1FF',
      },
      showSymbol: false,
      data: [] as any[],
      emphasis: {
        focus: 'series',
      },
    });
    series.value.push({
      gridIndex: 0,
      itemStyle: {
        color: '#9273F8',
      },
      name: '分钟成交金额',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      showSymbol: false,
      data: [] as any[],
      emphasis: {
        focus: 'series',
      },
    });
    const baseOptions = ref({
      /*axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
      },*/
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-third-color)',
          },
        },
        formatter(params: any) {
          if (params[0].data === 0) {
            return '';
          }
          let titleStr = params[0].axisValue || '';
          titleStr = titleStr.replace(/-/g, '.');
          let res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${titleStr}<span></span></div>`;
          if (params[0].axisType.indexOf('singleAxis') > -1) {
            let res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${titleStr}<span></span></div>`;
            const arr = projectData.value.trend_date || [];
            const index = arr.findIndex((it: string) => it === params[0].axisValue);
            if (params[0].seriesIndex === 0) {
              //上架
              const data: any = projectData.value.shelve[index];
              const product_list = data ? data.product_list : [];
              res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px;display: flex;justify-content: space-between">${titleStr}<span style="color: var(--text-second-color)">上架商品</span></div>`;
              product_list.map((item: any) => {
                res +=
                  '<div style="display: flex;justify-content: space-between;font-size:12px;font-weight:400;color: var(--text-second-color);">商品名称：<div class="base-good-title">' +
                  item.product_title +
                  ' </div></div>';
              });
              if (data && (data.product_num || 0) > 3) {
                res += '<div>上架商品总共有' + data.product_num + '个商品</div>';
              }
              return res;
            }
            if (params[0].seriesIndex === 1) {
              const data: any = projectData.value.explain[index];
              let start_time = data ? data.start_time : '';
              let end_time = data ? data.end_time : '';
              if (start_time.length > 5) {
                start_time = moment(start_time).format('HH:mm');
              }
              if (end_time.length > 5) {
                end_time = moment(end_time).format('HH:mm');
              }
              res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px;display: flex;justify-content: space-between">${titleStr}<span style="color: var(--text-second-color)">讲解商品</span></div>`;
              res +=
                '<div style="display: flex;justify-content: space-between;font-size:12px;font-weight:400;color: var(--text-second-color);">商品名称：<div class="base-title">' +
                (data ? data.product_title : '') +
                ' </div></div>';
              res +=
                '<div style="color: var(--text-second-color);font-size:12px;font-weight:400;width: 200px;line-height: 24px">讲解时段：<span style="color: var(--text-color)">' +
                start_time +
                '-' +
                end_time +
                '</span> </div>';
              res +=
                '<div style="color: var(--text-second-color);font-size:12px;font-weight:400;width: 200px;line-height: 24px">新成交金额：<span style="color: var(--text-color)"> ' +
                formatAmount(Number(data ? data.gmv : 0) / 100) +
                '</span> </div>';
              return res;
            }
            if (params[0].seriesIndex === 2) {
              res = '';
              const data = projectData.value.note[index] || [];
              data.map((item: any) => {
                res += `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px;display: flex;justify-content: space-between">${titleStr}<span style="color: var(--text-second-color)">${item.user_name}</span></div>`;
                res +=
                  '<div class="base-title" style="margin-bottom: 20px">' + item.comment + '</div>';
              });
              return res;
            }
          } else {
            let seriesName, color, data;
            for (let i = 0; i < params.length; i++) {
              color = params[i].color;
              seriesName = params[i].seriesName || '';
              data = params[i].data;
              if (seriesName !== '分钟成交金额' || seriesName.indexOf('人数') >= 0) {
                res +=
                  '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                  '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                  color +
                  '"></div>' +
                  seriesName +
                  '：' +
                  '<div style="color: var(--text-color);font-weight: 400;"> ' +
                  formatAmount(Number(data || 0).toFixed(0), 'None', true) +
                  ' </div>' +
                  '</div>';
              } else {
                res +=
                  '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                  '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                  color +
                  '"></div>' +
                  seriesName +
                  '：' +
                  '<div style="color: var(--text-color);font-weight: 400;"> ' +
                  formatAmount(Number(data || 0)) +
                  ' </div>' +
                  '</div>';
              }
            }
            return res;
          }
          return '<div></div>';
        },
        textStyle: {
          color: '#343F4C',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 70,
          xAxisIndex: [0, 1],
          singleAxisIndex: [0, 1, 2],
          minValueSpan: 8,
          // maxValueSpan: 12,
          // top: 'bottom',
          height: 18,
          bottom: 10,
          textStyle: {
            show: false,
            color: 'white',
          },
          showDataShadow: false,
        },
        /* {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 70,
          xAxisIndex: [0, 1],
          minValueSpan: 8,
          // maxValueSpan: 12,
          // top: 'bottom',
          height: 18,
          bottom: 10,
          textStyle: {
            show: false,
            color: 'white',
          },
          showDataShadow: false,
        },*/
      ],
      // Make gradient line here
      legend: {
        data: ['实时在线人数', '直播间进入人数', '分钟成交金额'],
        show: true,
        right: 120,
        top: 5,
        type: 'scroll',
        width: 800,
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 14,
      },
      xAxis: [
        {
          type: 'category',
          data: [] as any[],
          // boundaryGap: false,
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(52,63,76,0.30)',
              width: '1',
            },
          },
          gridIndex: 0,
          axisLabel: {
            color: 'var(--text-second-color)',
            fontSize: 11,
            formatter(value: any) {
              if (value.length > 5) {
                return moment(value).format('MM.DD HH:mm');
              }
              return value;
            },
          },
          axisPointer: {
            label: {
              show: false,
            },
          },
          //刻度线
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(240, 240, 240, 1)',
            },
          },
        },
      ],
      /*yAxis: [
        {},
        {
          gridIndex: 1,
        },
      ],*/
      yAxis: [
        {
          type: 'value',
          name: '人数',
          position: 'left',
          gridIndex: 0,
          alignTicks: true,
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(52,63,76,0.30)',
              width: '1',
            },
          },
          axisLabel: {
            color: 'var(--text-second-color)',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(240, 240, 240, 1)',
            },
          },
          nameTextStyle: {
            padding: [0, 42, 12, 0],
            color: 'var(--text-second-color)',
          },
          axisPointer: {
            type: 'none',
            label: {
              show: false,
            },
          },
        },
        {
          type: 'value',
          name: '成交金额 (元)',
          position: 'right',
          gridIndex: 0,
          alignTicks: true,
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(52,63,76,0.30)',
              width: '1',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(240, 240, 240, 1)',
            },
          },
          nameTextStyle: {
            padding: [0, 0, 12, 28],
            color: 'var(--text-second-color)',
          },
          axisPointer: {
            type: 'none',
            label: {
              show: false,
            },
          },
          axisLabel: {
            color: 'var(--text-second-color)',
            formatter(value: any) {
              if (unitYStr.value === AxisUnit.wan) {
                if (value) {
                  return parseInt(value, 10) / 10000;
                }
              }
              return value;
            },
          },
        },
        { singleAxisIndex: 1 },
        { singleAxisIndex: 2 },
        { singleAxisIndex: 3 },
      ],
      grid: [
        { bottom: '45%', top: 50, left: 60, right: 58, containLabel: false },
        {
          top: '45%',
        },
      ],
      title: title,
      singleAxis: singleAxis,
      series: [] as any[],
    });
    const videoData = ref({ currentTime: 0 });
    const currentIndex = ref(-1);
    const currentTime = ref<any>(0);
    const startTime = ref(0);
    const endTime = ref(0);
    const selectClick = (params: any) => {
      const titleStr = params.name || '';
      const arr = projectData.value.trend_date || [];
      const index = arr.findIndex((it: string) => it === titleStr);
      currentIndex.value = index;
      if (projectData.value.video_start_second[index] === null) {
        currentTime.value = null;
      } else {
        currentTime.value = projectData.value.video_start_second[index];
        videoData.value = {
          currentTime: currentTime.value || 0,
        };
      }
      getNewPerfromance();
    };
    const videoStudyTime = (currentTimeIndex: number) => {
      currentTime.value = currentTimeIndex || 0;
      const findindex =
        parseInt(String(currentTime.value / 60), 10) < 1
          ? 1
          : parseInt(String(currentTime.value / 60), 10);
      const isfind = ref(false);
      for (
        let index = findindex - 1;
        index < projectData.value.video_start_second.length - 1;
        index++
      ) {
        const startTimeInt = projectData.value.video_start_second[index];
        const endTimeInt = projectData.value.video_end_second[index];
        //判断中间
        if (
          startTimeInt !== null &&
          endTimeInt !== null &&
          currentTime.value < endTimeInt &&
          currentTime.value >= startTimeInt
        ) {
          currentIndex.value = index;
          isfind.value = true;
          break;
        }
        //初始不是0
        if (startTimeInt !== null && currentTime.value <= startTimeInt) {
          currentIndex.value = index;
          isfind.value = true;
          break;
        }
      }
      if (isfind.value === false) {
        currentIndex.value = 0;
      }
      getNewPerfromance();
    };
    const getNewPerfromance = () => {
      if (currentIndex.value < trend_date.value.length - 1) {
        // currentIndex.value = currentIndex.value + 1;
        const data: any = projectData.value.explain[currentIndex.value];
        if (data) {
          startTime.value = data.video_start_second || 0;
          endTime.value = data.video_end_second || 0;
          getOneShop({
            is_from_project: from_project || false,
            shop_live_id: props.performanceId,
            product_id: data.product_id,
            product_start_time: data.start_time,
            start_time: data.start_time,
            end_time: data.end_time,
          });
        } else if (currentTime.value === null) {
          projectShop.value = null;
        } else if (
          currentTime.value >= endTime.value ||
          currentTime.value < startTime.value ||
          projectShop.value === null
        ) {
          const findData = (projectData.value.explain || []).find((item: any) => {
            if (!item) {
              return false;
            }
            const startTimeInt = item.video_start_second || 0;
            const endTimeInt = item.video_end_second || 0;
            return currentTime.value >= startTimeInt && currentTime.value < endTimeInt;
          });
          if (findData) {
            startTime.value = findData.video_start_second || 0;
            endTime.value = findData.video_end_second || 0;
            getOneShop({
              is_from_project: from_project || false,
              shop_live_id: props.performanceId,
              product_id: findData.product_id,
              product_start_time: findData.start_time,
              start_time: findData.start_time,
              end_time: findData.end_time,
            });
          } else {
            projectShop.value = null;
            getOneShopKoiId({
              is_from_project: from_project || false,
              shop_live_id: props.performanceId,
              live_start_time: projectData.value.trend_date[currentIndex.value],
            });
          }
        }
      }
    };
    const { formatPriceToThousandformatAmount } = formatPriceForm;
    const loading = ref(false);
    const projectDetail = ref({});
    const projectShop = ref<any>(null);
    const unitYStr = ref('');
    const trend_date = ref<any[]>([]);
    const projectData = ref<any>({});
    const project_shop_id = ref('');
    const project_shop_time = ref('');
    const project_shop_koi = ref('');
    const { business_type } = useProjectBaseInfo();
    const getShopLiveData = () => {
      GetShopLivePerfromanceScreen(
        {
          is_from_project: from_project || false,
          shop_live_id: props.performanceId,
        },
        business_type.value,
      ).then(({ data }) => {
        loading.value = false;
        if (data.success) {
          projectDetail.value = JSON.stringify(data.data) === '{}' ? undefined : data.data;
          ctx.emit('getProjectDeatil', projectDetail.value);
        } else {
          projectDetail.value = {};
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      GetShopLivePerfromanceTrendList(
        {
          shop_live_id: props.performanceId,
          is_from_project: from_project || false,
        },
        business_type.value,
      ).then(({ data }) => {
        loading.value = false;
        unitYStr.value = '';
        if (data.success) {
          projectData.value = data.data;
          series.value[0].data = (data.data.shelve || []).map((item: any) => {
            return item ? 10 : 0;
          });
          series.value[1].data = (data.data.explain || []).map((item: any) => {
            return item ? 10 : 0;
          });
          series.value[2].data = (data.data.note || []).map((item: any) => {
            return item ? 10 : 0;
          });
          series.value[3].data = (data.data.online_user_cnt || []).map((item: number) => {
            return item || 0;
          });
          series.value[4].data = (data.data.watch_ucnt || []).map((item: number) => {
            return item || 0;
          });
          series.value[5].data = (data.data.min_gmv || []).map((item: number) => {
            return item / 100 || 0;
          });
          (data.data.min_gmv || []).forEach((item: number) => {
            const watch_num = item || 0;
            const iswantype = Number(watch_num) > 1000000 ? true : false;
            if (iswantype) {
              unitYStr.value = '万';
            }
          });
          baseOptions.value.yAxis[1].name =
            '成交金额 ' + (unitYStr.value ? '(' + unitYStr.value + ')' : '(元)');
          baseOptions.value.series = series.value;
          trend_date.value = data.data.trend_date;
          singleAxis[0].data = data.data.trend_date;
          singleAxis[1].data = data.data.trend_date;
          singleAxis[2].data = data.data.trend_date;
          baseOptions.value.singleAxis = singleAxis;
          baseOptions.value.xAxis[0].data = data.data.trend_date;
          const explaindata: any = data.data.explain[0];
          if (explaindata) {
            //有讲解的
            startTime.value = explaindata.video_start_second || 0;
            endTime.value = explaindata.video_end_second || 0;
            getOneShop({
              is_from_project: from_project || false,
              shop_live_id: props.performanceId,
              product_id: explaindata.product_id,
              product_start_time: explaindata.start_time,
            });
          } else {
            getOneShopKoiId({
              is_from_project: from_project || false,
              shop_live_id: props.performanceId,
              live_start_time: data.data.trend_date[0],
            });
          }
        } else {
          projectData.value = {};
          projectShop.value = null;
          baseOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getShopLiveData();
    const getOneShop = (payload: any) => {
      project_shop_id.value = payload.product_id || '';
      project_shop_time.value = payload.product_start_time
        ? moment(payload.product_start_time).format('YYYY.MM.DD HH:mm')
        : '';
      GetShopLivePerfromanceProductDetail(payload, business_type.value).then(({ data }) => {
        if (data.success) {
          projectShop.value = data.data;
        } else {
          projectShop.value = null;
        }
        getOneShopKoiId({
          is_from_project: from_project || false,
          shop_live_id: props.performanceId,
          live_start_time: payload.product_start_time,
        });
      });
    };
    const getOneShopKoiId = (payload: any) => {
      GetShopLivePerfromanceKoiDetail(payload, business_type.value).then(({ data }) => {
        if (data.success) {
          project_shop_koi.value = data.data.kol_name || '';
        } else {
          project_shop_koi.value = '';
        }
      });
    };
    watch(
      () => [props.updata, props.performanceId],
      () => {
        getShopLiveData();
      },
    );

    return {
      project_shop_koi,
      project_shop_time,
      project_shop_id,
      projectData,
      trend_date,
      projectShop,
      projectDetail,
      getShopLiveData,
      loading,
      formatPriceToThousandformatAmount,
      currentIndex,
      videoStudyTime,
      videoData,
      selectClick,
      baseOptions,
      formatAmount,
      transformSecond,
      from_project,
    };
  },
});
