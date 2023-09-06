import { ref, defineComponent, h } from '@vue/composition-api';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>([
      {
        define_name: '',
        // start_time: [new Date(), new Date()],
        start_time: '',
        end_time: '',
      },
    ]);
    const show = (
      val: {
        define_name: string;
        start_time: string;
        end_time: string;
      }[],
    ) => {
      if (val.length) formData.value = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = () => {
      ctx.emit('submit', formData.value);
    };
    // 比对结束时间是否大于开始时间
    const compareTime = (val: any) => {
      const { start_time, end_time } = val;
      if (start_time && end_time) {
        const start = new Date(`2020-01-01 ${start_time}`);
        const end = new Date(`2020-01-01 ${end_time}`);
        if (start.getTime() > end.getTime()) {
          return true;
        }
      }
      return false;
    };
    return {
      formData,
      show,
      close,
      compareTime,
      onSaveBtnClick,
    };
  },
  render() {
    const { formData, compareTime } = this;
    return (
      <div class="dialog-wrap">
        <div class="tip">
          <div>
            <tg-icon class="tip-icon" name="ico-common-tishi-areality" />
          </div>
          <span>
            开播时间在同一个场次定义时间范围内的，会默认合并为一场，如果没有在场次定义内的场次两场间隔小于30分钟，也会自动合并
          </span>
        </div>
        <div class="container">
          <div class="grid-title">
            <span>场次定义</span>
            <span>开播时间</span>
          </div>
          <div class="grid-box">
            {this.formData.map((item: any, index: number) => {
              return (
                <fragments>
                  <el-input
                    size="mini"
                    v-model={item.define_name}
                    placeholder="请输入场次定义"
                    maxlength={20}
                  />
                  <div class="time-wrap">
                    {/* <el-time-picker
                      is-range
                      size="mini"
                      style="width: 210px;"
                      v-model={item.start_time}
                      format="HH:mm"
                      range-separator="～"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      value-format="HH:mm"
                    /> */}
                    <el-time-picker
                      size="mini"
                      style="width: 110px; margin-right: 10px;"
                      v-model={item.start_time}
                      format="HH:mm"
                      range-separator="～"
                      placeholder="选择开始时间"
                      value-format="HH:mm"
                    />
                    <el-time-picker
                      size="mini"
                      style="width: 110px;"
                      v-model={item.end_time}
                      format="HH:mm"
                      range-separator="～"
                      placeholder="选择结束时间"
                      value-format="HH:mm"
                    />
                    <span class="identification" v-show={compareTime(item)}>
                      次日
                    </span>
                    <tg-icon
                      class="ico-btn-delete"
                      name="ico-btn-delete"
                      disabled={formData.length === 1}
                      onClick={() => {
                        if (formData.length === 1) return;
                        formData.splice(index, 1);
                      }}
                    />
                  </div>
                </fragments>
              );
            })}
          </div>
          <tg-button
            type="primary"
            size="mini"
            class="mgt-12"
            icon="ico-btn-add"
            onClick={() => {
              this.formData.push({
                define_name: '',
                // start_time: [new Date(), new Date()],
                start_time: '',
                end_time: '',
              });
            }}
          >
            增加场次
          </tg-button>
        </div>
      </div>
    );
  },
});
