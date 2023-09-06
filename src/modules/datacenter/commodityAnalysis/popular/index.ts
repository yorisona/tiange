import { defineComponent, inject, onBeforeMount, reactive, ref } from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import {
  IWeekPopularParams,
  IThirdCategory,
  IHotEveryWeek,
} from '@/modules/datacenter/commodityAnalysis/types';
import { HotStyleEveryWeek, GetTiangeDouyinThirdCategory } from '@/services/datacenter';
import Table from './table.vue';
import { wait } from '@/utils/func';
import html2canvas from 'html2canvas';

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
  setup(props, ctx) {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const router = useRouter();
    const { project_id, project_name } = router.currentRoute.query;
    const queryForm = reactive<IWeekPopularParams>({
      project_id: project_id,
      project_name: project_name,
      sort: 'shop_gmv',
      start_date: moment().weekday(-7).format('YYYY-MM-DD'),
      third_tiange_cat_id: '',
    });

    const cateList = ref<IThirdCategory[]>([]);

    const getCategory = async () => {
      const [{ data: response }] = await wait(500, GetTiangeDouyinThirdCategory());
      if (response.success) {
        cateList.value = response.data;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const loading = ref(false);
    const lastWeekNum = ref<string>(moment().weekday(-7).format('WW'));
    const lastLastWeekNum = ref<string>(moment().weekday(-14).format('WW'));
    const lastLastData = ref<IHotEveryWeek[]>([]);
    const lastData = ref<IHotEveryWeek[]>([]);

    // 给列表样式赋值
    const rowColors = ({ row }: { row: any }) => {
      let styleJson: any = {};
      if (lastLastData.value.length > 0 && lastData.value.length > 0) {
        const preWeek = new Set(lastLastData.value);
        const nextWeek = new Set(lastData.value);
        // @ts-ignore
        const sameArr = [...nextWeek].filter(x => [...preWeek].some(y => y.item_id === x.item_id));
        sameArr.map((item: any, index: number) => {
          if (row.item_id === item.item_id) {
            styleJson = { 'background-color': `${colors[index]}` };
          }
        });
        return styleJson;
      }
    };

    const getList = async () => {
      const payload: IWeekPopularParams = {
        project_id: queryForm.project_id,
        start_date: queryForm.start_date,
        sort: queryForm.sort,
        third_tiange_cat_id: queryForm.third_tiange_cat_id,
      };
      loading.value = true;
      const [{ data: response }] = await wait(500, HotStyleEveryWeek(payload));
      loading.value = false;
      if (response.success) {
        lastData.value = response.data.shop_live_douyin_items ?? [];
        lastLastData.value = response.data.last_week_shop_live_douyin_items ?? [];
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
      getCategory();
      getList();
    });

    const onSearchClick = () => {
      getList();
    };

    const onResetClick = () => {
      queryForm.start_date = moment().weekday(-7).format('YYYY-MM-DD');
      lastWeekNum.value = moment().weekday(-7).format('WW');
      lastLastWeekNum.value = moment().weekday(-14).format('WW');
      queryForm.third_tiange_cat_id = '';
      queryForm.sort = 'shop_gmv';
      getList();
    };

    const timeChange = (val: string) => {
      queryForm.start_date = moment(val).subtract(1, 'days').format('YYYY-MM-DD');
      lastWeekNum.value = moment(val).format('w');
      lastLastWeekNum.value = moment(val).weekday(-7).format('w');
      getList();
    };
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
    const exportImage = async () => {
      exprotImageLoading.value = true;
      const createImage = () => {
        return new Promise<string>((resolve, reject) => {
          // 手动创建一个 canvas 标签
          const canvas = document.createElement('canvas');
          // 获取父标签，意思是这个标签内的 DOM 元素生成图片
          // imageTofile是给截图范围内的父级元素自定义的ref名称
          // let canvasBox = this.$refs.imageTofile
          const canvasBox = imageTofile.value;
          if (!canvasBox) {
            // exprotImageLoading.value = false;
            reject();
            return;
          }
          const scale = 1;
          // 获取父级的宽高
          // const width = parseInt(window.getComputedStyle(canvasBox).width, 10);
          // const height = parseInt(window.getComputedStyle(canvasBox).height, 10);
          const width = canvasBox.clientWidth;
          const height = canvasBox.clientHeight;
          // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
          canvas.width = width * scale;
          canvas.height = height * scale;
          canvas.style.width = width * scale + 'px';
          canvas.style.height = height * scale + 'px';
          const context = canvas.getContext('2d');

          if (!context) {
            // exprotImageLoading.value = false;
            reject();
            return;
          }
          context.scale(scale, scale);
          const options = {
            scale: scale,
            backgroundColor: 'white',
            canvas: canvas,
            useCORS: true,
            height: height,
            width: width,
          };

          html2canvas(canvasBox, options).then(
            canvas => {
              // toDataURL 图片格式转成 base64
              const dataURL = canvas.toDataURL('image/png');
              // downloadImage(dataURL)
              resolve(dataURL);
            },
            () => {
              reject();
            },
          );
        });
      };
      setTimeout(async () => {
        const image = await createImage();
        if (image) {
          downloadImage(image);
        }
        exprotImageLoading.value = false;
      }, 100);
    };

    const downloadImage = (url: string) => {
      // 如果是在网页中可以直接创建一个 a 标签直接下载
      const a = document.createElement('a');
      a.href = url;
      a.download = '每周爆款对比';
      a.click();
    };

    return {
      onTopCardRectUpdate,
      ...tableHeightLogic,
      queryForm,
      timeChange,
      onSearchClick,
      onResetClick,
      lastLastWeekNum,
      lastWeekNum,
      lastLastData,
      lastData,
      loading,
      rowColors,
      cateList,
      pickerOptions,
      exportImage,
      imageTofile,
      exprotImageLoading,
    };
  },
});
