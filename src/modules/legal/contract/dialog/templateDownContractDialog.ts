import { defineComponent, inject, ref, watch } from '@vue/composition-api';
import { businessNewTypeOptions } from '@/const/options';
import { GetTemplateDownContractList } from '@/services/contract';
import { getToken } from '@/utils/token';
export default defineComponent({
  name: 'TemplateContract',
  props: {
    type: {
      type: String,
      default: 'live',
    },
  },
  setup(props, ctx) {
    // console.log(router.currentRoute.params.id);
    // const { isFromMarketing, isFromLive, isFromCommon } = useProjectBaseInfo();
    const project = inject<any>('project');
    const business_type = ref(project.value?.business_type);
    if (project.value?.cooperation_type === 2) {
      business_type.value = 4;
    }
    business_type.value = business_type.value === 8 ? 2 : business_type.value;
    const myToken = getToken();
    watch(
      () => {
        return project;
      },
      project => {
        if (project.value?.cooperation_type === 2) {
          business_type.value = 4;
        } else {
          business_type.value = project.value?.business_type;
          business_type.value = business_type.value === 8 ? 2 : business_type.value;
        }
      },
      {
        deep: true,
      },
    );
    const businessTypeOptions = ref(businessNewTypeOptions);
    const list = ref([]);
    return {
      myToken,
      no_upload_click: false,
      visible: false,
      business_type,
      businessTypeOptions,
      list,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show() {
      this.no_upload_click = true;
      this.visible = true;
      this.getList();
      this.$nextTick(() => {});
    },
    selectbusinesstypeChange(value: any) {
      this.business_type = value;
      this.getList();
    },
    selectlistChange(value: any) {
      window.open(value.file_url + '?Authorization=' + this.myToken);
    },
    async getList() {
      const { data: response } = await GetTemplateDownContractList(
        {
          status: '1',
          business_type: this.business_type,
        },
        this.type,
      );
      if (response.success) {
        const arr: any = response.data.data;
        this.list = arr;
      }
    },
  },
});
