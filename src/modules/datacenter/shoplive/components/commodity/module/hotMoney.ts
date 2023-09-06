import { computed, reactive } from '@vue/composition-api';
/*
 * @Author       : yunie
 * @Date         : 2022-07-19 09:38:25
 * @LastEditTime : 2022-07-26 16:37:28
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\hotMoney.ts
 * @Description  :
 */
import { defineComponent, onBeforeMount, ref, Ref, inject, watch } from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { RouterDataCenter } from '@/const/router';
// import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import {
  IWeekPopularParams,
  // IThirdCategory,
  IHotEveryWeek,
} from '@/modules/datacenter/commodityAnalysis/types';
// import { HotStyleEveryWeek } from '@/services/datacenter'; //GetTiangeDouyinThirdCategory
import { GetHotStyleRegion as HotStyleEveryWeek } from '@/services/datacenter/shoplive';
import Table from './hotTable.vue';
import { wait } from '@/utils/func';
import html2canvas from 'html2canvas';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const routes = [
  {
    name: RouterDataCenter.commodityAnalysis,
    title: '品牌商品分析',
  },
  {
    path: '',
    title: '每周爆款对比',
  },
];

const colors = [
  '#fdf9df',
  '#e9f9fc',
  '#f0f8f3',
  '#eff3fd',
  '#fef3e7',
  '#fef0fb',
  '#e5fdf3',
  '#deedff',
  '#f5f4da',
  '#fee2e2',
];

