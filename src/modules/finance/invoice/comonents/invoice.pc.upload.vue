<template>
  <div class="invoice-pc-upload-wrapper">
    <div class="invoice-total-amount">
      <span class="amount-label">待上传发票金额：</span>
      <span class="toBeUploaded-value mgr-24">{{ amountOfInvoiceToBeUploaded }}</span>
      <span class="amount-label">已上传发票金额：</span>
      <span class="amount-value">{{ total_invoice_amount_str }}</span>
    </div>
    <el-form
      size="mini"
      ref="uploadRef"
      :model="uploadForm"
      label-width="100px"
      class="upload-invoice-form"
    >
      <div class="list-form-box">
        <div
          v-for="(item, index) in uploadForm.list"
          :key="index"
          :class="
            invoiceListItemActiveIndex === index
              ? 'list-form-item list-form-item-active'
              : 'list-form-item'
          "
          style="margin-top: 8px"
          @paste="event => handlePaste(event, index)"
          @click.stop="invoiceListItemActiveIndex = index"
        >
          <el-button
            v-if="uploadForm.list.length > 1"
            class="form-item-close"
            icon="el-icon-close"
            circle
            @click="deleteUploadItemBtn(index)"
          />
          <el-form-item
            :prop="'list.' + index + '.show_url'"
            label="发票截图："
            label-width="84px"
            :rules="{
              required: true,
              message: '请上传发票截图',
              trigger: ['change', 'blur'],
            }"
          >
            <el-upload
              class="avatar-uploader"
              action
              :data="
                type === 1 ? { approval_info_id: baseInfo.id } : { settlement_id: baseInfo.id }
              "
              :http-request="uploadImage.bind(this, index, false)"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
              accept=".jpeg,.jpg,.png,.pdf"
            >
              <tg-icon
                style="font-size: 90px"
                v-if="item.show_url && item.show_url.includes('.pdf')"
                name="ico-pdf"
              />
              <img v-else-if="item.show_url" :src="item.show_url" class="avatar" />
              <div v-else class="avatar-uploader-icon" v-loading="loading">
                <i class="el-icon-plus"></i>
                <p>上传发票</p>
              </div>
              <div
                style="
                  position: absolute;
                  left: 120px;
                  top: 32px;
                  color: var(--text-third-color);
                  font-size: 12px;
                  width: 300px;
                  text-align: left;
                "
              >
                支持pdf，图片格式发票上传
              </div>
              <div
                style="line-height: 16px; color: var(--text-third-color)"
                class="el-upload__tip"
                slot="tip"
              >
                选中灰色区域，粘贴（ctrl+V）添加图片
              </div>
            </el-upload>
          </el-form-item>
          <div class="form-flex">
            <el-form-item class="flex-item" label="购买方：">
              <el-input
                disabled
                v-model.trim="item.buyer_name"
                placeholder="请输入购买方"
                style="width: 150px"
              />
            </el-form-item>
            <el-form-item class="flex-item" label="销售方：">
              <el-input
                disabled
                v-model.trim="item.seller_name"
                placeholder="请输入销售方"
                style="width: 150px"
                @paste.native.stop
              />
            </el-form-item>
            <el-form-item class="flex-item" label="发票号码：">
              <el-input
                disabled
                v-model.trim="item.invoice_number"
                placeholder="请输入8位发票号码"
                style="width: 150px"
              />
            </el-form-item>
            <el-form-item class="flex-item" label="开票时间：">
              <el-date-picker
                disabled
                v-model="item.invoice_date"
                type="date"
                placeholder="请选择时间"
                style="width: 150px"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item class="flex-item" label="开票金额：">
              <el-input
                disabled
                v-model.trim="item.total_amount"
                placeholder="请输入"
                style="width: 150px"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="flex-item" label="税率：">
              <el-input
                disabled
                v-model.trim="item.tax_rate"
                placeholder="税率"
                maxlength="100"
                clearable
                style="width: 150px"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item class="flex-item" label="税额：">
              <el-input
                disabled
                v-model.trim="item.tax_amount"
                placeholder="请输入"
                style="width: 150px"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="flex-item" label="不含税金额：">
              <el-input
                disabled
                v-model.trim="item.tax_excluded_amount"
                placeholder="请输入"
                style="width: 150px"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="flex-item" label="发票类型：">
              <el-select style="width: 150px" disabled v-model="item.invoice_type">
                <el-option label="销售发票" :value="1" />
                <el-option label="采购发票" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item class="flex-item" label="是否专票：">
              <el-select style="width: 150px" disabled v-model="item.is_special">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item class="flex-item" label="开票内容：">
              <el-input
                disabled
                :value="getContentTypeName(item)"
                placeholder="请输入"
                style="width: 150px"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <tg-ghost-button class="add-upload-form-btn" @click="addUploadItemBtn"
      >点击添加</tg-ghost-button
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  PropType,
  watchEffect,
} from '@vue/composition-api';
import { getFileExtension, sleep } from '@/utils/func';
import {
  UploadInvoiceFile,
  GetAllowInvoiceAmount,
  InvoiceManagementgetAllowInvoiceAmount,
} from '@/api/finance.payment';
import { fixFileToken } from '@/utils/http';
import { UploadInvoice } from '@/types/tiange/finance/invoice';
import moment from 'moment';
import Decimal from 'decimal.js-light';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { baseInfo } from '../dialog/invoice.upload';
import { useRequest } from '@gm/hooks/ahooks';
export default defineComponent({
  props: {
    type: Number,
    baseInfo: {
      type: Object as PropType<baseInfo>,
    },
  },
  setup(props, ctx) {
    const isInvoiceManagement = ctx.root.$route.meta?.name === '发票管理';
    const reqGetAllowInvoiceAmount = useRequest(
      isInvoiceManagement ? InvoiceManagementgetAllowInvoiceAmount : GetAllowInvoiceAmount,
      {
        manual: true,
      },
    );
    // 开票管理发票上传/成本结算发票上传获取待上传发票金额
    watchEffect(() => {
      if (isInvoiceManagement) {
        reqGetAllowInvoiceAmount.run({
          approval_info_id: props.baseInfo?.approval_id as string,
        });
      } else {
        reqGetAllowInvoiceAmount.run(props.baseInfo?.business_type as string, {
          settlement_id: props.baseInfo?.id,
        });
      }
    });
    const amountOfInvoiceToBeUploaded = computed(() => {
      if (!reqGetAllowInvoiceAmount?.data?.not_write_invoice_amount) return 0;
      const InvoiceAmount: Decimal | number = new Decimal(
        reqGetAllowInvoiceAmount?.data?.not_write_invoice_amount / 100 || 0,
      );
      const total_invoice_amount = uploadForm.list.reduce((pre: Decimal, cur: UploadInvoice) => {
        return pre.add(new Decimal(cur.total_amount ? cur.total_amount : 0));
      }, new Decimal(0));
      // const res: string | number =
      //   InvoiceAmount.minus(total_invoice_amount).toNumber() > 0
      //     ? InvoiceAmount.minus(total_invoice_amount).toString()
      //     : 0;
      return formatAmountWithoutPrefix(InvoiceAmount.minus(total_invoice_amount).toNumber());
    });

    const loading = ref(false);
    const uploadForm = reactive<{ list: UploadInvoice[] }>({
      list: [
        {
          id: '',
          buyer_name: '',
          seller_name: '',
          invoice_date: '',
          invoice_number: '',
          tax_rate: '',
          tax_amount: '',
          total_amount: '',
          tax_excluded_amount: '',
          invoice_type: '',
          is_special: undefined,
          invoice_pic_url: '',
          show_url: '',
          type: 1,
        },
      ],
    });
    const invoiceListItemActiveIndex = ref<number | undefined>(undefined);
    function deleteUploadItemBtn(index: number) {
      uploadForm.list.splice(index, 1);
    }
    function clearInvoiceListItemActiveIndex() {
      invoiceListItemActiveIndex.value = undefined;
    }
    function addUploadItemBtn() {
      /* if (uploadForm.list.length >= 3) {
        ctx.root.$message.error('最多上传3个!');
        return false;
      }*/
      uploadForm.list.push({
        id: '',
        buyer_name: '',
        seller_name: '',
        invoice_date: '',
        invoice_number: '',
        tax_rate: '',
        tax_amount: '',
        total_amount: '',
        tax_excluded_amount: '',
        invoice_type: '',
        is_special: undefined,
        invoice_pic_url: '',
        show_url: '',
        type: 1,
      });
    }

    function beforeAvatarUpload(file: File) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type) &&
        !['.jpg', '.jpeg', '.png', '.pdf'].includes(getFileExtension(file.name))
      ) {
        ctx.root.$message.warning('文件格式不正确，请使用 png / jpg / jpeg / pdf');
        return false;
      }
      if (!isLt20M) {
        ctx.root.$message.error('上传图片大小不能超过 20MB!');
        return false;
      }
      return true;
    }

    async function uploadImage(index: number, isPaste: boolean, params: Record<string, any>) {
      const list = uploadForm.list.map(el => ({ ...el }));
      const form = new FormData();
      form.append('file', params.file);
      if (props.type === 1) {
        form.append('approval_info_id', `${props.baseInfo?.id || ''}`);
      } else {
        form.append('settlement_id', `${props.baseInfo?.id || ''}`);
      }
      loading.value = true;
      const [{ data: response }] = await Promise.all([
        await UploadInvoiceFile(form),
        await sleep(500),
      ]);
      loading.value = false;
      if (response.success) {
        const data = response.data;
        // const type = props.type === 2 && data.agent_mark === 1 && data.invoice_type === 2 ? 2 : 1;
        list[index].show_url = fixFileToken(data.invoice_pic_url, false);
        list[index].invoice_pic_url = data.invoice_pic_url;
        list[index].id = data.id;
        list[index].buyer_name = data.buyer_name;
        list[index].seller_name = data.seller_name;
        list[index].invoice_number = data.invoice_number;
        list[index].invoice_date = moment(data.invoice_date * 1000).format('YYYY-MM-DD');
        list[index].tax_rate = data.tax_rate;
        list[index].tax_amount = data.tax_amount;
        list[index].total_amount = data.total_amount;
        list[index].tax_excluded_amount = data.tax_excluded_amount;
        list[index].invoice_type = data.invoice_type;
        list[index].is_special = data.is_special || undefined;
        list[index].content_type_name = data?.raw_identify_data?.invoices[0]?.details.item_names;
        uploadForm.list = list;
        if (isPaste) {
          ctx.root.$message.success('粘贴成功！');
        }
        /* if (
          props.baseInfo?.is_special !== undefined &&
          props.baseInfo?.is_special === data.is_special
        ) {
          const str = props.baseInfo?.is_special === 1 ? '专' : '普';
          ctx.root.$message.error('发票类型与结算信息不一致，请上传' + str + '票');
        }
        if (props.baseInfo?.is_special === 1 && props.baseInfo?.tax_rate !== data.tax_rate) {
          ctx.root.$message.error(
            '发票与结算信息不一致，请上传税率为' + props.baseInfo?.tax_rate + '*%的专票',
          );
        }*/
      } else {
        ctx.root.$message.error(response.message);
      }
    }

    function handlePaste(event: ClipboardEvent, index: number) {
      const items = (event.clipboardData || (window as any).clipboardData)?.items;
      let file = null;
      if (!items || items.length === 0) {
        ctx.root.$message.error('当前浏览器不支持本地');
        return;
      }
      // 搜索剪切板items
      for (let index = 0; index < items.length; index++) {
        if (items[index].type.indexOf('image') !== -1 || items[index].type.indexOf('pdf') !== -1) {
          file = items[index].getAsFile();
          break;
        }
      }
      if (!file) {
        ctx.root.$message.error('粘贴内容非图片或pdf文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        // preview.innerHTML = `<img src="${event.target.result}" class="upload-image" id="upload-image">`;
        // 截图地址赋值给img
        // this.img_src_list.push(event.target.result);
      };
      //调用reader.readAsDataURL()方法，把图片转成base64
      reader.readAsDataURL(file);
      if (file) {
        if (beforeAvatarUpload(file)) {
          uploadImage(index, true, { file });
        }
      }
    }

    const total_invoice_amount_str = computed(() => {
      const temp_amount = uploadForm.list
        .reduce((pre: Decimal, cur: UploadInvoice) => {
          return pre.add(new Decimal(cur.total_amount ? cur.total_amount : 0));
        }, new Decimal(0))
        .toString();

      return formatAmountWithoutPrefix(temp_amount);
    });

    function getData() {
      return uploadForm.list;
    }

    const getContentTypeName = (item: any) => {
      console.log(item?.content_type_name?.split('*'), item, '-*---');

      // return item.raw_identify_data.invoices[0].details.item_names.join('*');
      return item?.content_type_name?.split('*')[1] ?? '';
    };
    return {
      loading,
      uploadForm,
      getContentTypeName,
      invoiceListItemActiveIndex,
      clearInvoiceListItemActiveIndex,
      deleteUploadItemBtn,
      beforeAvatarUpload,
      handlePaste,
      uploadImage,
      addUploadItemBtn,
      getData,
      total_invoice_amount_str,
      amountOfInvoiceToBeUploaded,
    };
  },
});
</script>

