import { defineComponent, PropType } from '@vue/composition-api';
import { IAnchorInfo, ICase } from '@/types/tiange/supplier';

export default defineComponent({
  props: {
    info: Object as PropType<IAnchorInfo>,
  },
  setup(props, ctx) {
    const handleCaseOpen = (_case: ICase) => {
      ctx.emit('caseOpen', _case);
    };
    return { handleCaseOpen };
  },
  render() {
    return (
      <div class="live-experience">
        <h1>直播经验</h1>
        <div class="block experience">
          <span class="label">直播年限：</span>
          <div class="text">{this.info?.live_year}年</div>
          <span class="label">达人经验：</span>
          <div class="text">{this.info?.has_kol_exp ? '有' : '无'}</div>
        </div>
        <h1>擅长类目</h1>
        <div class="block tags">
          {this.info?.cates.map((_case, key) => {
            return (
              <span class="item" key={key}>
                {_case.name}
              </span>
            );
          })}
        </div>
        <h1>个人标签</h1>
        <div class="block tags">
          {this.info?.tags.map((_case, key) => {
            return (
              <span class="item" key={key}>
                {_case.name}
              </span>
            );
          })}
        </div>
        <h1>合作品牌</h1>
        <div class="block tags">
          {this.info?.brands.map((_case, key) => {
            return (
              <span class="item" key={key}>
                {_case.name}
              </span>
            );
          })}
        </div>
        <h1>优秀案例</h1>
        {this.info?.cases.map((_case, key) => {
          return (
            <div class="block case-list" key={key}>
              <div class="case-title">
                案例{key + 1}：{_case.title}
              </div>
              <div class="case-des">业绩说明：{_case.description}</div>
              <div class="video-list">
                {_case.videos.length > 0 &&
                  _case.videos.map((item, index) => {
                    return (
                      <video
                        class="video-item"
                        width={'120px'}
                        height={'120px'}
                        controls="controls"
                        src={item}
                        key={index}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
        {this.info?.cases.length === 0 && <p style="color: var(--text-third-color);">暂无案例</p>}
      </div>
    );
  },
});
