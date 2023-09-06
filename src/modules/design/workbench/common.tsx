import { Confirm } from '@/use/asyncConfirm';
import { useDialog } from '@/use/dialog';
import viewAppointment from '@/modules/design/dialog/viewAppointment/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { Modify_Reservation_Form } from '@/services/design';
import chargeBack from '@/modules/design/dialog/chargeBack/index.vue';
import uploadImage from '@/modules/design/dialog/uploadImage/index.vue';
import makeAppointment from '@/modules/design/dialog/makeAppointment/index.vue';
import imageDesignerAdjust from '@/modules/design/dialog/imageDesignerAdjust/index.vue';
import QRCodeBox from '@/modules/design/dialog/QRCodeBox/index.vue';
import { Message } from 'element-ui';

/**
 * 提取多个页面的形象设计操作逻辑处理
 */
export const useImageMethod = () => {
  const externalEvents: Record<string, TG.anyFunc> = {};
  const emit = async (cmd: string, row: any) => {
    return doObjectMethod(OptionsMethod, cmd, row);
  };
  const emitExternal = (cmd: string, ...args: any) => {
    doObjectMethod(externalEvents, cmd, args);
  };
  const dialogViewAppointment = useDialog({
    component: viewAppointment,
    title: '形象设计预约',

    width: '800px',
    footer: false,
    on: {
      command: emit,
    },
  });
  const dialogQRCodeBox = useDialog({
    component: QRCodeBox,
    title: '评价',
    width: '316px',
    footer: false,
  });
  const dialogUploadImage = useDialog({
    component: uploadImage,
    title: '上传效果图',
    width: '500px',
    on: {
      submit: ChargeBackPromise,
    },
  });
  const dialogMakeAppointment = useDialog({
    component: makeAppointment,
    title: '形象设计预约',

    width: '800px',
    on: {
      submit() {
        emitExternal('重新提交');
      },
    },
  });
  const dialogImageDesignerAdjust = useDialog({
    component: imageDesignerAdjust,
    title: '调整妆造师',
    okText: '确认',
    width: '330px',
    on: {
      submit() {
        dialogViewAppointment.close();
        emitExternal('调整妆造师');
      },
    },
  });

  const OptionsMethod: Record<string, (row: M.design.ReservationQuery) => Promise<any>> = {
    ['查看']: async row => {
      dialogViewAppointment.show(row);
    },
    ['撤销']: async row => {
      await Confirm('确定撤销吗?');
      return reqModifyReservation
        .runAsync({
          id: row.id,
          operation_type: 3,
        })
        .then(() => {
          dialogViewAppointment.close();
          emitExternal('撤销');
        });
    },
    ['退单']: async (row: M.design.ReservationQuery) => {
      dialogChargeBack.update({ title: '退单理由' });
      WaitingInput(
        dialogChargeBack,
        {
          title: '退单理由',
        },
        (value: string) => {
          reqModifyReservation
            .runAsync({
              id: row.id,
              operation_type: 2,
              chargeback_remark: value,
            })
            .then(() => {
              dialogChargeBack.close();
              dialogViewAppointment.close();
              emitExternal('退单');
            });
        },
      );
    },
    ['接单']: async row => {
      await Confirm('确定接单吗?');
      reqModifyReservation
        .runAsync({
          id: row.id,
          operation_type: 1,
        })
        .then(() => {
          emitExternal('接单');
          dialogViewAppointment.close();
        });
    },
    ['完成']: async row => {
      await Confirm('确定完成吗?');
      reqModifyReservation
        .runAsync({
          id: row.id,
          operation_type: 4,
        })
        .then(() => {
          emitExternal('完成');
          dialogViewAppointment.close();
        });
    },
    ['未完成']: async row => {
      dialogChargeBack.update({ title: '未完成原因' });
      WaitingInput(
        dialogChargeBack,
        {
          title: '未完成原因',
        },
        (value: string) => {
          reqModifyReservation
            .runAsync({
              id: row.id,
              operation_type: 5,
              unfinished_remark: value,
            })
            .then(() => {
              dialogChargeBack.close();
              dialogViewAppointment.close();
              emitExternal('未完成');
            });
        },
      );
    },
    ['评价']: async row => {
      dialogQRCodeBox.show(row.id);
      emitExternal('评价');
    },
    ['上传']: async row => {
      WaitingInput(dialogUploadImage, row, (value: any) => {
        reqModifyReservation
          .runAsync({
            id: row.id,
            operation_type: 6,
            effect_drawing: value,
          })
          .then(() => {
            emitExternal('上传');
            dialogUploadImage.close();
            dialogViewAppointment.close();
          });
      });
    },
    ['重新提交']: async row => {
      const { id, ...other } = row;
      dialogViewAppointment.close();
      dialogMakeAppointment.show(other);
    },
    ['调整妆造师']: async row => {
      dialogImageDesignerAdjust.show(row.id);
    },
  };
  const externalEvent = (cmd: string | string[], fn: TG.anyFunc) => {
    if (!Array.isArray(cmd)) cmd = [cmd];
    cmd.forEach(cmd => {
      externalEvents[cmd] = fn;
    });

    return result;
  };

  const result = {
    emit,
    on: externalEvent,
  };

  return result;
};

const doObjectMethod = async (object: Record<string, TG.anyFunc>, cmd: string, ...args: any[]) => {
  const method = object[cmd];
  if (method) return await method(...args);
};

const reqModifyReservation = useRequest(Modify_Reservation_Form, {
  manual: true,
  onSuccess(data, oData) {
    Message.success((oData as any).message);
  },
});

let _callback_: TG.anyFunc | null = null;
const ChargeBackPromise: TG.anyFunc = (...args: any[]) => {
  if (_callback_) _callback_(...args);
};
const dialogChargeBack = useDialog({
  component: chargeBack,
  width: '360px',
  on: {
    submit: ChargeBackPromise,
  },
});
const WaitingInput = async (dialog: any, config: any, callback: TG.anyFunc) => {
  _callback_ = callback;
  dialog.show(config);
};
