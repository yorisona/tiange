import { defineComponent, ref, computed } from '@vue/composition-api';
import chart from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { useRequest } from '@gm/hooks/ahooks';
import {
  delete_multidimensional_statistics_template,
  query_multidimensional_statistics_template,
} from '@/services/datacenter';
import { Message } from 'element-ui';
import { Confirm } from '@/use/asyncConfirm';
export default defineComponent({
  components: {
    chart,
  },
  setup(props, ctx) {
    const searchKey = ref('');
    const searchKeyEnter = ref('');
    const selected = ref();

    const reqList = useRequest(query_multidimensional_statistics_template, { manual: true });
    const reqDelete = useRequest(delete_multidimensional_statistics_template, {
      manual: true,
      onSuccess: () => {
        Message.success('删除成功');
        reqList.reload();
      },
    });
    const list = computed(() => {
      const result = reqList.data || [];
      if (searchKeyEnter.value.trim() === '') return result;
      return result.filter(item => {
        return item.template_name.includes(searchKeyEnter.value);
      });
    });

    const onSearch = () => {
      selected.value = null;
      searchKeyEnter.value = searchKey.value;
    };
    const dialogSubmit = () => {
      if (selected.value === undefined) return;
      const data = reqList.data || [];
      if (data.length === 0) return;
      const find = data.find(it => it.id === selected.value);
      if (!find) {
        Message.error('未找到选择的模板');
        return;
      }
      ctx.emit('submit', find);
      ctx.emit('close');
    };
    const show = (second_cid: number) => {
      // selected.value = template.template_info.id;
      reqList.runAsync({ second_cid });
    };

    const onDeleteTempolate = async (id: number) => {
      await Confirm('确定删除吗?');
      await reqDelete.runAsync(id);
    };

    return {
      show,
      selected,
      list,
      searchKey,
      onSearch,
      dialogSubmit,
      reqList,
      onDeleteTempolate,
    };
  },
  render() {
    return (
      <div class="dialog-template-list">
        <div class="header">
          <el-input
            placeholder="请输入模板名称"
            size="mini"
            v-model={this.searchKey}
            v-key-enter={this.onSearch}
          />
          <tg-button type="primary" size="mini" class="mgl-18" onClick={this.onSearch}>
            查询
          </tg-button>
        </div>
        <div class="body">
          {this.list.map((item, key) => {
            const hasSelected = item.id === this.selected;
            return (
              <div
                class={`item ${hasSelected ? 'selected' : ''}`}
                key={key}
                onClick={() => {
                  this.selected = item.id;
                }}
              >
                <span>{item.template_name}</span>
                <span class="icon-box">
                  {hasSelected && <tg-icon name="ico-common-chenggong-areality" />}
                  {!hasSelected && (
                    <tg-icon
                      name="ico-btn-delete"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (hasSelected) return;
                        this.onDeleteTempolate(item.id as number);
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