<style lang="less">
.invoice-pc-upload-wrapper {
  .el-form-item__label {
    color: var(--text-second-color) !important;
    font-size: 12px;
  }
  .invoice-total-amount {
    // margin: 0 6px 0 16px;
    padding: 16px 16px 6px 18px;
    font-size: 14px;
    // text-align: right;
    .amount-label {
      color: #555555;
    }
    .amount-value {
      color: var(--theme-color);
    }
    .toBeUploaded-value {
      color: #fb8500;
    }
  }
  .avatar-uploader-icon {
    width: 90px;
    height: 90px;
    font-size: 12px;
    color: var(--text-second-color);
    border-radius: 4px;
    text-align: center;
    border: 1px dashed #d5d5d5;
    background: #ffffff;
    &:hover {
      color: #5c82ff;
      border: 1px dashed #5c82ff;
    }
    .el-icon-plus {
      font-size: 20px;
      margin-top: 26px;
    }
    p {
      line-height: 20px;
      margin-top: -10px;
    }
  }
  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 4px;
    display: block;
    border: 1px dashed #d5d5d5;
  }
}
.upload-invoice-form {
  margin-top: 0;
  max-height: 465px;
  margin-bottom: 20px;
  overflow-y: scroll;
}
.list-form-box {
  .list-form-item {
    width: 520px;
    margin: 0 0 20px 16px;
    background: #f6f6f6;
    border-radius: 4px;
    padding-top: 10px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px dashed transparent;
    .form-item-close {
      padding: 0;
      width: 18px;
      height: 18px;
      text-align: center;
      line-height: 18px;
      border: none;
      color: #ffffff;
      background: #d1d8e0;
      font-size: 12px;
      &:hover {
        color: #ffffff !important;
        background: var(--error-color);
      }
      float: right;
      margin-top: -18px;
      margin-right: -6px;
    }
    .form-flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .flex-item {
        flex: 1;
        margin-left: -17px;
      }
      .el-input-group__append {
        padding: 0 10px;
      }
    }
  }
  .list-form-item-active {
    border-color: rgba(var(--theme-rgb-color), 0.9);
  }
}
.add-upload-form-btn {
  width: 516px;
  margin: -5px auto 18px;
  font-size: 12px;
  border: 1px dashed #dcdfe6;
  color: var(--theme-color);
}
</style>
