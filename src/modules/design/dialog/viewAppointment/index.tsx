import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import { Save_Reservation_Form } from '@/services/design';
import moment from 'moment';
import { VNode } from 'vue';
import { useMarkeup, useUserInfo } from '@/use/vuex';
import ImageViewer from '@/components/Image/ImageViewer';

export default defineComponent({
  setup(props, ctx) {
    const show = (value: M.design.ReservationQuery) => {
      formData.value = value;
    };
    const reqSaveAssement = useRequest(Save_Reservation_Form, { manual: true });
    const formData = ref<M.design.ReservationQuery>({
      scene_graph: [],
      design_sketch: [],
    } as any);
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (!success) {
          return;
        }
        const params = { ...formData.value };
        params.appointment_date_list = params.appointment_date_list.map(it =>
          moment(it).format('YYYY-MM-DD'),
        );
        params.start_broadcast_time = (params.start_broadcast_time as any as string[])
          .map(it => {
            return moment(it).format('HH:mm');
          })
          .join('-');
        reqSaveAssement.runAsync(params).then(() => {
          Message.success('发起成功');
          ctx.emit('submit');
          ctx.emit('close');
        });
      });
    };
    const formRef = ref<IFormRef>();
    const hasMarkeup = useMarkeup();
    const userinfo = useUserInfo();
    return { onSaveBtnClick, show, formData, formRef, hasMarkeup, userinfo };
  },
  render() {
    const { formData, userinfo } = this;
    const row = formData;
    const btns: VNode[] = [];
    const addButns = (txt: string, isPrimary = false) => {
      const type = isPrimary ? 'primary' : undefined;
      btns.push(
        <tg-button
          type={type}
          onClick={() => {
            this.$emit('command', txt, formData);
          }}
        >
          {txt}
        </tg-button>,
      );
    };
    const hasSelf = userinfo.id === row.image_design_id;
    if (row.reservation_status === E.design.AppointmentStatus.PENDING_ORDER && this.hasMarkeup)
      addButns('退单'), addButns('接单', true);
    if (
      row.reservation_status === E.design.AppointmentStatus.PENDING_ORDER &&
      row.reservation_person_id === this.userinfo.id
    ) {
      addButns('撤销');
    }
    if (row.reservation_status === E.design.AppointmentStatus.TOBE_COMPLETED && this.hasMarkeup)
      addButns('完成'), addButns('未完成');
    if (
      hasSelf &&
      row.reservation_status === E.design.AppointmentStatus.COMMENT &&
      this.hasMarkeup
    ) {
      addButns('评价', true);
      addButns('调整妆造师', false);
    }
    if (
      hasSelf &&
      row.reservation_status === E.design.AppointmentStatus.PENDING_UPLOAD &&
      this.hasMarkeup
    )
      addButns('上传', true);
    if (row.reservation_status === E.design.AppointmentStatus.CHARGED_BACK && !this.hasMarkeup)
      addButns('重新提交', true);
    return (
      <div class="dialog-container">
        <div class="form-body">
          <div label="预约人">{formData.reservation_person_username}</div>
          {formData.image_design_type !== E.design.ImageDesignType.INTERNAL && (
            <div label="业务类型">
              {E.project.BusinessTypeMap.get(formData.business_type) ?? '--'}
            </div>
          )}
          {formData.image_design_type !== E.design.ImageDesignType.INTERNAL && (
            <div label="项目名称">{formData.project_name ?? '--'}</div>
          )}
          <div label="预约主体">
            {E.design.AppointmentSubjectMap.get(formData.appointment_subject)}
          </div>
          {formData.appointment_subject === E.design.AppointmentSubject.ANCHOR && (
            <div label="主播类型">{E.supplier.AnchorTypeMap.get(formData.anchor_type)}</div>
          )}
          <div label="预约日期">{moment(formData.appointment_date).format('YYYY.MM.DD')}</div>
          <div label="预约时间">{formData.appointment_time}</div>
          <div label="开播时间">{formData.start_broadcast_time}</div>
          <div label="服务类型">{E.design.ServiceTypeMap.get(formData.service_type)}</div>
          <div label="妆造类型">
            {E.design.ImageDesignTypeMap.get(formData.image_design_type) || '--'}
          </div>
          {row.reservation_status !== E.design.AppointmentStatus.PENDING_ORDER && (
            <div label="妆造师">{formData.image_design_username}</div>
          )}
          {(row.reservation_status === E.design.AppointmentStatus.PENDING_UPLOAD ||
            row.reservation_status === E.design.AppointmentStatus.INVOICED) && (
            <div label="妆造满意度">{E.design.SatisfactionMap.get(formData.satisfaction)}</div>
          )}
          <div label="相关要求" class="xiangguanyaoqiu">
            {formData.relevant_requirement}
          </div>
          {(row.reservation_status === E.design.AppointmentStatus.PENDING_UPLOAD ||
            row.reservation_status === E.design.AppointmentStatus.INVOICED) && (
            <div label="评价及建议" class="pingjiajianyi">
              {formData.satisfaction_evaluate}
            </div>
          )}
          {(formData.scene_graph.length > 0 || formData.design_sketch.length > 0) && (
            <div class="pic-grid">
              {formData.scene_graph.length > 0 && (
                <div label="场景图">
                  <div class="upload-list">
                    {formData.scene_graph.map((url, index) => {
                      return (
                        <div class="file-wrapper">
                          <div class="file">
                            <tg-image
                              src={url}
                              fit="cover"
                              onClick={() => ImageViewer.show(formData.scene_graph, index)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {formData.design_sketch.length > 0 && (
                <div label="效果借鉴图">
                  <div class="upload-list">
                    {formData.design_sketch.map((url, index) => {
                      return (
                        <div class="file-wrapper">
                          <div class="file">
                            <tg-image
                              fit="cover"
                              src={url}
                              onClick={() => ImageViewer.show(formData.design_sketch, index)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div class="pic-grid">
            {formData.effect_drawing?.length > 0 && (
              <div label="效果图">
                <div class="upload-list">
                  {formData.effect_drawing.map((url, index) => {
                    return (
                      <div class="file-wrapper">
                        <div class="file">
                          <tg-image
                            fit="cover"
                            src={url}
                            onClick={() => ImageViewer.show(formData.effect_drawing, index)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        {btns.length > 0 && <div class="form-footer">{btns}</div>}
      </div>
    );
  },
});
