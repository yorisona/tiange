import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
// import { RouterNameDesign } from '@/const/router';
import { Confirm } from '@/use/asyncConfirm';
import upload from './upload.vue';
import {
  Set_Design_delivery_delivery,
  Set_Design_delivery_add_attachment,
  Set_Design_delivery_del_attachment,
} from '@/services/design';
import { Deliver_Additional_Content } from '../../useOrder';
// import { HasPermission } from '@/use/permission';
// import { RIGHT_CODE } from '@/const/rightCode';
import { UserInfo } from '@/types/tiange/system';
import { Design_Order_Details } from '../../useOrder';

export default defineComponent({
  name: 'delivery',
  components: {
    opinionUpload: upload,
  },
  props: {
    data: {
      type: Object as PropType<Design_Order_Details>,
      default: () => ({}),
    },
    showMask: {
      type: Boolean,
    },
    order_id: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    /* 排序按照交付-附加-其他 */
    const getInfoProperty = () => {
      const all = [...props.data['delivery_attachment'], ...props.data['addition_attachment']];
      const temporary = new Map();
      all.forEach(v => {
        if (temporary.has(v.design_type_name)) {
          temporary.get(v.design_type_name).push({ ...v, design_type_name: '' });
        } else {
          temporary.set(v.design_type_name, [v]);
        }
      });
      return Array.from(temporary)
        .map(v => {
          const [key, value] = v;
          const idx = value.findIndex((v: any) => v.name === '其他');
          if (idx > -1) {
            const other = value.splice(idx, 1);
            value.push(...other);
          }
          return value;
          // return value.sort((a: any) => {
          //   return a.name === '其他' ? 1 : -1;
          // });
        })
        .flat();
    };
    const getInfoProperty_list = ref<Deliver_Additional_Content[]>([]);
    getInfoProperty_list.value = getInfoProperty();
    const fileList = ref<string[]>([]);
    const approved = () => {
      Confirm('是否确定交付？').then(() => {
        ctx.emit('update:showMask', true);
        Set_Design_delivery_delivery({
          order_id: props.order_id,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            ctx.emit('change');
            ctx.root.$message.success(res.data.message ?? '交付成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '交付失败');
          }
        });
      });
    };
    const changeUpload = (
      type: 'add' | 'delete',
      file = '',
      index: number,
      // attachment_type: 'delivery_attachment' | 'addition_attachment',
    ) => {
      if (type === 'add') {
        ctx.emit('update:showMask', true);
        Set_Design_delivery_add_attachment({
          order_id: props.order_id,
          attachment_url_list: [file], //接口需要数组
          design_type_id: getInfoProperty_list.value[index].id,
          attachment_type: getInfoProperty_list.value[index].attachment_type,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            getInfoProperty_list.value[index].attachment.push({ url: file });
            ctx.root.$message.success(res.data.message ?? '上传成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '上传失败');
          }
        });
      } else if (type === 'delete') {
        ctx.emit('update:showMask', true);
        Set_Design_delivery_del_attachment({
          order_id: props.order_id,
          attachment_url: file,
          design_type_id: getInfoProperty_list.value[index].id,
          attachment_type: getInfoProperty_list.value[index].attachment_type,
        }).then((res: any) => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            getInfoProperty_list.value[index].attachment = getInfoProperty_list.value[
              index
            ].attachment.filter((item: { url: string }) => {
              console.log(item, item.url, file, item.url === file);
              return item.url !== file;
            });
            ctx.root.$message.success(res.data.message ?? '删除成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '删除失败');
          }
        });
      }
    };
    /** 权限检查 */
    const Permission = computed(() => {
      const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];
      const finish_status = [400, 600, 610, 620]; //交付状态后面的状态
      /* 交付 */
      const delivery =
        props.data.audit_finish &&
        user.id === props.data.executor &&
        !finish_status.includes(props.data.status) &&
        (props.data.delivery_attachment.length === 0
          ? true
          : props.data.delivery_attachment.every(item =>
              item?.name === '其他' ? true : item?.attachment?.length > 0,
            )) && //交付内容
        (props.data.addition_attachment.length === 0
          ? true
          : props.data.addition_attachment.every(item =>
              item?.name === '其他' ? true : item?.attachment?.length > 0,
            )); //附加交付内容
      const initiateAnAudit =
        props.data.audit_finish &&
        user.id === props.data.executor &&
        !finish_status.includes(props.data.status);
      const showFileList =
        (props.data.audit_finish &&
          user.id === props.data.executor &&
          !finish_status.includes(props.data.status)) ||
        (props.data.audit_finish && finish_status.includes(props.data.status));
      return { delivery, initiateAnAudit, showFileList };
    });
    // console.log(
    //   props.data.delivery_attachment.every(item =>
    //     item?.name === '其他' ? true : item?.attachment?.length > 0,
    //   ),
    // );

    return {
      fileList,
      approved,
      changeUpload,
      Permission,
      getInfoProperty,
      getInfoProperty_list,
    };
  },
});
