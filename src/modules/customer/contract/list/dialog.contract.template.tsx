import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const selected = (num: number) => {
      return () => {
        ctx.emit('close', num);
      };
    };
    return {
      selected,
    };
  },
  render(h) {
    const selected = this.selected;
    return (
      <div class="dialog-contact-container">
        <div class="block">
          <div class="title">
            <span>模板合同</span>
            <el-popover width={180} trigger="hover" open-delay={300}>
              <tg-button slot="reference" type="link" class="abnormal-tip-btn">
                <tg-icon name="ico-question"></tg-icon>
              </tg-button>
              <div class="abnormal-tip">需下载合同模板，或在线编辑后生成固定条款的合同</div>
            </el-popover>
          </div>
          <div class="items">
            <div class="item" onClick={selected(1)}>
              <div class="icon-contract icon-contract-0" />
              <div class="text">客户合同</div>
            </div>
            <div class="item" onClick={selected(2)}>
              <div class="icon-contract icon-contract-1" />
              <div class="text">供应商合同</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">
            <span>非模板合同</span>
            <el-popover width={180} trigger="hover" open-delay={300}>
              <tg-button slot="reference" type="link" className="abnormal-tip-btn">
                <tg-icon name="ico-question"></tg-icon>
              </tg-button>
              <div class="abnormal-tip">根据业务实际情况拟订的非固定条款合同</div>
            </el-popover>
          </div>
          <div class="items">
            <div class="item" onClick={selected(3)}>
              <div class="icon-contract icon-contract-0" />
              <div class="text">客户合同</div>
            </div>
            <div class="item" onClick={selected(4)}>
              <div class="icon-contract icon-contract-1" />
              <div class="text">供应商合同</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
