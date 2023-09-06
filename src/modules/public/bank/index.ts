/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 16:23:46
 */
import { computed, defineComponent, h, onMounted, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import BankAccountAdd from './dialog/bank.account.add.vue';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { max_length_of_column } from '@/utils/table';
import { sleep } from '@/utils/func';
import { GetOurBankAccounts } from '@/services/finance';
import { AccountTypeMap, BankAccount } from '@/types/tiange/finance/finance';
import addAccount from '@/modules/public/bank/dialog/addAccount/index.vue';
import { AddAccountType } from '@/modules/public/bank/dialog/addAccount/index';
import { usePermission } from '@/use/permission';

export default defineComponent({
  components: {
    BankAccountAdd,
    addAccount,
  },

  setup(_, ctx) {
    const visible = ref<boolean>(false);

    const edit_bank = ref<BankAccount | undefined>(undefined);

    const loading = ref(false);

    const bank_list = ref<BankAccount[]>([]);
    const addAccountRef = ref<AddAccountType | undefined>(undefined);
    const permission = usePermission();

    const loadData = async () => {
      loading.value = true;
      const [_, { data: response }] = await Promise.all([
        await sleep(500),
        await GetOurBankAccounts(),
      ]);
      loading.value = false;
      if (response.success) {
        // @ts-ignore
        bank_list.value = response.data;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onMounted(() => {
      loadData();
    });

    const columns = computed<TableColumn<BankAccount>[]>(() => [
      {
        label: '序号',
        minWidth: 82,
        align: 'center',
        formatter: row => row.id,
      },
      {
        label: '账户名称',
        minWidth: 263,
        formatter: row => row.account_name,
      },
      {
        label: '账号',
        minWidth: max_length_of_column(bank_list, '账号', methods.account_render).value,
        formatter: row => methods.account_render(row, false),
      },
      {
        label: '账户类型',
        align: 'center',
        minWidth: max_length_of_column(bank_list, '账户类型', methods.account_type_rander).value,
        formatter: row => methods.account_type_rander(row, false),
      },
      {
        label: '账户别名',
        minWidth: max_length_of_column(bank_list, '开户银行', methods.bank_rander).value,
        formatter: row => methods.bank_rander(row, false),
      },
      {
        label: '开户行',
        minWidth: max_length_of_column(bank_list, '开户行', methods.account_bank_rander).value,
        formatter: row => methods.account_bank_rander(row, false),
      },
      {
        label: '联行号',
        minWidth: max_length_of_column(bank_list, '联行号', methods.accociate_bank_no_rander).value,
        formatter: row => methods.accociate_bank_no_rander(row, false),
      },
      {
        label: '状态',
        minWidth: 60,
        align: 'center',
        formatter: row => (row.status === 1 ? '停用' : '启用'),
      },
      {
        label: '操作',
        width: 60,
        align: 'center',
        formatter: row => {
          if (!permission.finance_account_modify) {
            return '';
          }
          return h(
            'tg-button',
            {
              props: {
                type: 'link',
              },
              on: {
                click: () => {
                  addAccountRef.value?.show(row);
                },
              },
            },
            '编辑',
          );
        },
      },
    ]);

    const methods = {
      addBankAccount: () => {
        visible.value = true;
      },
      onEditClose: () => {
        edit_bank.value = undefined;
      },
      autoResizeLogic: () => {
        // 自适应表格高度部分
        const buttonLineHeight = 32;
        const paginationLineHeight = 0;
        const rectPadding = 36;
        const otherHeight = 31;

        const topCardHeight = ref(0);
        const onTopCardRectUpdate = (rect: DOMRect) => {
          topCardHeight.value = rect.height;
        };

        const tableHeightLogic = useAutoTableHeightInCard({
          compensation: computed(
            () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
          ),
          fixedBlockHeightRefs: [0],
          tableMinHeight: 100,
        });
        return { onTopCardRectUpdate, tableHeightLogic };
      },
      /** 账号渲染函数 */
      account_render: (row: BankAccount, _: boolean) => {
        const account = row.account_number ?? '--';
        return account;
      },
      /** 开户银行渲染函数 */
      bank_rander: (row: BankAccount, _: boolean) => {
        const bank = row.bank_name ?? '--';
        return bank;
      },
      account_type_rander: (row: BankAccount, _: boolean) => {
        const bank = row.bank_type ? AccountTypeMap.get(row.bank_type) ?? '--' : '--';
        return bank;
      },
      /** 开户行渲染函数 */
      account_bank_rander: (row: BankAccount, _: boolean) => {
        const account_bank = row.bank_detail_name ?? '--';
        return account_bank;
      },
      /** 联行号渲染函数 */
      accociate_bank_no_rander: (row: BankAccount, _: boolean) => {
        const accoiation_bank_no = row.bank_code ?? '--';
        return accoiation_bank_no;
      },
    };

    const onAddAccountHandler = () => {
      addAccountRef.value?.show();
    };

    const onAccountSave = () => {
      loadData();
    };
    const { onTopCardRectUpdate, tableHeightLogic } = methods.autoResizeLogic();

    return {
      visible,
      columns,
      bank_list,
      onAddAccountHandler,
      ...methods,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      addAccountRef,
      edit_bank,
      onAccountSave,
      loading,
      permission,
    };
  },
});
