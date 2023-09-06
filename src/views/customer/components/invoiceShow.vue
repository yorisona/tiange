<template>
  <common-dialog
    ref="InvoiceShowDialog"
    :isAppendToBody="true"
    title="发票详情"
    :width="800"
    :isfooter="false"
    @dialog-cancel="handledialogCancel"
  >
    <div v-if="row_data">
      <el-form v-if="row_data.tax_point_str" class="tax-point-str">
        <el-form-item label="税点金额:">
          <span>{{ row_data.tax_point_str ? row_data.tax_point_str : '--' }}</span>
        </el-form-item>
      </el-form>
      <!-- <sub-panel :title="'上传发票凭证:'" :iserect="true"></sub-panel> -->
      <el-card class="box-card" v-for="(item, index) in cost_info_list" :key="item.id">
        <template #header>
          <div class="clearfix">
            <span class="title">凭证{{ index + 1 }}</span>
          </div>
        </template>
        <el-form :rules="add_cost_form_rules" :model="item" :ref="`add_cost_form${item.id}`">
          <el-form-item label="发票号码:">
            <!--    -->
            <span>{{
              row_data.invoice_info[index].invoice_num
                ? row_data.invoice_info[index].invoice_num
                : '--'
            }}</span>
          </el-form-item>

          <el-form-item label="开票时间:">
            <span>{{
              row_data.invoice_info[index].invoice_date
                ? row_data.invoice_info[index].invoice_date
                : '--'
            }}</span>
          </el-form-item>
          <el-form-item label="开票金额(元):">
            <span>{{
              row_data.invoice_info[index].amount_str
                ? row_data.invoice_info[index].amount_str
                : '--'
            }}</span>
          </el-form-item>
          <el-form-item label="开票单位名称:">
            <span>{{
              row_data.invoice_info[index].institution
                ? row_data.invoice_info[index].institution
                : '--'
            }}</span>
          </el-form-item>
          <el-form-item label="发票凭证:" prop="invoice_pic">
            <br />
            <div id="preview2" v-if="row_data.invoice_info[index].pic_url">
              <img
                ref="preview_img"
                :src="`${row_data.invoice_info[index].pic_url}?Authorization=${getToken()}`"
                alt
                class="upload-image"
                id="upload-image"
              />
            </div>
            <div v-else>--</div>
            <template #tip>
              <p class="el-upload__tip">支持扩展名：.jpg .jpeg .png</p>
            </template>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </common-dialog>
</template>

<script>
// import { uploadCertificate, saveCostInvoiceList } from '@/api/cooperative';
import { getToken } from '@/utils/token';

export default {
  name: 'invoiceShow',
  props: ['id', 'type'],
  data() {
    return {
      row_data: '',
      name: '',
      isedite: false,
      isDisable: false,
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      loading: false,
      file: null,
      cost_info_list: [], //总体列表
      tax_point_str: '', // 税点金额
      add_cost_form: {
        invoice_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 成本开票日期
        amount_str: '', // 开票金额
        invoice_certificate_pic: '', // 开票凭证
        institution: '', //开票单位名称
        invoice_num: '', //开票单位
      },
      add_cost_form_rules: {
        invoice_pic: [{ required: true, message: '请输入税点金额', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    /* do nth */
  },
  methods: {
    getToken,
    // 显示
    show(row) {
      this.cost_info_list = [];
      this.isDisable = false;
      this.row_data = row;
      this.$refs.InvoiceShowDialog.dialogOpen();
      // 编辑
      if (row && row.invoice_info.length !== 0) {
        this.isedite = true;
        // 循环表单对应赋值
        for (let i = 0; i < row.invoice_info.length; i++) {
          const _add_cost_form = {
            invoice_date: row.invoice_info[i].invoice_date, // 成本开票日期
            amount_str: row.invoice_info[i].amount_str, // 开票金额
            invoice_certificate_pic: row.invoice_info[i].invoice_certificate_pic, // 开票凭证
            institution: row.invoice_info[i].institution, //开票单位名称
            invoice_num: row.invoice_info[i].invoice_num, //开票号码
          };
          this.cost_info_list.push({
            ..._add_cost_form,
            ...{
              id: Math.ceil(Math.random() * 10000),
              // cooperation_id: row.cooperation_id
            },
          });
          // 税点金额
          this.tax_point_str = row.tax_point_str;
        }
      } else {
        // 新增
        this.isedite = false;
      }
    },
    /**
     * 上传文件成功时回调
     */
    /**
     * 删除凭证
     * @param
     */
    // 关闭弹窗
    handledialogCancel() {
      // this.cost_info_list = [];
      this.isDisable = false;
      // this.$emit("upload-close2", this.invoice_certificate_pic === "");
      // this.$emit("upload-close2", this.file === "");
    },
  },
};
</script>

<style lang="less" scoped>
.upload_img_icon {
  margin-top: 30px;
  margin-bottom: 15px;
}
/deep/ .el-dialog {
  // padding-bottom: 70px;
}
#preview2 {
  // margin: 0 auto;
  // width: 220px;
  // height: 107px;
  // background: rgba(255, 255, 255, 1);
  // border: 1px dashed rgba(223, 230, 236, 1);
  border-radius: 10px;
  // background-image: url("../../../assets/img/upload_img_icon.png");
  // background-position: 56px 30px;
  // background-size: 50% 50%;
  // background-repeat: no-repeat;
  img {
    // width: 100%;
    height: 100%;
  }
}

.el-upload__tip {
  color: #b0bcdc;
  font-size: 14px;
  margin-bottom: 10px;
}
/deep/ .el-dialog__body {
  border-radius: 10px;
}
/deep/ .common-dialog .el-dialog__body {
  padding: 10px;
  background: #f2f6f9;
}
.box {
  border-radius: 10px;
  text-align: center;
  background: #fff;
  padding-top: 20px;
  position: relative;
}
.big-button {
  background-color: #396fff;
  margin-top: 20px;
}
/deep/ .el-card {
  border: none;
  box-shadow: none;
  background: #fff;
  color: var(--text-color);
}
/deep/ .el-form-item__label {
  color: #666;
}
/deep/ .el-card__header {
  height: 46px;
  padding: 10px 20px;
  border-bottom: none;
  font-size: 14px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.clearfix {
  display: flex;
  justify-content: space-between;
  .icon-shanchu {
    float: right;
  }
}
.clearfix:after {
  content: none;
}
/deep/ .el-input__inner {
  height: 32px;
}
/deep/ .el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
// 表单
.box-card {
  margin-bottom: 10px;
  border-radius: 10px;
}
/deep/ .el-form-item__label {
  text-align: left;
}
/deep/ .el-card__body {
  padding-top: 0;
  padding-left: 50px;
}
// 税点金额
.tax-point-str {
  background: #fff;
  border-radius: 10px;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
