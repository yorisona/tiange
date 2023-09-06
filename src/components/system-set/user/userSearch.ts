/**
 * @Author: 矢车
 * @Date: 2020-12-28 13:33:26
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-21 17:33:22
 * @Description: 用户列表搜索参数
 */
import {
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  defineComponent,
  inject,
  ComputedRef,
} from '@vue/composition-api';
import {
  searchEnumBussinessType as enumBussinessType,
  searchEnumUserStatus as enumUserStatus,
} from '@/utils/enumFunc';
import { getFeishuDepartmentTree, getJobList, userExport } from '@/api/system';
import { popoverShow, popoverHide, selectControlPopoverHide } from '@/utils/tree-other';
import singleTrees from '@/components/system-set/trees/singleTrees.vue';

export default defineComponent({
  components: {
    singleTrees,
  },
  /**
   * transmitSearchCallback: 搜索回调
   * transmitResetCallback: 重置回调
   */
  emits: ['transmitSearchCallback', 'transmitResetCallback'],
  setup(props, ctx) {
    const Permission = inject<ComputedRef<Record<string, boolean>>>('Permission');
    const searchData = reactive({
      /** 要提交的搜索参数 */
      search_params: {
        num: 20,
        page_num: 1,
        search_type: 2, // 花名
        search_value: null, // 搜索值
        department_id: null, // 部门id
        job_id: '', // 岗位id
        business_type: '', // 业务类型
        is_checked: null, // 状态
        job_name: '', // 岗位名称
      },
      // 其他需用到但不需要提交的字段
      search_other_params: {
        job_name: '',
        department_name: '', // 当前选择的部门名字
        job_list: [], // 岗位数据
      },
      // 部门树结构数据
      treeData: [],
    });
    const QueryFormCopy = ref<any>({});
    onMounted(() => {
      getDepartmenttree();
    });
    const isDisabled = computed(() => {
      if (QueryFormCopy.value.search_value) return false;
      else if (QueryFormCopy.value.department_id) return false;
      else if (QueryFormCopy.value.job_name) return false;
      else if (QueryFormCopy.value.is_checked) return false;
      return true;
    });
    /** 1. 获取部门树 */
    const getDepartmenttree = async () => {
      const res = await getFeishuDepartmentTree();
      if (res.data.success) {
        searchData.treeData = res.data.data;
      }
    };

    /** 2. 获取子组件选择传来的部门数据 */
    const p_handleTreeDataCall = (departmentData: { department_name: string; id: null }) => {
      searchData.search_other_params.department_name = departmentData.department_name;
      searchData.search_params.department_id = departmentData.id;
      // 获取岗位数据
      // searchData.search_params.job_id = null;
      // getJobLists();
    };

    /** 3. 获取岗位数据 */
    const getJobLists = async (job_name: string) => {
      const res = await getJobList({
        job_name: job_name,
        // department_id: searchData.search_params.department_id,
      });
      if (res.data.success) {
        searchData.search_other_params.job_list = res.data.data;
      }
    };

    /** 选中岗位时 */
    const onJobIdChange = (job_id: string) => {
      searchData.search_params.job_id = job_id;
    };

    /** 4. 用来点击重置的时候清空数据(深拷贝) */
    const temp_searchParams = Object.assign({}, searchData.search_params);
    const temp_searchOtherParams = Object.assign({}, searchData.search_other_params);

    /** 5. 点击搜索 */
    const transmitSearch = () => {
      searchData.search_params.page_num = 1;
      ctx.emit('transmitSearchCallback', searchData.search_params);
      QueryFormCopy.value = { ...searchData.search_params };
    };

    /** 6. 点击重置 */
    const transmitReset = () => {
      // 重置数据
      Object.assign(searchData.search_params, temp_searchParams);
      Object.assign(searchData.search_other_params, temp_searchOtherParams);
      QueryFormCopy.value = {};
      getDepartmenttree();
      ctx.emit('transmitResetCallback');
      // 清除树节点选中状态
      (ctx.refs.singleTree as unknown as { resetCheck: () => void }).resetCheck();
    };
    const exportBtnClick = () => {
      const param = {
        ...searchData.search_params,
      };
      userExport(param);
    };
    return {
      onJobIdChange,
      ...toRefs(searchData),
      enumBussinessType,
      enumUserStatus,
      transmitSearch,
      transmitReset,
      p_handleTreeDataCall,
      getDepartmenttree,
      getJobLists,
      selectControlPopoverHide,
      popoverShow,
      popoverHide,
      exportBtnClick,
      isDisabled,
      Permission,
    };
  },
});
