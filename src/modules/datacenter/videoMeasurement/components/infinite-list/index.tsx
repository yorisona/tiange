import { ref, defineComponent, h } from '@vue/composition-api';
import moment from 'moment';
export default defineComponent({
  name: '',
  props: {
    /* 数据 */
    data: {
      type: Array,
      default: () => [],
    },
    /**是否显示总数 */
    total: {
      type: Number,
      default: 0,
    },
    /**是否显示查询 */
    showSearch: {
      type: Boolean,
      default: true,
    },
    /* loading */
    loading: {
      type: Boolean,
      default: false,
    },
    searchKey: {
      type: String,
      default: () => '',
    },
  },
  setup: (props, ctx) => {
    const artForm = ref({
      seachVal: '',
    });
    const load = () => {
      ctx.emit('load');
    };
    /* 查询 */
    const search = () => {
      ctx.emit('search', artForm.value.seachVal);
    };
    const renderText = (str: string) => {
      const searchVal = props.showSearch ? artForm.value.seachVal : props.searchKey;
      if (!searchVal) return str;

      const RegExpStr = searchVal.replace(/([\\.\\[\\)\\(])/g, '\\$1');
      const replaceReg = new RegExp(RegExpStr, 'ig');
      return str.replace(replaceReg, v => {
        return `<span style="color: #FB8500">${v}</span>`;
      });
    };
    const hide = () => {
      artForm.value.seachVal = '';
    };
    return {
      load,
      artForm,
      renderText,
      search,
      hide,
    };
  },
  render() {
    return (
      <div class="infinite-container">
        <div class="search-box" v-show={this.showSearch}>
          <span>关键词：</span>
          <el-input
            style="width:144px"
            size="mini"
            placeholder="请输入"
            // maxlength={20}
            v-model={this.artForm.seachVal}
          />
          <tg-button class="mgl-18" type="primary" onClick={this.search}>
            查询
          </tg-button>
          {/* </el-form> */}
        </div>
        <div class="total">共 {this.total} 条评论</div>
        <div
          class="infinite-list-box"
          v-loading={this.loading}
          v-infinite-scroll={this.load}
          infinite-scroll-distance={20}
        >
          {this.data?.length === 0 ? (
            <empty-common detail-text="暂无相关评论" />
          ) : (
            <ul class="infinite-list">
              {/* {this.$slots.default} */}
              {this.data.map((item: any) => {
                return (
                  <div class="mgb-16">
                    <div>
                      <span class="name">{item.comment_user_screen_name || '--'}</span>
                      <span class="tiem">
                        {moment(item.comment_datetime).format('YYYY.MM.DD HH:mm:ss')}
                      </span>
                    </div>
                    <div
                      class="info"
                      domProps={{
                        innerHTML: this.renderText(item.comment_text),
                      }}
                    />
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  },
});
