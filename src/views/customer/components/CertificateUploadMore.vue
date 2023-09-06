<template>
  <common-dialog
    ref="certificateUploadDialog"
    :isAppendToBody="true"
    :title="name"
    :width="460"
    :isfooter="true"
    @dialog-cancel="dialogCancelHandle"
    @dialog-submit="handledialogSubmit"
  >
    <div class="box">
      <div v-for="(item, index) in img_item" :key="index">
        <div id="preview" key="index" @paste="event => handlePaste(event, index)">
          <img
            v-if="img_src_list.length > 0 && img_src_list[index] !== ''"
            key="index"
            ref="preview_img"
            :src="`${img_src_list[index]}?Authorization=${getToken()}`"
            alt
            class="upload-image"
            id="upload-image"
          />
          <span v-if="img_src_list[index]" class="delete-img" @click="deleteImg(index)">x</span>
        </div>
        <span v-if="img_item.length !== 1" class="delete" @click="deleteForm(index)">删除图片</span>
      </div>
    </div>
    <template #tip><p class="el-upload__tip">支持扩展名：.jpg .jpeg .png</p></template>
    <div v-if="this.img_item.length < 3" class="border-dashed" @click="addForm">
      <i class="el-icon-circle-plus"></i>点击添加
    </div>
  </common-dialog>
</template>

<script>
import { uploadCertificate, saveCostPayCertificate } from '@/api/cooperative';
import { getToken } from '@/utils/token';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'CertificateUpload',
  props: ['id', 'type'],
  data() {
    return {
      name: '',
      certificate_pic_list: [], //上传多个图标数组
      img_src_list: [], //多个图片src数组
      isDisable: false,
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      certificate_pic: '', //单个图片
      file: null,
      img_item: [
        //点击添加
        {
          certificate_pic: '',
          file: null,
          // img_src_list: ""
        },
      ], //弹框列表
    };
  },
  methods: {
    getToken,
    // 监听粘贴操作
    handlePaste(event, index) {
      // if (this.img_src_list[index] !== "") {
      //   this.$message.error("已有截图，请勿粘贴");
      // } else {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error('当前浏览器不支持本地');
        return;
      }

      // 搜索剪切板items
      for (let index = 0; index < items.length; index++) {
        if (items[index].type.indexOf('image') !== -1) {
          file = items[index].getAsFile();
          break;
        }
      }

      if (!file) {
        this.$message.error('粘贴内容非图片');
        return;
      }

      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      // const that = this;
      const reader = new FileReader();

      reader.onload = () => {
        // preview.innerHTML = `<img src="${event.target.result}" class="upload-image" id="upload-image">`;
        // 截图地址赋值给img
        // this.img_src_list.push(event.target.result);
      };
      //调用reader.readAsDataURL()方法，把图片转成base64
      reader.readAsDataURL(file);
      this.file = file;
      if (this.file) {
        this.uploadPlans(index);
      }
      // }
    },

    // 显示
    show(row) {
      this.img_item = [];
      if (row.pay_certificate_pic) {
        this.img_src_list = row.pay_certificate_pic.split(',');
      }
      if (row.pay_certificate_pic !== '') {
        this.name = '编辑打款凭证';
        const _img_item = JSON.parse(JSON.stringify(this.img_item));
        for (let index = 0; index < row.pay_certificate_pic.split(',').length; index++) {
          this.img_item.push({
            ..._img_item,
          });
        }
      } else {
        this.addForm();
        this.name = '上传打款凭证';
        // this.img_src_list=[];
      }

      this.isDisable = false;
      this.file = '';
      this.$refs.certificateUploadDialog.dialogOpen();
      // this.certificate_pic = "";
      // this.certificate_pic_list = [];
    },
    // 添加上传框
    addForm() {
      this.img_src_list.push('');
      const _img_item = JSON.parse(JSON.stringify(this.img_item));
      this.img_item.push({
        ..._img_item,
      });
    },
    // 删除上传框
    async deleteForm(index) {
      const _img_item = JSON.parse(JSON.stringify(this.img_item));
      if (_img_item.length <= 1) {
        this.$message.warning('表单至少有一个');
      } else {
        const msg = '确定删除该上传框？';
        const result = await AsyncConfirm({ root: this }, msg);

        if (result) {
          this.img_src_list.splice(index, 1);
          this.img_item.splice(index, 1);
        }
      }
    },
    deleteImg(index) {
      // if (this.$refs.preview[index].src!=="") {
      //   this.$refs.preview[index].src = "";
      // }
      this.img_src_list.splice(index, 1, '');
    },
    //粘贴上传
    uploadPlans(index) {
      const file = this.file;
      // if (!file) {
      //   this.$message.error("请粘贴图片后上传");
      //   return;
      // }
      const form = new FormData();
      form.append('file', file);
      form.append('achievement_or_cost_id', this.id);
      form.append('type', this.type);
      uploadCertificate(form)
        .then(data => {
          if (data.data && data.data.success) {
            this.certificate_pic = data.data.data.source;
            this.certificate_pic_list.push(this.certificate_pic);
            // this.img_src_list.push(data.data.data.source);
            this.img_src_list.splice(index, 1, data.data.data.source);
            this.$message.success('粘贴成功！');
          } else {
            this.$message.error(data.data.message ?? '粘贴失败！');
          }
        })
        .catch(() => {
          // do nth
        });
    },
    // 弹窗确认操作 上传多张截图
    handledialogSubmit() {
      if (
        this.img_item.length === this.img_src_list.length &&
        this.img_src_list.every(item => item !== '')
      ) {
        saveCostPayCertificate({
          cost_id: this.id,
          pay_certificate_pic: this.img_src_list,
        }).then(res => {
          if (res.data && res.data.success) {
            this.$message.success(this.name + '上传成功！');
            this.$refs.certificateUploadDialog.dialogClose();
          } else {
            this.$message.error(res.data.message ?? this.name + '上传失败！');
          }
        });
      } else {
        this.$message.error('请粘贴图片后上传');
      }
    },
    // 关闭弹窗
    dialogCancelHandle() {
      this.isDisable = false;
      this.$emit('upload-close');
      // this.$emit("upload-close");
      this.img_src_list = [];
      // if()
      // // 拿到待删除节点:
      // var self = document.getElementById("upload-image");
      // // 拿到父节点:
      // var parent = self.parentElement;
      // // 删除:
      // var removed = parent.removeChild(self);
      // removed === self; // true
    },
  },
};
</script>

