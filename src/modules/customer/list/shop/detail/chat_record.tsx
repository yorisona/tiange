/**
 * 客户洽谈记录
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 17:43:38
 */
import { computed, defineComponent } from '@vue/composition-api';
import TgBlock from '@/layouts/block';
import { ListResponseData } from '@/types/base/http';
import { Conversation } from '@/types/tiange/customer';
import { fillEmptyStr } from '@/utils/string';
import { getChromeVersion } from '@/utils/browser';

import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';

const version = getChromeVersion();

export default defineComponent({
  setup(props, ctx) {
    const record = computed<ListResponseData<Conversation>>(
      () => ctx.root.$store.getters['cooperative/ChatRecord'],
    );

    const Permission = computed(() => {
      const canCreate = HasPermission(RIGHT_CODE.negotiation_create);

      return { canCreate };
    });

    const firstRecord = computed<Conversation | undefined>(() =>
      record.value.total > 0 ? record.value.data[0] : undefined,
    );

    const isClassFallback = computed(() => version !== false && version <= 84);

    return { record, firstRecord, isClassFallback, Permission };
  },
  render(h) {
    const recordCreateBtnProps = {
      props: {
        type: 'primary',
        icon: 'ico-btn-add',
      },
      on: {
        click: () => {
          this.$emit('record:create');
        },
      },
    };

    const recordMoreBtnProps = {
      class: ['underline-link'],
      on: {
        click: () => {
          this.$emit('record:more');
        },
      },
    };

    const btnsLine = (
      <div class="button-line">
        {this.Permission.canCreate ? <tg-button {...recordCreateBtnProps}>新增洽谈</tg-button> : ''}
        <div>
          <span>总洽谈次数：</span>
          <span>{this.record.total}</span>
          <span class="mgl-6">次</span>
        </div>
        {this.record.total > 0 ? <a {...recordMoreBtnProps}>查看更多记录&gt;</a> : h('')}
      </div>
    );
    const props = {
      class: 'chat-record-block',
      attrs: {
        title: '客户洽谈记录',
      },
    };

    const fieldClass = this.isClassFallback
      ? ['tg-field', 'flex-none', 'mgr-10']
      : ['tg-field', 'flex-none'];

    return (
      <TgBlock {...props}>
        {btnsLine}
        {this.firstRecord !== undefined
          ? [
              h('div', { class: 'chat-record-fields', style: { marginTop: '6px' } }, [
                <div class={fieldClass}>
                  <span class="tg-field-label">洽谈时间：</span>
                  <span class="tg-field-content">{this.firstRecord?.conversation_date}</span>
                </div>,
                <div class={fieldClass}>
                  <span class="tg-field-label">跟进人：</span>
                  <span class="tg-field-content">{this.firstRecord?.follower}</span>
                </div>,
                <div class="tg-field flex-auto">
                  <span class="tg-field-label">备注：</span>
                  <span class="tg-field-content">{fillEmptyStr(this.firstRecord?.note)}</span>
                </div>,
              ]),
              h(
                'div',
                { class: ['chat-record-fields', 'mgt-16'], style: { marginBottom: '10px' } },
                [
                  <div class="tg-field">
                    <span class="tg-field-label">洽谈内容：</span>
                    <span class="tg-field-content">{this.firstRecord?.conversation_content}</span>
                  </div>,
                ],
              ),
            ]
          : h('')}
      </TgBlock>
    );
  },
});
