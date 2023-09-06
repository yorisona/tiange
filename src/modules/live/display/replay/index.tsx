import { defineComponent, ref } from '@vue/composition-api';
import { useLiveReplay, useLiveContract } from './use';
import { useRouter } from '@/use/vue-router';
import formatData from '@/utils/formatData';
import { $TDialog } from '@/components/Dialog';
import { Message } from 'element-ui';
import moment from 'moment';

const { formatPriceFormYuan } = formatData;
const formatPercentage = (value: any) => {
  if (value === null || value === undefined || value === '--') return '--';
  return `${formatPriceFormYuan(value, 2, false)}%`;
};
const formatUint = (value: any, unt = 's') => {
  if (value === null || value === undefined) return '--';
  return `${value}${unt}`;
};

const absNumber = (value: any) => {
  if (value === null || value === undefined) return '--';
  if (isNaN(value)) return value;
  return Math.abs(value);
};
export default defineComponent({
  setup(_, ctx: any) {
    const replay = useLiveReplay();
    const contract = useLiveContract();
    const router = useRouter();
    const visible = ref(false);
    const live_start_date = ref('');
    const select_contract_id = ref<null | number>(null);
    const projectId = ctx.attrs.detailData.project_id;

    const liveId: number = router.currentRoute.params.id as any;
    replay.query(liveId);

    const live_analyse_contrast = (contrastLiveId: number) => {
      return replay.live_analyse_contrast(liveId, contrastLiveId).then(replay.reload);
    };

    const addLiveContract = () => {
      if (select_contract_id.value === null) {
        Message.warning('请选择直播场次');
        return;
      }
      return live_analyse_contrast(select_contract_id.value).then(onCloseContractDialog);
    };

    const contract_feedback = () => {
      replay.contract_feedback(liveId).then(() => {
        Message.success('保存成功');
      });
    };

    const onShowContractDialog = () => {
      visible.value = true;
      select_contract_id.value = null;
      live_start_date.value = '';
      contract.reset();
    };
    const onCloseContractDialog = () => {
      visible.value = false;
    };

    const pickerOptions = {
      disabledDate: (vv: any) => {
        const now = Date.now();
        const date = vv.getTime();

        return date > now || date < now - 1000 * 60 * 60 * 24 * 30;
      },
    };
    return {
      pickerOptions,
      replay,
      live_analyse_contrast,
      visible,
      contract,
      live_start_date,
      select_contract_id,
      addLiveContract,
      onShowContractDialog,
      onCloseContractDialog,
      contract_feedback,
      liveId,
      projectId,
    };
  },
  methods: {
    angleClass(value: any) {
      return value >= 0 ? 'angle up' : 'angle down';
    },
    renderGeneral(
      title: string,
      value: number | undefined,
      percent: number | undefined | string,
      original: any = {},
    ) {
      const hasContrast =
        this.replay.data?.contrast_live_id !== null &&
        this.replay.data?.contrast_live_id !== undefined;

      return (
        <div class="info" data-title={title}>
          <span>
            {original.type === undefined
              ? formatPriceFormYuan(value, 2, original.hasSymbol)
              : original.type === 'percentage'
              ? formatPercentage(value)
              : original.type === 'original'
              ? value
              : original.type === 'uint'
              ? `${formatUint(value, original.suffix)}`
              : `nodefined`}
            {hasContrast && (
              <span class={this.angleClass(percent)}>{formatPercentage(absNumber(percent))}</span>
            )}
          </span>
        </div>
      );
    },
    renderCategory(title: string, values: []) {
      return (
        <div class="info" data-title={title}>
          {values.map((item: any, key) => {
            return <span key={key}>{item}</span>;
          })}
        </div>
      );
    },
  },
  render(h) {
    const replayData = this.replay.data;
    const hasContrast = replayData.contrast_live_id !== null;
    return (
      <div class="replay">
        <div class="contrast">
          <div>
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="medium"
              disabled={hasContrast}
              onClick={this.onShowContractDialog}
            >
              选择对比场次
            </el-button>
          </div>
          {hasContrast && (
            <div class="contrast-info">
              <span>对比直播场次</span>{' '}
              <b>
                {replayData.contrast_live_title}（开播时间：{replayData.contrast_live_start_time}）
              </b>
              <i
                class="el-icon-delete"
                onClick={() => {
                  $TDialog({
                    title: '确认删除该对比场次吗？',
                    onConfirm: () => {
                      this.live_analyse_contrast(0);
                    },
                  });
                }}
              />
            </div>
          )}
        </div>
        <dl>
          <dt>直播间成交</dt>
          <dd>
            {[
              { title: '引导成交金额', field: 'promote_order_amount' },
              { title: '引导成交件数', field: 'promote_order_num', hasSymbol: false },
              { title: '引导成交人数', field: 'promote_order_person', hasSymbol: false },
              {
                title: '引导成交转化率',
                field: 'promote_order_conversion_rate',
                type: 'percentage',
              },
              { title: '粉丝成交金额占比', field: 'fans_order_amount_percent', type: 'percentage' },
              { title: '粉丝成交件数占比', field: 'fans_order_num_percent', type: 'percentage' },
              { title: '粉丝成交人数占比', field: 'fans_order_person_percent', type: 'percentage' },
              { title: '转化率', field: 'conversion_rate', type: 'percentage' },
              { title: '粉丝成交转化率', field: 'fans_conversion_rate', type: 'percentage' },
              { title: '客单价', field: 'per_customer_price' },
            ].map((item, key) => {
              return this.renderGeneral(
                item.title,
                replayData?.order_analyse[item.field],
                replayData?.order_analyse[`contrast_${item.field}_percent`],
                item,
              );
            })}
            <div class="textarea" data-title="数据反馈">
              <el-input
                v-model={replayData.order_analyse.feedback}
                type="textarea"
                rows={4}
                maxlength={300}
                show-word-limit
                placeholder="请输入数据反馈"
                resize="none"
              />
            </div>
          </dd>
          <dt>观看分析</dt>
          <dd>
            {[
              { title: '直播间访问用户数', field: 'visit_num', hasSymbol: false },
              { title: '粉丝访问占比', field: 'fans_visit_percent', type: 'percentage' },
              { title: '观看次数', field: 'uv', hasSymbol: false },
              { title: '直播间浏览次数', field: 'pv', hasSymbol: false },
              { title: '平均观看时长', field: 'avg_view_second', type: 'uint', suffix: 's' },
              {
                title: '粉丝平均观看时长',
                field: 'fans_avg_view_second',
                type: 'uint',
                suffix: 's',
              },
              { title: '平均在线人数', field: 'avg_uv', hasSymbol: false },
              { title: '最高在线人数', field: 'max_uv', hasSymbol: false },
            ].map((item, key) => {
              return this.renderGeneral(
                item.title,
                replayData?.view_analyse[item.field],
                replayData?.view_analyse[`contrast_${item.field}_percent`],
                item,
              );
            })}
            <div class="textarea" data-title="数据反馈">
              <el-input
                v-model={replayData.view_analyse.feedback}
                type="textarea"
                show
                rows={4}
                maxlength={300}
                show-word-limit
                placeholder="请输入数据反馈"
                resize="none"
              />
            </div>
          </dd>
          <dt>流量分析</dt>
          <dd>
            {[
              { title: '封面图点击率', field: 'cover_click_rate', type: 'percentage' },
              { title: '额外激励流量', field: 'extra_promote_traffic', hasSymbol: false },
              { title: '观看次数', field: 'uv', hasSymbol: false },
              { title: '直播间浏览次数', field: 'pv', hasSymbol: false },
            ].map((item, key) => {
              return this.renderGeneral(
                item.title,
                replayData?.traffic_analyse[item.field],
                replayData?.traffic_analyse[`contrast_${item.field}_percent`],
                item,
              );
            })}
            <div class="info" data-title="直播间主要流量来源">
              <span>
                {replayData?.traffic_analyse.traffic_source === undefined
                  ? '--'
                  : formatData.formatEmpty(replayData?.traffic_analyse.traffic_source.join('、'))}
              </span>
            </div>
            <div class="textarea" data-title="数据反馈">
              <el-input
                v-model={replayData.traffic_analyse.feedback}
                type="textarea"
                rows={4}
                maxlength={300}
                show-word-limit
                placeholder="请输入数据反馈"
                resize="none"
              />
            </div>
          </dd>
          <dt>转化分析</dt>
          <dd>
            {[
              { title: '商品点击人数', field: 'item_click_person', hasSymbol: false },
              { title: '商品点击次数', field: 'item_click_num', hasSymbol: false },
              { title: '商品点击率', field: 'item_click_rate', type: 'percentage' },
              { title: '粉丝商品点击率', field: 'fans_item_click_rate', type: 'percentage' },
              { title: '新增粉丝数', field: 'new_fans_count', hasSymbol: false },
              { title: '游客转粉率', field: 'visitor_to_fans_rate', type: 'percentage' },
            ].map((item, key) => {
              return this.renderGeneral(
                item.title,
                replayData?.conversion_analyse[item.field],
                replayData?.conversion_analyse[`contrast_${item.field}_percent`],
                item,
              );
            })}
            <div class="textarea" data-title="数据反馈">
              <el-input
                v-model={replayData.conversion_analyse.feedback}
                type="textarea"
                rows={4}
                maxlength={300}
                show-word-limit
                placeholder="请输入数据反馈"
                resize="none"
              />
            </div>
          </dd>
          <dt>商品分析</dt>
          <dd class="article_goods_analysis">
            <div class="info" data-title="销量最高的类目">
              <span>
                类目：
                {formatData.formatEmpty(replayData?.item_analyse.max_sell_count_category_title)}
              </span>
              <span>
                销量：
                {formatPriceFormYuan(
                  replayData?.item_analyse.max_sell_count_category_value,
                  2,
                  false,
                )}
              </span>
            </div>
            <div class="info" data-title="销量最高的类目价格带">
              <span>
                类目：
                {formatData.formatEmpty(
                  replayData?.item_analyse.max_sell_count_price_range_category_title,
                )}
              </span>
              <span>
                价格带：
                {formatData.formatEmpty(replayData?.item_analyse.max_sell_count_price_range)}
              </span>
              <span>
                销量：
                {formatPriceFormYuan(
                  replayData?.item_analyse.max_sell_count_price_range_value,
                  2,
                  false,
                )}
              </span>
            </div>
            <div class="info" data-title="销售额最高的类目">
              <span>
                类目：
                {formatData.formatEmpty(replayData?.item_analyse.max_sales_amount_category_title)}
              </span>
              <span>
                销售额：
                {formatPriceFormYuan(replayData?.item_analyse.max_sales_amount_category_value)}
              </span>
            </div>
            <div class="info" data-title="销售额最高的类目价格带">
              <span>
                类目：
                {formatData.formatEmpty(
                  replayData?.item_analyse.max_sales_amount_price_range_category_title,
                )}
              </span>
              <span>
                价格带：
                {formatData.formatEmpty(replayData?.item_analyse.max_sales_amount_price_range)}
              </span>
              <span>
                销售额：
                {formatPriceFormYuan(replayData?.item_analyse.max_sales_amount_price_range_value)}
              </span>
            </div>
            <div class="textarea" data-title="数据反馈">
              <el-input
                v-model={replayData.item_analyse.feedback}
                type="textarea"
                rows={4}
                maxlength={300}
                show-word-limit
                placeholder="请输入数据反馈"
                resize="none"
              />
            </div>
          </dd>
        </dl>
        <div class="footer">
          <a class="btn-view" target="view" href={replayData.view_link}>
            查看
          </a>
          <el-button type="primary" onClick={this.contract_feedback}>
            保存
          </el-button>
        </div>
        <el-dialog
          title="选择对比场次"
          visible={this.visible}
          class="tg-dialog-default"
          width="376px"
          onClose={this.onCloseContractDialog}
        >
          <div class="select-contract">
            <span>直播日期</span>
            <el-date-picker
              size="small"
              format="yyyy.MM.dd"
              v-model={this.live_start_date}
              pickerOptions={this.pickerOptions}
              placeholder="请选择直播日期"
              onChange={(evt: null | Date) => {
                this.select_contract_id = null;
                if (evt === null) return this.contract.reset();
                this.contract.query(moment(evt).format('YYYY-MM-DD'), this.liveId, this.projectId);
              }}
            />
            <span class="empty"></span>
            <span>直播场次</span>
            <el-select size="small" v-model={this.select_contract_id}>
              {this.contract.list.map((item: any, index: number) => {
                return (
                  <el-option
                    value={item.id}
                    key={index}
                    label={`${item.live_title}(${item.live_start_time.split(' ')[1]})`}
                  />
                );
              })}
            </el-select>
          </div>
          <div slot="footer">
            <el-button onClick={this.onCloseContractDialog}>取消</el-button>
            <el-button type="primary" onClick={this.addLiveContract}>
              确定
            </el-button>
          </div>
        </el-dialog>
      </div>
    );
  },
});
