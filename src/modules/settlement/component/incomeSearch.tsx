import { ref, defineComponent, h, computed, onMounted } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import { SettlementScanStatusOptions } from '@/types/tiange/finance/settlement';
export default defineComponent({
  name: '',
  emits: ['search'],
  setup(props, ctx) {
    const router = useRouter();
    const data = ref();
    const initQueryForm = () => {
      return {
        settlement_uid: router.currentRoute.query.settlement_uid || undefined,
        company_name: undefined,
        month: undefined,
        status: undefined,
        settlement_scan_status: undefined,
      } as any;
    };
    const queryForm = ref(initQueryForm());
    const TYPE = computed(() => {
      return [
        {
          label: '未提交',
          value: 0,
        },
        {
          label: '待确认',
          value: 1,
        },
        {
          label: '已确认',
          value: 2,
        },
        {
          label: '退回',
          value: 3,
        },
      ];
    });
    const SCANTYPE = computed(() => {
      return [
        {
          label: '全部',
          value: undefined,
        },
        ...SettlementScanStatusOptions,
      ];
    });
    const reset = () => {
      queryForm.value = initQueryForm();
      ctx.emit('search', queryForm.value);
      // ctx.emit('reload', queryForm.value);
      // init();
    };
    const reload = () => {
      ctx.emit('search', queryForm.value);
    };
    onMounted(() => {
      reload();
    });
    return {
      SCANTYPE,
      data,
      TYPE,
      queryForm,
      reset,
      reload,
    };
  },
  render() {
    return (
      <el-form
        size="mini"
        // style="height: 32px"
        class="income-search"
        label-position="left"
        // label-width="60px"
        show-message={false}
        inline={true}
      >
        <el-form-item label="编号：">
          <el-input
            v-key-enter={this.reload}
            style="width: 132px;"
            v-model={this.queryForm.settlement_uid}
            placeholder="请输入编号"
          />
        </el-form-item>
        <el-form-item label="公司：">
          <el-input
            v-key-enter={this.reload}
            style="width: 132px;"
            v-model={this.queryForm.company_name}
            placeholder="请输入公司"
          />
        </el-form-item>
        <el-form-item label="周期：">
          <el-date-picker
            type="month"
            style="width: 132px;"
            placeholder="请选择周期"
            v-model={this.queryForm.month}
            format="yyyy.MM"
            value-format="yyyy-MM"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 132px;"
            placeholder="请选择状态"
            v-model={this.queryForm.status}
            clearable
          >
            {this.TYPE.map(el => (
              <el-option label={el.label} value={el.value} key={el.value}></el-option>
            ))}
          </el-select>
        </el-form-item>
        <el-form-item label="扫描件：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 132px;"
            placeholder="请选择状态"
            v-model={this.queryForm.settlement_scan_status}
            clearable
          >
            {this.SCANTYPE.map(el => (
              <el-option label={el.label} value={el.value} key={el.value}></el-option>
            ))}
          </el-select>
        </el-form-item>
        <el-form-item class="flex-form-item order-100" style="margin-right:8px">
          <tg-button type="primary" onClick={this.reload}>
            查询
          </tg-button>
          <tg-button class="mgl-8" onClick={this.reset}>
            重置
          </tg-button>
        </el-form-item>
        {this.$slots.searchAfter}
      </el-form>
    );
  },
});
