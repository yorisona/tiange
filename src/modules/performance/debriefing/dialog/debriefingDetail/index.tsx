import { defineComponent, ref } from '@vue/composition-api';
import { FD } from '@/utils/formatData';

export default defineComponent({
  setup(props, ctx) {
    const detail = ref<any>();
    const methods = {
      show(data: any) {
        detail.value = data;
      },
      reusltRatio(value?: number) {
        const big_result_item_value = detail.value?.big_result_item_value;
        const result = (big_result_item_value ? (value || 0) / big_result_item_value : 0) * 100;
        return result > 100 ? 100 : result < 0 ? 0 : result;
      },
    };
    return { otherInfos, detail, ...methods };
  },
  render() {
    const { detail } = this;

    return (
      <div class="tg-debriefing-detail-page-container">
        <section class="title-field">
          <div class="title">{FD.formatEmpty(detail?.name)}</div>
          <div class="name-and-time">
            <span class="name">{FD.formatEmpty(detail?.username)}</span>
            <span class="time">{FD.formatEmpty(detail?.report_date?.replace(/-/g, '.'))}</span>
          </div>
        </section>
        <section class="grade-field">
          <div class="grade-container">
            <div class="grade-label">综合得分</div>
            <div class="grade-value">{FD.formatEmpty(detail?.result)}</div>
            <div class="grade-level">
              <span>等级：</span>
              <span>{FD.formatEmpty(detail?.result_level).toUpperCase()}</span>
            </div>
          </div>
          <div class="grade-detail">
            <div class="section-header">得分明细</div>
            <div class="grade-dimension-list">
              {detail?.result_detail?.map((el: any, index: number) => (
                <fragments key={index}>
                  <span class="dimension-name">{el.key}</span>
                  <div
                    class="dimension-ratio-info"
                    style={`--dimension-ratio: ${this.reusltRatio(el.value)}%;`}
                  ></div>
                  <span class="dimension-grade">{el.value}</span>
                </fragments>
              ))}
            </div>
          </div>
        </section>
        {this.otherInfos.map((el, index) => (
          <section key={el.label} class="other-field">
            <div class="section-header">{el.label}</div>
            {el.items.every(evItem => !detail?.[evItem.key]) ? (
              <div class="empty-container">
                <empty-common detail-text={'暂无' + el.label} />
              </div>
            ) : (
              <div class="other-item-list">
                {el.items.map(item => (
                  <div
                    key={item.key}
                    class={el.labelPosition === 'top' ? 'other-item label-top' : 'other-item'}
                  >
                    <span class="label">
                      {detail?.[item.key] ? item.label : item.label + '暂无'}
                    </span>
                    {detail?.[item.key] ? <div class="content">{detail?.[item.key]}</div> : ''}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    );
  },
});

const otherInfos = [
  {
    label: '评价解读',
    items: [
      {
        label: '整体概述：',
        key: 'general_desc',
      },
      {
        label: '核心优势：',
        key: 'core_advantage',
      },
      {
        label: '短板识别：',
        key: 'disadvantage',
      },
    ],
  },
  {
    label: '上级期待',
    labelPosition: 'top',
    items: [
      {
        label: '直接/隔级领导对其个人成长的期待：',
        key: 'superior_except',
      },
    ],
  },
  {
    label: '发展建议',
    labelPosition: 'top',
    items: [
      {
        label: '整体发展建议：',
        key: 'general_suggest',
      },
      {
        label: '需重要培养的胜任力：',
        key: 'important_train',
      },
      {
        label: '具体提升建议：',
        key: 'detail_suggest',
      },
    ],
  },
];