<style lang="less" scoped>
.upload_img_icon {
  margin-top: 30px;
  margin-bottom: 15px;
}

#preview {
  margin: 10px auto;
  width: 380px;
  height: 146px;
  // background: rgba(255, 255, 255, 1);
  border: 1px dashed rgba(223, 230, 236, 1);
  border-radius: 10px;
  background-image: url('../../../assets/img/upload_img_icon.png');
  background-position: 84px 38px;
  background-size: 50% 50%;
  background-repeat: no-repeat;
  position: relative;
  /deep/ .upload-image {
    width: 100%;
    height: 100%;
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

//附件
.fujian-list {
  display: block;
  margin-right: 50px;
  line-height: 15px;
  margin-top: 10px;
  i {
    color: var(--text-des-color);
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
.border-dashed {
  width: 380px;
  margin: 0 auto;
  border-radius: 10px;
  border: 1px dashed #e1e4eb;
  text-align: center;
  cursor: pointer;
  line-height: 39px;
  margin-top: 18px;
  color: #396fff;
  i {
    color: #396fff;
    margin-right: 10px;
  }
}
.delete {
  margin-top: 10px;
  padding: 4px 10px;
  border: 1px solid rgba(222, 222, 222, 1);
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #f05765;
    color: #fff;
    border: none;
  }
}
</style>
