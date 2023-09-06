import { defineComponent, ref } from '@vue/composition-api';
import { ContractSettlement } from '@/types/tiange/contract';
import {
  UpdateContractGeneral,
  AddContractGeneral,
  GetGeneralContractUid,
} from '@/services/contract';

export default defineComponent({
  name: 'projectFundStatement',
  setup(props, ctx) {
    const visible = ref(false);
    const saveLoading = ref(false);
    const contractForm = ref({
      contract_uid: '',
      business_types: [] as number[],
    });
    const new_type = ref(true);
    const methods = {
      show(row: { contract_uid: string; business_types: number[] } | null) {
        visible.value = true;
        contractForm.value = row ? row : contractForm.value;
        new_type.value = row ? false : true;
        getContract('');
      },
      onCloseHandler() {
        visible.value = false;
        contractForm.value = {
          contract_uid: '',
          business_types: [] as number[],
        };
      },
      async onSaveHandler() {
        saveLoading.value = true;
        let res;
        if (new_type.value) {
          res = await AddContractGeneral({
            ...contractForm.value,
          });
        } else {
          res = await UpdateContractGeneral({
            ...contractForm.value,
          });
        }
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('save');
          methods.onCloseHandler();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };
    const contract_id_list = ref<ContractSettlement[]>([]);
    const getContract = async (kw?: string) => {
      GetGeneralContractUid({
        contract_status: 2,
        release_status: 0,
        search: kw,
        only_main: 0,
      }).then(res => {
        console.log('---', res);
        if (res.data.success) contract_id_list.value = res.data.data.data;
      });
    };

    return {
      getContract,
      contract_id_list,
      new_type,
      projectTypeOption: E.project.ProjectTypeOption,
      saveLoading,
      contractForm,
      visible,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title={this.new_type ? '新增通用合同' : '编辑通用合同'}
          class="tg-dialog-classic tg-dialog-vcenter-new tg-income-claim-container"
          width="396px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form size="mini" label-width="70px">
            <el-form-item label="合同编号：">
              <div style="display: flex; align-items: center">
                <el-select
                  style="width: 286px"
                  popper-class="el-select-popper-mini"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  v-model={this.contractForm.contract_uid}
                  remote-method={this.getContract}
                  placeholder="请输入并选择"
                >
                  {this.contract_id_list.map((item: any) => {
                    /* return (
                      <el-option
                        key={item.contract_id}
                        label={
                          item.company_name +
                          '  (' +
                          item.sign_type_name +
                          ')  ' +
                          item.coop_start_date +
                          '-' +
                          item.coop_end_date
                        }
                        value={item.contract_id}
                      />
                    );*/
                    return (
                      <el-option
                        key={item.contract_id}
                        label={item.contract_uid}
                        value={item.contract_uid}
                      />
                    );
                  })}
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="适用范围：">
              <el-select
                popper-class="el-select-popper-mini"
                clearable
                style="width: 286px;"
                v-model={this.contractForm.business_types}
                placeholder="请选择"
                multiple
              >
                {this.projectTypeOption.map(el => (
                  <el-option
                    label={el.label}
                    value={el.value}
                    key={el.value + '____' + el.name}
                  ></el-option>
                ))}
                <el-option label={'淘宝店播'} value={2} key={2 + '____淘宝店播'}></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button type="primary" onClick={this.onSaveHandler}>
              保存
            </tg-button>
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
