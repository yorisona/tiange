<template>
  <common-dialog
    ref="attachmentListEditInvoiceDialog"
    :isAppendToBody="true"
    :title="name"
    :width="800"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
  >
    <div>
      <sub-panel :title="'上传发票凭证'" :iserect="true"></sub-panel>
      <el-card
        class="box-card"
        shadow="hover"
        v-for="(item, index) in cost_info_list"
        :key="item.id"
      >
        <template #header>
          <div class="clearfix">
            <span class="title">凭证{{ index + 1 }}</span>
            <el-tooltip class="item" effect="dark" content="删除当前表单" placement="top-start">
              <!--  v-if="!isedite && cost_info_list.length!==1" -->
              <i
                class="iconfont icon-shanchu"
                v-if="cost_info_list.length !== 1"
                @click="deleteForm(item.id, index)"
              ></i>
            </el-tooltip>
          </div>
        </template>
        <el-form :rules="add_cost_form_rules" :model="item" :ref="`add_cost_form${item.id}`">
          <el-form-item
            class="invoice-pic"
            label="发票截图:"
            label-width="128px"
            prop="invoice_pic"
          >
            <!-- 编辑 -->
            <div
              id="previewEdit"
              @paste="event => handlePaste(event, index)"
              v-if="
                row_data &&
                row_data.invoice_info &&
                row_data.invoice_info[index] &&
                row_data.invoice_info[index].pic_url
              "
            >
              <!-- :src="`${row_data.invoice_info[index].pic_url}?Authorization=${getToken()}`" -->
              <!-- {{img_src_list}} -->
              <img
                v-if="row_data.invoice_info[index].pic_url && img_src_list[index] !== ''"
                ref="preview"
                :src="`${img_src_list[index]}?Authorization=${getToken()}`"
                alt
                class="upload-image"
                id="upload-image"
              />
              <span v-if="img_src_list[index]" class="delete-img" @click="deleteImg(index)">x</span>
            </div>
            <!-- 新增 -->
            <div v-else id="previewAdd" @paste="event => handlePaste(event, index)">
              <img
                v-if="img_src_list.length > 0 && img_src_list[index] !== ''"
                ref="preview"
                :src="`${img_src_list[index]}?Authorization=${getToken()}`"
                alt
                class="upload-image"
                id="upload-image"
              />
              <span v-if="img_src_list[index]" class="delete-img" @click="deleteImg(index)">x</span>
            </div>
          </el-form-item>
          <el-form-item label="发票号码:" label-width="128px">
            <!--    -->
            <el-input
              maxlength="8"
              oninput="value=value.replace(/[^\d.]/g,'')"
              v-model="item.invoice_num"
              placeholder="请输入8位发票号码"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item label="开票时间:" label-width="128px">
            <el-date-picker
              v-model="item.invoice_date"
              size="small"
              placeholder="请选择打款时间"
              style="width: 100%"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="开票金额:" label-width="128px" prop="amount">
            <el-input
              v-model="item.amount"
              type="number"
              placeholder="请输入开票金额"
              @mousewheel.native.prevent
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开票单位名称:" label-width="128px">
            <el-input
              v-model="item.institution"
              placeholder="请输入开票单位名称"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- <span>
          复制当前表单
          <i
            v-if="!isedite"
            class="iconfont icon-fuzhibiaodan"
            @click="copyForm(item.id,index)"
          ></i>
        </span>-->
      </el-card>
      <!-- v-if="!isedite"  -->

      <div v-if="cost_info_list.length < 3" class="border-dashed" @click="addForm">
        <i class="el-icon-circle-plus"></i>点击添加
      </div>
    </div>
  </common-dialog>
</template>

