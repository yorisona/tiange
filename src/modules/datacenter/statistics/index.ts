import { defineComponent, ref, SetupContext } from '@vue/composition-api';
import DataSwitch from '@/modules/datacenter/components/switch/index.vue';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import DataCenterList from './table/index.vue';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import {
  GetCustomerSupplierManageTable,
  GetCustomerPayApplyTable,
  GetContractApplyTable,
  GetInvoiceApplyTable,
  GetSystemLoginTable,
  GetSettlementTable,
  GetProjectTable,
  GetShopLiveTable,
} from '@/services/datacenter';
import { BusinessType } from '@/const/common';

const useList = (ctx: SetupContext) => {
  const customerSupplierManageTableLoading = ref<boolean>(true);
  const customerPayApplyTableLoading = ref<boolean>(true);
  const contractApplyTableLoading = ref<boolean>(true);
  const invoiceApplyTableLoading = ref<boolean>(true);
  const systemLoginTableLoading = ref<boolean>(true);
  const settlementTableLoading = ref<boolean>(true);
  const projectTableLoading = ref<boolean>(true);
  const shopLiveTableLoading = ref<boolean>(true);

  const customerSupplierManageDataList = ref<string[]>([]);
  const customerPayApplyDataList = ref<string[]>([]);
  const contractApplyDataList = ref<string[]>([]);
  const invoiceApplyDataList = ref<string[]>([]);
  const systemLoginDataList = ref<string[]>([]);
  const settlementDataList = ref<string[]>([]);
  const projectDataList = ref<string[]>([]);
  const shopLiveDataList = ref<string[]>([]);

  const getData = async () => {
    {
      customerSupplierManageTableLoading.value = true;
      const { data } = await GetCustomerSupplierManageTable();
      if (data.success) {
        customerSupplierManageDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      customerSupplierManageTableLoading.value = false;
    }

    {
      customerPayApplyTableLoading.value = true;
      const { data } = await GetCustomerPayApplyTable();
      if (data.success) {
        customerPayApplyDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      customerPayApplyTableLoading.value = false;
    }
    {
      contractApplyTableLoading.value = true;
      const { data } = await GetContractApplyTable();
      if (data.success) {
        contractApplyDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      contractApplyTableLoading.value = false;
    }

    {
      invoiceApplyTableLoading.value = true;
      const { data } = await GetInvoiceApplyTable();
      if (data.success) {
        invoiceApplyDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      invoiceApplyTableLoading.value = false;
    }

    {
      systemLoginTableLoading.value = true;
      const { data } = await GetSystemLoginTable();
      if (data.success) {
        systemLoginDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      systemLoginTableLoading.value = false;
    }

    {
      settlementTableLoading.value = true;
      const { data } = await GetSettlementTable();
      if (data.success) {
        settlementDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      settlementTableLoading.value = false;
    }

    {
      projectTableLoading.value = true;
      const { data } = await GetProjectTable();
      if (data.success) {
        projectDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      projectTableLoading.value = false;
    }

    {
      shopLiveTableLoading.value = true;
      const { data } = await GetShopLiveTable();
      if (data.success) {
        shopLiveDataList.value = data.data;
      } else {
        ctx.root.$message.error(data.message);
      }
      shopLiveTableLoading.value = false;
    }
  };

  return {
    getData,
    customerSupplierManageTableLoading,
    customerPayApplyTableLoading,
    contractApplyTableLoading,
    invoiceApplyTableLoading,
    systemLoginTableLoading,
    settlementTableLoading,
    projectTableLoading,
    shopLiveTableLoading,
    customerSupplierManageDataList,
    customerPayApplyDataList,
    contractApplyDataList,
    invoiceApplyDataList,
    systemLoginDataList,
    settlementDataList,
    projectDataList,
    shopLiveDataList,
  };
};
export default defineComponent({
  components: { DataSwitch, DataCenterList, SelectDate },
  setup(props, ctx) {
    const mcnLogic = useList(ctx);
    const activeIndex = ref(0);
    const project_id = ref<any>('');
    const selectedDateType = ref(0);
    const selectedDateValue = ref('');
    const project_id_filter = ref<string>('');
    const currentDate = ref<string | null>(null);

    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    mcnLogic.getData();

    const viewDetail = (project: any) => {
      const router = useRouter();
      const { meta } = router.currentRoute;
      ctx.root.$router.push({
        name:
          meta?.activePath === '/datacenter/overview'
            ? RouterDataCenter.dataGeneralizationProject
            : RouterDataCenter.dataTaobaoProject,
        params: { id: project.id, businessType: '' + BusinessType.Taobao },
        query: {
          dateType: '' + selectedDateType.value,
          dateValue: selectedDateValue.value,
          projectName: project.title,
        },
      });
    };
    const onEnterPressSearch = () => {
      project_id_filter.value = project_id.value;
    };

    return {
      activeIndex,
      handleCheckTab,
      currentDate,
      selectedDateType,
      viewDetail,
      project_id,
      onEnterPressSearch,
      ...mcnLogic,
    };
  },
});
