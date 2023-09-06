import lodash from '@/utils/lodash/custom';

import { ProjectAe } from '@/types/tiange/marketing/project';
import { defineComponent, PropType, ref, watch } from '@vue/composition-api';
import { MarketingProjectAeForm } from '@/types/tiange/marketing/ae';
import { SaveMarketingProjectAe } from '@/services/marketing.project';
import { sleep } from '@/utils/func';
import { getPositiveNumber } from '@/utils/string';
import { GetUser } from '@/services/system';

const { debounce } = lodash;

export default defineComponent({
  name: 'TgMarketingAeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ProjectAeList: {
      type: Array as PropType<ProjectAe[]>,
    },
  },
  setup(props, ctx) {
    const ProjectCooperationId = ref(-1);
    try {
      ProjectCooperationId.value = parseInt(ctx.root.$route.params.id, 10);
    } catch {
      ProjectCooperationId.value = -1;
    }

    const ProjectAeForm = ref<MarketingProjectAeForm>({
      cooperation_id: ProjectCooperationId.value,
      ae_infos: [],
    });

    /** 删除一栏 */
    const removeItemHandler = (index: number) => {
      if (ProjectAeForm.value.ae_infos.length > 1) {
        ProjectAeForm.value.ae_infos.splice(index, 1);
      }
    };

    /** 添加一栏 */
    const addItemHandler = () => {
      ProjectAeForm.value.ae_infos.push({ ae_id: '', ae_name: '', expect_amount: '' });
    };

    /** 重置表单 */
    const resetProjectAeForm = () => {
      ProjectAeForm.value.ae_infos = [{ ae_id: '', ae_name: '', expect_amount: '' }];
      NotExistsAeIdList.value = [];
    };

    const inputPositiveNumber = (value: string, index: number) => {
      const result = getPositiveNumber(value);
      ProjectAeForm.value.ae_infos[index].expect_amount = result;
    };

    const onCloseBtnClick = () => {
      resetProjectAeForm();
      ctx.emit('dialog:close');
    };
    const saveLoading = ref(false);

    const submit = async () => {
      if (saveLoading.value) {
        return;
      }

      if (ProjectAeForm.value.cooperation_id === -1) {
        ctx.root.$message.error('无效的项目ID');
        return;
      }

      if (ProjectAeForm.value.ae_infos.length < 1) {
        ctx.root.$message.error('请指定AE');
        return;
      }

      const ae_err_msg = ref('');

      ProjectAeForm.value.ae_infos.forEach((el, index) => {
        if (!el.ae_id) {
          ae_err_msg.value = '请选择AE';
          return;
        }

        if (!el.expect_amount) {
          ae_err_msg.value = '请输入跟单金额';
          return;
        } else if (el.expect_amount === '0') {
          ae_err_msg.value = '跟单金额不能为0';
          return;
        }
      });
      if (ae_err_msg.value) {
        ctx.root.$message.error(ae_err_msg.value);
        return;
      }

      const payload: MarketingProjectAeForm = {
        cooperation_id: ProjectAeForm.value.cooperation_id,
        ae_infos: ProjectAeForm.value.ae_infos,
      };

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveMarketingProjectAe(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);

        ctx.root.$store.dispatch('marketing/setProjectInfo', -1);
      } else {
        ctx.root.$message.error(response.message ?? 'AE保存失败');
      }
    };

    /** Ae列表 */

    /** 是否不再是客户经理ID */
    const NotExistsAeIdList = ref<number[]>([]);

    const AeUserList = ref<{ id: number; username: string }[]>([]);
    const getAllAeList = async (val: string) => {
      if (val) {
        const { data: response } = await GetUser({
          /*roles: '1008',
              business_type: BusinessTypeEnum.marketing,*/
          search_type: 2,
          search_value: val,
          is_checked: 1,
        });
        AeUserList.value = response.success ? response.data.data : [];
        const AeIdList = AeUserList.value.map(el => el.id.toString());

        props.ProjectAeList?.map(el => {
          if (!AeIdList.includes(el.ae_id.toString())) {
            const ae_id = parseInt(el.ae_id.toString(), 10);
            NotExistsAeIdList.value.push(ae_id);
            AeUserList.value.push({ id: ae_id, username: el.ae_name });
          }
        });
      } else {
        const AeIdList = AeUserList.value.map(el => el.id.toString());
        props.ProjectAeList?.map(el => {
          if (!AeIdList.includes(el.ae_id.toString())) {
            const ae_id = parseInt(el.ae_id.toString(), 10);
            NotExistsAeIdList.value.push(ae_id);
            AeUserList.value.push({ id: ae_id, username: el.ae_name });
          }
        });
      }
    };

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          getAllAeList('');
          /** 编辑ae表单 数据填充 */
          // if (props.ProjectAeList !== undefined) {
          ProjectAeForm.value.cooperation_id = ProjectCooperationId.value;

          ProjectAeForm.value.ae_infos = props.ProjectAeList?.length
            ? JSON.parse(JSON.stringify(props.ProjectAeList))
            : [{ ae_id: '', ae_name: '', expect_amount: '' }];
          // }
        }
      },
    );

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    return {
      NotExistsAeIdList,
      inputPositiveNumber,
      AeUserList,
      getAllAeList,
      // onSelectedCustomerChange,
      ProjectAeForm,
      saveLoading,
      onCloseBtnClick,
      onSaveBtnClick,
      addItemHandler,
      removeItemHandler,
    };
  },
});