<script>
import { uploadCertificate, saveAchievementInvoiceList } from '@/api/cooperative';
import { getToken } from '@/utils/token';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'CostEditInvoice',
  props: ['id', 'type'],
  data() {
    return {
      // result: [],
      row_data: '',
      img_src_list: [], //多个图片src
      name: '',
      isedite: false,
      isDisable: false,
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      loading: false,
      file: null,
      cost_info_list: [], //总体列表
      add_cost_form: {
        invoice_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 成本开票日期
        amount: '', // 开票金额
        pic_url: '', // 开票凭证
        institution: '', //开票单位名称
        invoice_num: '', //开票单位
      },
      add_cost_form_rules: {
        // amount: [
        //   {
        //     required: false,
        //     trigger: "change",
        //     pattern: /^[0-9]+$/,
        //     message: "仅可输入阿拉伯数字"
        //   }
        // ]
      },
    };
  },
  methods: {
    getToken,
    // 监听粘贴操作
    handlePaste(event, index) {
      if (this.img_src_list[index] !== '') {
        this.$message.error('已有图片请勿重复粘贴');
      } else {
        const items = (event.clipboardData || window.clipboardData).items;
        let file = null;
        if (!items || items.length === 0) {
          this.$message.error('当前浏览器不支持本地');
          return;
        }
        // 搜索剪切板items
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            file = items[i].getAsFile();
            break;
          }
        }

        if (!file) {
          // log.innerHTML = '<span style="color:red;">粘贴内容非图片</span>';
          this.$message.error('粘贴内容非图片');
          return;
        }
        // 此时file就是我们的剪切板中的图片对象
        // 如果需要预览，可以执行下面代码
        const reader = new FileReader();
        reader.onload = () => {
          // 截图地址赋值给img
          // this.img_src_list.push(event.target.result);
        };
        reader.readAsDataURL(file);
        this.file = file;
        if (this.file) {
          this.uploadPlans(index);
        }
      }
    },
    // 添加表单
    addForm() {
      this.img_src_list.push('');
      const _add_cost_form = JSON.parse(JSON.stringify(this.add_cost_form));
      this.cost_info_list.push({
        ..._add_cost_form,
      });
    },
    async deleteForm(id, index) {
      if (this.cost_info_list.length <= 1) {
        this.$message.warning('表单至少有一个');
      } else {
        const msg = '确定删除该凭证？';
        const result = await AsyncConfirm({ root: this }, msg);

        if (result) {
          this.cost_info_list.splice(index, 1);
          // 删除scr数组中图片地址 在不在空情况下才执行
          if (this.img_src_list[index] !== undefined) {
            this.img_src_list.splice(index, 1);
          }
        }
      }
    },
    deleteImg(index) {
      if (this.$refs.preview[index].src !== '') {
        this.$refs.preview[index].src = '';
      }
      this.img_src_list.splice(index, 1, '');
    },
    // 显示
    show(row) {
      this.cost_info_list = [];
      this.row_data = row;
      this.isDisable = false;
      this.file = '';
      // this.pic_url = "";
      this.$refs.attachmentListEditInvoiceDialog.dialogOpen();
      // 编辑
      if (row && row.invoice_info.length !== 0) {
        row.invoice_info.forEach(item => {
          this.img_src_list.push(item.pic_url);
        });
        this.isedite = true;
        this.name = '编辑发票';
        // 循环表单对应赋值
        for (let i = 0; i < row.invoice_info.length; i++) {
          const _add_cost_form = {
            invoice_date: row.invoice_info[i].invoice_date, // 成本开票日期
            amount: row.invoice_info[i].amount, // 开票金额
            pic_url: row.invoice_info[i].pic_url, // 开票凭证
            institution: row.invoice_info[i].institution, //开票单位名称
            invoice_num: row.invoice_info[i].invoice_num, //开票号码
          };
          this.cost_info_list.push({
            ..._add_cost_form,
            ...{
              id: Math.ceil(Math.random() * 10000),
            },
          });
        }
      } else {
        this.name = '上传发票';
        // 新增
        // this.img_src_list = [];
        this.isedite = false;
        this.addForm();
      }
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans(index) {
      const file = this.file;
      if (!file) {
        this.$message.error('请粘贴图片后上传');
        return;
      }
      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'certificate/cost_invoice_certificate');
      form.append('achievement_or_cost_id', this.id);
      uploadCertificate(form)
        .then(data => {
          if (data.data && data.data.success) {
            this.add_cost_form.pic_url = data.data.data.source;

            // this.img_src_list.push(data.data.data.source);
            // 分别赋值
            this.img_src_list.splice(index, 1, data.data.data.source);
            for (let i = 0; i < this.cost_info_list.length; i++) {
              this.cost_info_list[i].pic_url = this.img_src_list[i];
            }
            this.$message.success('粘贴成功！');
            this.data.data.data.source = '';
          } else {
            this.$message.error('粘贴失败！');
          }
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 弹窗确认操作
    handledialogSubmit() {
      if (
        this.img_src_list.length === this.cost_info_list.length &&
        this.img_src_list.every(item => item !== '')
      ) {
        saveAchievementInvoiceList({
          invoice_info: this.cost_info_list,
          achievement_id: this.id,
        }).then(res => {
          if (res.data.success) {
            this.$message.success('保存成功');
            this.$emit('upload-close2');
            this.$refs.attachmentListEditInvoiceDialog.dialogClose();
          } else {
            this.$message.error('保存失败');
          }
        });
      } else {
        this.$message.error('请上传发票截图');
      }
    },
    // 关闭弹窗
    handledialogCancel() {
      this.img_src_list = [];
      this.$emit('upload-close2');
      this.isDisable = false;
    },
  },
};
</script>
<style lang="less" scoped>
.upload_img_icon {
  margin-top: 30px;
  margin-bottom: 15px;
}

#previewEdit,
#previewAdd {
  // margin: 0 auto;
  width: 220px;
  height: 107px;
  // background: rgba(255, 255, 255, 1);
  border: 1px dashed rgba(223, 230, 236, 1);
  border-radius: 10px;
  background-image: url('../../../assets/img/no_upload_img_icon.png');
  background-position: 33px 28px;
  background-size: 70% 50%;
  background-repeat: no-repeat;
  position: relative;
  /deep/ .upload-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .delete-img {
    width: 20px;
    height: 20px;
    font-size: 16px;
    position: absolute;
    z-index: 2020;
    background: #f2f6f9;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    right: 1px;
    top: 1px;
    cursor: pointer;
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
/deep/ .el-card__header {
  background: #f2f6f9;
  height: 46px;
  padding: 10px 20px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  .icon-shanchu {
    float: right;
  }
  .icon-shanchu:before {
    content: '\E61C';
    color: #f05765;
    font-size: 22px;
  }
}
.clearfix:after {
  content: none;
}
/deep/ .el-input__inner {
  height: 32px;
}
/deep/ .el-form-item {
  margin-bottom: 18px;
}
.border-dashed {
  border-radius: 10px;
  border: 1px dashed #e1e4eb;
  text-align: center;
  cursor: pointer;
  line-height: 39px;
  margin: 0px 50px;
  margin-top: 18px;

  color: #396fff;
  i {
    color: #396fff;
    margin-right: 10px;
  }
}
// 表单
.box-card {
  /deep/ .el-input-group__append {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    width: 39px;
    text-align: center;
  }
  margin: 0 50px;
  margin-bottom: 25px;
  .title {
    color: var(--text-color);
    font-weight: 600;
  }
  .invoice-pic {
    /deep/ .el-form-item__label:before {
      content: '*';
      color: var(--error-color);
      margin-right: 4px;
    }
  }
}
/deep/ .el-card__body {
  padding: 20px;
  padding-right: 75px;
}
.tax-point {
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input-group__append {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    width: 39px;
    text-align: center;
  }
  padding-right: 48px;
}
</style>
