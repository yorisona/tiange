import {
  onMounted,
  reactive,
  toRefs,
  inject,
  defineComponent,
  ref,
  computed,
  h,
} from '@vue/composition-api';
import type { ComputedRef } from '@vue/composition-api';
import userSearch from '@/components/system-set/user/userSearch.vue';
import addUser from '@/components/system-set/user/addUser.vue';
import batchAuthorization from '@/components/system-set/user/batchAuthorization.vue';
import editAuthorization from '@/components/system-set/user/editAuthorization.vue';
import tablePagination from '@/components/table-components/table-pagination.vue';
import { enumBussinessType, enumUserStatus } from '@/utils/enumFunc';
import { GetUsers } from '@/services/system';
import type { UserInfo } from '@/types/tiange/system';
import type { UserListFilterForm, UserListQueryParams } from '@/types/tiange/system/user';
import { sleep } from '@/utils/func';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import getRectHeightData from './autoHeight';
import { useDialog } from '@/use/dialog';

export default defineComponent({
  components: {
    userSearch,
    addUser,
    tablePagination,
  },
  setup(props, ctx) {
    const Permission = inject<ComputedRef<Record<string, boolean>>>('Permission');
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const addUser = ref<null | {
      editClick: (user: UserInfo) => void;
      isDialog: boolean;
    }>(null);

    // 列表数据
    const tableData = reactive<any>({
      id: null, // 编辑用户id
      search_params: {
        page_num: 1,
        num: 20,
      }, // 搜索条件
      operateType: '新增', // 当前为新增还是编辑
      p_editData: {},
    });

    const loading = ref(false);

    const list = ref<UserInfo[]>([]);
    const total = ref(0);

    // 1. 获取列表数据方法
    const getData = async (params: UserListQueryParams, clean = true) => {
      if (clean) {
        tableData.search_params.page_num = 1;
      }

      const payload = { ...params, ...tableData.search_params };

      loading.value = true;
      const [{ data: response }] = await Promise.all([
        await GetUsers(payload),
        await sleep(Math.random() * 1000 + 500),
      ]);
      loading.value = false;

      if (response.success) {
        list.value = response.data.data;
        total.value = response.data.total;
      } else {
        list.value = [];
        total.value = 0;
      }
    };

    // 2. 点击表格编辑
    const tableRowClick = (row: UserInfo) => {
      tableData.operateType = '编辑';
      tableData.p_editData = row;
      tableData.id = row.id;
      dialogEditAuthorization.show(row);
      // if (addUser.value) {
      //   addUser.value.editClick(row);
      //   addUser.value.isDialog = true;
      // }
    };

    // 3. 搜索区域点击搜索回调方法
    const p_transmitSearchCallback = (search_params: UserListFilterForm) => {
      tableData.search_params = search_params;

      const { department_id, department_ids, job_id, ...rest } = search_params;

      const postData: UserListQueryParams = {
        ...rest,
        department_ids:
          Array.isArray(department_ids) && department_ids.length > 0
            ? department_ids.join(',')
            : undefined,
        job_id: job_id === '' ? undefined : job_id,
        department_id: department_id === '' ? undefined : department_id,
        business_type: search_params.business_type === '' ? undefined : search_params.business_type,
        is_checked: search_params.is_checked === '' ? undefined : search_params.is_checked,
      };

      getData(postData);
    };

    // 4. 搜索区域重置
    const p_transmitResetCallback = () => {
      tableData.search_params = {};
      tableData.search_params.page_num = 1;
      tableData.search_params.num = 20;
      getData(tableData.search_params);
    };

    // 5. 分页操作
    const p_currentChange = (currentPage: number) => {
      tableData.search_params.page_num = currentPage;
      getData(tableData.search_params, false);
    };

    const handlePageSizeChange = (pageSize: number) => {
      tableData.search_params.num = pageSize;
      getData(tableData.search_params);
    };

    onMounted(() => {
      getData({});
    });

    /** 手机号渲染hanshu  */
    const phone_render = (row: UserInfo) => row.phone ?? '--';

    const phone_max_length = max_length_of_column(list, '手机号', phone_render);

    /** 花名渲染函数 */
    const user_name_render = <T extends boolean>(row: UserInfo, text_only: T) => {
      const data = row.username || '--';

      const { is_folded, folded_text } = get_limited_length_string(data, 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('span', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };
    /** 花名最大宽度 */
    const user_name_max_length = max_length_of_column(list, '花名', user_name_render);

    /** 部门渲染函数 */
    const department_name_render = <T extends boolean>(row: UserInfo, text_only: T) => {
      const data = row.department_info?.department_name || '--';

      const { is_folded, folded_text } = get_limited_length_string(data, 30);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('span', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };
    /** 部门最大宽度 */
    const department_name_max_length = max_length_of_column(list, '部门', department_name_render);
    console.log(department_name_max_length);
    /** 岗位渲染函数 */
    const job_name_render = <T extends boolean>(row: UserInfo, text_only: T) => {
      const data = row.job_info?.job_name || '--';

      const { is_folded, folded_text } = get_limited_length_string(data, 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('span', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };
    /** 岗位最大宽度 */
    const job_name_max_length = max_length_of_column(list, '岗位', job_name_render);

    /** 业务类型渲染函数 */
    // const bussiness_type_render = (row: UserInfo) =>
    //   row.business_type
    //     .map(item => enumBussinessType(item))
    //     .map(item => (item as { label: string })?.label)
    //     .join('、') || '--';

    /** 业务类型最大宽度 */
    // const bussiness_type_max_length = max_length_of_column(list, '业务类型', bussiness_type_render);

    const columns = computed<TableColumn<UserInfo>[]>(() => [
      {
        label: '用户头像',
        minWidth: phone_max_length.value,
        align: 'center',
        formatter: row => {
          return row.avatar
            ? h('img', {
                domProps: {
                  src: row.avatar,
                },
                style: 'width: 48px; height: 48px; border-radius: 50%;vertical-align: middle;',
              })
            : h('tg-icon', {
                props: { name: 'ico-default-avatar' },
                style: 'width: 48px; height: 48px;vertical-align: middle;',
              });
        },
      },
      {
        label: '手机号',
        minWidth: phone_max_length.value,
        formatter: phone_render,
      },
      {
        label: '花名',
        align: 'center',
        minWidth: user_name_max_length.value,
        formatter: row => user_name_render(row, false),
      },
      {
        label: '工号',
        minWidth: 120,
        align: 'center',
        formatter: row => row.work_id || '--',
      },
      {
        label: '部门',
        minWidth: department_name_max_length.value,
        formatter: row => department_name_render(row, false),
      },
      {
        label: '岗位',
        minWidth: job_name_max_length.value,
        formatter: row => job_name_render(row, false),
      },
      {
        label: '直接主管',
        align: 'center',
        minWidth: 80,
        formatter: (row: any) => row.leader?.name,
      },
      // {
      //   label: '业务类型',
      //   minWidth: bussiness_type_max_length.value,
      //   formatter: bussiness_type_render,
      // },
      {
        label: '状态',
        minWidth: 78,
        align: 'center',
        formatter: row => {
          if (!enumUserStatus(row.is_checked)) {
            return '--';
          }
          return h(
            'div',
            {
              style: {
                justifyContent: 'center',
                width: '100%',
                display: 'flex',
              },
            },
            [
              h(
                'div',
                {
                  class: row.is_checked === 2 ? 'status-style status-style-stop' : 'status-style',
                  style: {
                    justifyContent: 'center',
                    display: 'flex',
                  },
                },
                [
                  h('img', {
                    domProps: {
                      src: (enumUserStatus(row.is_checked) as { img: string })?.img,
                    },
                  }),
                  h(
                    'span',
                    {
                      style: {
                        paddingLeft: '5px',
                      },
                      class: row.is_checked === 2 ? 'stop' : '',
                    },
                    [(enumUserStatus(row.is_checked) as { label: string })?.label],
                  ),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '创建时间',
        align: 'center',
        minWidth: 158,
        formatter: row => row.gmt_create.replace(/-/g, '.') || '--',
      },
      {
        label: '最后登录',
        minWidth: 158,
        align: 'center',
        formatter: row => row.last_login_time_str.replace(/-/g, '.') || '--',
      },
      {
        label: '操作',
        minWidth: 52,
        fixed: 'right',
        formatter: row => {
          const userinfo: any = ctx.root.$store.getters['user/getUserInfo'];
          //!Permission?.value.canEditUser
          if (userinfo.id === row.id && !Permission?.value.canEditUser) {
            return '--';
          }
          return h(
            'tg-button',
            {
              props: {
                type: 'link',
              },
              on: {
                click: () => tableRowClick(row),
              },
            },
            ['编辑'],
          );
        },
      },
    ]);

    /* 批量授权 */
    const dialogAuthorization = useDialog({
      component: batchAuthorization,
      title: '批量授权',
      width: '1000px',
      okText: '确定',
      props: {},
      on: {
        submit() {
          getData(tableData.search_params);
          dialogAuthorization.close();
        },
      },
    });
    /* 编辑用户权限 */
    const dialogEditAuthorization = useDialog({
      component: editAuthorization,
      title: '编辑用户权限',
      width: '520px',
      okText: '确定',
      props: {},
      on: {
        submit() {
          getData(tableData.search_params);
          dialogEditAuthorization.close();
        },
      },
    });
    return {
      Permission,
      ...toRefs(tableData),
      loading,
      getData,
      enumBussinessType,
      enumUserStatus,
      p_transmitSearchCallback,
      p_transmitResetCallback,
      p_currentChange,
      tableRowClick,
      handlePageSizeChange,
      addUser,
      list,
      total,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      columns,
      dialogAuthorization,
    };
  },
});