export default defineComponent({
  name: 'TgCommodityAnalysisWeekPopular',
  components: { Table },
  props: {
    catId: {
      type: [Number],
      default: undefined,
    },
    catName: {
      type: String,
      default: '合计',
    },
    isSecond: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    // const router = useRouter();
    // const { project_id } = router.currentRoute.query;
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;

    const project_name = inject('searchProjectName') as Ref<string>;
    //@ts-ignore
    const queryForm = reactive<any>({
      project_id: computed(() => {
        return searchParams.value.project_id;
      }),
      is_from_project: searchParams.value.is_from_project,
      project_name: project_name,
      sort: 'shop_sale_gmv',
      // start_date: moment().weekday(-7).format('YYYY-MM-DD'),
      start_date: computed(() => {
        return searchParams.value.start_date;
      }),
      end_date: computed(() => {
        return searchParams.value.end_date;
      }),
      third_tiange_cat_id: props.catId,
    });
    // const queryForm = computed(() => {
    //   return reactive({
    //     project_id: searchParams.value.project_id,
    //     project_name: project_name,
    //     sort: 'shop_gmv',
    //     // start_date: moment().weekday(-7).format('YYYY-MM-DD'),
    //     start_date: moment(searchParams.value.start_date).weekday(-7).format('YYYY-MM-DD'),
    //     third_tiange_cat_id: '',
    //   });
    // });
    // console.log();

    // const cateList = ref<IThirdCategory[]>([]);

    // const getCategory = async () => {
    //   const [{ data: response }] = await wait(500, GetTiangeDouyinThirdCategory());
    //   if (response.success) {
    //     cateList.value = response.data;
    //   } else {
    //     ctx.root.$message({
    //       type: 'warning',
    //       message: response.message ?? '查询失败，稍后重试',
    //       duration: 2000,
    //       showClose: true,
    //     });
    //   }
    // };

    const loading = ref(false);
    // const lastWeekNum = ref<string>(moment().weekday(-7).format('WW'));
    // const lastLastWeekNum = ref<string>(moment().weekday(-14).format('WW'));
    const lastLastData = ref<IHotEveryWeek[]>([]);
    const lastData = ref<IHotEveryWeek[]>([]);
    const lastWeekNum = computed(() => {
      if (searchParams.value.date_type === 'date') {
        return moment(searchParams.value.start_date).format('YYYY.MM.DD');
      } else if (searchParams.value.date_type === 'week') {
        console.log(searchParams.value.start_date, 'searchParams.value.start_date');

        return moment(searchParams.value.start_date).format('第WW周');
      } else {
        return moment(searchParams.value.start_date).format('YYYY-MM月');
      }
    });
    const lastLastWeekNum = computed(() => {
      if (searchParams.value.date_type === 'date') {
        return moment(searchParams.value.start_date).clone().add('-1', 'day').format('YYYY.MM.DD');
      } else if (searchParams.value.date_type === 'week') {
        return moment(searchParams.value.start_date).clone().add('-1', 'week').format('第WW周');
      } else {
        return moment(searchParams.value.start_date).clone().add('-1', 'month').format('YYYY-MM月');
      }
    });
    // 给列表样式赋值
    const rowColors = ({ row }: { row: any }) => {
      let styleJson: any = {};
      if (lastLastData.value.length > 0 && lastData.value.length > 0) {
        const preWeek = new Set(lastLastData.value);
        const nextWeek = new Set(lastData.value);
        // @ts-ignore
        const sameArr = [...nextWeek].filter(x => [...preWeek].some(y => y.item_id === x.item_id));
        sameArr.map((item: any, index: number) => {
          if (row.item_id && row.item_id === item.item_id) {
            styleJson = { 'background-color': `${colors[index]}` };
          }
        });
        return styleJson;
      }
    };
    const { business_type } = useProjectBaseInfo();
    const getList = async () => {
      const payload: IWeekPopularParams = {
        is_from_project: queryForm.is_from_project,
        project_id: queryForm.project_id,
        // start_date: moment(queryForm.start_date).weekday(-7).format('YYYY-MM-DD'),
        start_date: queryForm.start_date,
        end_date: queryForm.end_date,
        sort: queryForm.sort,
      };
      if (props.isSecond) {
        payload.second_tiange_cat_id = props.catId === 0 ? undefined : props.catId;
      } else {
        payload.third_tiange_cat_id = props.catId === 0 ? undefined : props.catId;
      }

      loading.value = true;
      const [{ data: response }] = await wait(500, HotStyleEveryWeek(payload, business_type.value));
      loading.value = false;
      if (response.success) {
        lastData.value = response.data.shop_live_douyin_items ?? [];
        lastLastData.value = response.data.last_region_shop_live_douyin_items ?? [];
        //@ts-ignore
        while (lastData.value.length < 10) {
          lastData.value.push({
            discount_price: 0,
            first_tiange_cat: '',
            first_tiange_cat_id: 0,
            image_url: '',
            item_id: 0,
            project_id: 0,
            last_week_rank: 0,
            season: 0,
            second_tiange_cat: '',
            second_tiange_cat_id: 0,
            shop_gmv: 0,
            shop_sale_count: 0,
            third_tiange_cat: '',
            title: '',
            year: 0,
            item_sn: '',
            shop_refund_status21_gmv: 0,
            shop_refund_status21_gmv_rate: 0,
          });
        }
        while (lastLastData.value.length < 10) {
          lastLastData.value.push({
            discount_price: 0,
            first_tiange_cat: '',
            first_tiange_cat_id: 0,
            image_url: '',
            item_id: 0,
            project_id: 0,
            last_week_rank: 0,
            season: 0,
            second_tiange_cat: '',
            second_tiange_cat_id: 0,
            shop_gmv: 0,
            shop_sale_count: 0,
            third_tiange_cat: '',
            title: '',
            year: 0,
            item_sn: '',
            shop_refund_status21_gmv: 0,
            shop_refund_status21_gmv_rate: 0,
          });
        }
        // lastLastData.value = lastLastData.value.map(() => {
        //   return {
        //     discount_price: 0,
        //     first_tiange_cat: '',
        //     first_tiange_cat_id: 0,
        //     image_url: '',
        //     item_id: 0,
        //     project_id: 0,
        //     last_week_rank: 0,
        //     season: 0,
        //     second_tiange_cat: '',
        //     second_tiange_cat_id: 0,
        //     shop_gmv: 0,
        //     shop_sale_count: 0,
        //     third_tiange_cat: '',
        //     title: '',
        //     year: 0,
        //     item_sn: '',
        //     shop_refund_status21_gmv: 0,
        //     shop_refund_status21_gmv_rate: 0,
        //   };
        // });
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onBeforeMount(() => {
      // getCategory();
      getList();
    });
    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        await getList();
      },
      { deep: true },
    );
    watch(
      () => props.catId,
      async () => {
        // if (data === undefined) return;
        await getList();
      },
      { deep: true },
    );
    const onSearchClick = () => {
      getList();
    };

    const onResetClick = (v: string) => {
      queryForm.sort = v;
      getList();
    };

    // const timeChange = (val: string) => {
    //   queryForm.start_date = moment(val).subtract(1, 'days').format('YYYY-MM-DD');
    //   lastWeekNum.value = moment(val).format('w');
    //   lastLastWeekNum.value = moment(val).weekday(-7).format('w');
    //   getList();
    // };
    const pickerOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(`${moment().weekday(-1).format('YYYY/MM/DD')} 00:00:01`).getTime() ||
          time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };

    const imageTofile = ref<HTMLElement | undefined>(undefined);
    const exprotImageLoading = ref(false);
    // const exportImage = async () => {
    //   exprotImageLoading.value = true;
    //   const createImage = () => {
    //     return new Promise<string>((resolve, reject) => {
    //       // 手动创建一个 canvas 标签
    //       const canvas = document.createElement('canvas');
    //       // 获取父标签，意思是这个标签内的 DOM 元素生成图片
    //       // imageTofile是给截图范围内的父级元素自定义的ref名称
    //       // let canvasBox = this.$refs.imageTofile
    //       const canvasBox = imageTofile.value;
    //       if (!canvasBox) {
    //         // exprotImageLoading.value = false;
    //         reject();
    //         return;
    //       }
    //       const scale = 1;
    //       // 获取父级的宽高
    //       // const width = parseInt(window.getComputedStyle(canvasBox).width, 10);
    //       // const height = parseInt(window.getComputedStyle(canvasBox).height, 10);
    //       const width = canvasBox.clientWidth;
    //       const height = canvasBox.clientHeight;
    //       // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
    //       canvas.width = width * scale;
    //       canvas.height = height * scale;
    //       canvas.style.width = width * scale + 'px';
    //       canvas.style.height = height * scale + 'px';
    //       const context = canvas.getContext('2d');

    //       if (!context) {
    //         // exprotImageLoading.value = false;
    //         reject();
    //         return;
    //       }
    //       context.scale(scale, scale);
    //       const options = {
    //         scale: scale,
    //         backgroundColor: 'white',
    //         canvas: canvas,
    //         useCORS: true,
    //         height: height,
    //         width: width,
    //       };

    //       html2canvas(canvasBox, options).then(
    //         canvas => {
    //           // toDataURL 图片格式转成 base64
    //           const dataURL = canvas.toDataURL('image/png');
    //           // downloadImage(dataURL)
    //           resolve(dataURL);
    //         },
    //         () => {
    //           reject();
    //         },
    //       );
    //     });
    //   };
    //   setTimeout(async () => {
    //     const image = await createImage();
    //     if (image) {
    //       downloadImage(image);
    //     }
    //     exprotImageLoading.value = false;
    //   }, 100);
    // };

    // const downloadImage = (url: string) => {
    //   // 如果是在网页中可以直接创建一个 a 标签直接下载
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = '每周爆款对比';
    //   a.click();
    // };

    return {
      routes,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      queryForm,
      // timeChange,
      onSearchClick,
      onResetClick,
      lastLastWeekNum,
      lastWeekNum,
      lastLastData,
      lastData,
      loading,
      rowColors,
      // cateList,
      pickerOptions,
      // exportImage,
      imageTofile,
      exprotImageLoading,
    };
  },
});
