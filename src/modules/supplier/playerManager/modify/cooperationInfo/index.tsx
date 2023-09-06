import { defineComponent, ref } from '@vue/composition-api';
import cooperationInfo from '@/modules/supplier/playerManager/detail/cooperationInfo/index.vue';
import supplierService from '@/services/supplier';
import dialogCooperation from '@/modules/supplier/playerManager/common/dialogCooperation/index.vue';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { Message } from 'element-ui';
export default defineComponent({
  components: {
    cooperationInfo,
    dialogCooperation,
  },
  setup(props, ctx) {
    const verifyStatus = ref(null);
    const info = ref<{
      cooperations: any;
      id?: string;
    }>({ cooperations: [] });
    const dialogCooperationRef = ref<{ show: (...arg: any) => void }>();
    const router = useRouter();
    const anchor_id = router.currentRoute.params.id;

    const operation = {
      isEdit: true,
      add: async () => {
        if (verifyStatus.value !== 2) {
          ctx.root.$message.warning('主播信息未通过审核，不允许新增合作');
          return false;
        }
        dialogCooperationRef.value?.show('新增合作', {});
      },
      edit: (info: any) => {
        const params = {
          ...info,
          coop_dates: [info.start_date, info.end_date],
        };
        dialogCooperationRef.value?.show('编辑合作', params);
      },
      del: async (id: string) => {
        const result = await AsyncConfirm(ctx, '确定删除合作?');
        if (!result) return;
        supplierService
          .GetDeleteAnchorCooperation(id)
          .then(() => {
            Message.success('删除成功');
            query();
          })
          .catch(ex => {
            Message.error(ex.message);
          });
      },
    };

    info.value = {
      cooperations: [],
      id: anchor_id,
    };

    const query = () => {
      supplierService.GetListAnchorCooperations(anchor_id).then(res => {
        info.value.cooperations = res;
      });
      supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
        verifyStatus.value = res.verify_status;
      });
    };
    const save = (params: any) => {
      return supplierService.PostAnchorCooperation(params).then(() => {
        query();
      });
    };
    query();
    return {
      operation,
      dialogCooperationRef,
      info,
      save,
      query,
      anchor_id,
    };
  },

  render() {
    return (
      <div>
        <cooperationInfo operation={this.operation} info={this.info} />;
        <dialogCooperation
          ref="dialogCooperationRef"
          save={async (value: any) => {
            const params = { ...value, anchor_info_id: this.anchor_id };
            if (value.settlement_type === 1) {
              delete params.base_salary;
              delete params.commission_rate;
            } else {
              delete params.hourly_wage;
            }
            params.start_date = moment(value.coop_dates[0]).format('YYYY-MM-DD');
            params.end_date = moment(value.coop_dates[1]).format('YYYY-MM-DD');
            delete params.coop_dates;
            return this.save(params);
          }}
        />
      </div>
    );
  },
});
