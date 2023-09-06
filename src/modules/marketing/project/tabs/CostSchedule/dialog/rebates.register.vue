<!--
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 返点登记
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-24 14:52:06
-->

<template>
  <el-drawer
    title="登记返点"
    :visible="visible"
    class="rebates-register-drawer"
    :wrapperClosable="false"
    @close="close"
  >
    <div class="rebates-register-drawer-body">
      <div class="rebates-register-drawer-content">
        <!-- 客户信息 -->
        <DrawerHeader title="客户信息"></DrawerHeader>
        <DrawerCustomer
          class="rebates-register-customer-info"
          :customerName="project ? project.shop_name : '--'"
          :customerManager="project ? project.manager_name : '--'"
          :companyName="project ? project.company_name : '--'"
        ></DrawerCustomer>

        <!-- 表单部分 -->
        <el-form size="mini" label-position="top" :model="form" :rules="formRules" ref="ruleForm">
          <!-- 打款信息 -->
          <DrawerHeader style="margin-bottom: 6px" title="打款信息"></DrawerHeader>
          <div class="form-section">
            <el-form-item style="margin-top: -18px" label="关联业绩" prop="achievement_uid">
              <div class="drawer-item-performance">
                <el-select
                  clearable
                  v-model="form.achievement_uid"
                  placeholder="请输入并选择收款编号"
                  @change="achievementChanged"
                >
                  <el-option
                    v-for="ach in achievementList"
                    :key="ach.achievement_uid"
                    :label="ach.achievement_uid"
                    :value="ach.achievement_uid"
                  >
                  </el-option>
                </el-select>
                <div class="drawer-item-performance-value">
                  <div class="line-clamp-1">
                    业绩收款金额<span>{{ `￥${arch_amount ? arch_amount : '--'}` }}</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="打款日期">
              <el-date-picker
                :editable="false"
                v-model="form.transfer_date"
                type="date"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择打款日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="返点金额" prop="pay_amount">
              <el-input
                v-model="form.pay_amount"
                placeholder="请输入返点金额"
                @input="moneyChange($event, index)"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- 银行卡信息 -->
          <DrawerHeader
            style="margin-bottom: 6px; margin-top: 18px"
            title="银行卡信息"
          ></DrawerHeader>
          <div class="form-section">
            <el-form-item style="margin-top: -18px" label="银行卡号" prop="bank_card_num">
              <el-input
                v-model="form.bank_card_num"
                placeholder="请输入银行卡号"
                maxlength="40"
                @keyup.native="
                  e => {
                    e.target.value = e.target.value.replace(/[^\d]/g, '');
                  }
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="id_number">
              <el-input
                v-model="form.id_number"
                placeholder="请输入身份证号"
                maxlength="20"
                @keyup.native="
                  e => {
                    e.target.value = e.target.value.replace(/[\W]/g, '');
                  }
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop="bank_name">
              <el-input
                v-model.trim="form.bank_name"
                placeholder="请输入开户行"
                maxlength="40"
              ></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="real_name">
              <el-input
                v-model.trim="form.real_name"
                placeholder="请输入真实姓名"
                maxlength="10"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号"
                maxlength="11"
                @keyup.native="
                  e => {
                    e.target.value = e.target.value.replace(/[^\d]/g, '');
                  }
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证照片">
              <div class="pic-container">
                <Upp
                  action=""
                  :value="form.id_card_pic"
                  :http-request="uploadIdCardFile"
                  @remove="onIdCardPicRemove"
                />
                <span class="tips">上传的照片大小不能超过 2MB；支持格式.JPG .JPEG .PNG。</span>
              </div>
              <!-- <el-upload
                :ref="id_card_pic_upload"
                :class="hiddenIdUpload ? 'id-card-uploaded' : 'drawer-upload'"
                :limit="1"
                :multiple="false"
                action="/api/resources/upload_file"
                list-type="picture-card"
                :data="{ type: 'rebate/id_card_pic' }"
                :headers="{ Authorization: getToken() }"
                :on-remove="idCardPicRemoved"
                :on-change="dealIdImgChange"
                :on-success="idCardPicUploaded"
                :file-list="idFileList"
                :before-upload="beforeUpload"
                accept=".jpg,.jpeg,.png"
              >
                <div class="upload-custom-content">
                  <tg-icon name="ico-add-thin"></tg-icon>
                  <div>上传图片</div>
                </div>
                <div class="el-upload__tip" slot="tip">
                  上传的照片大小不能超过 2MB；支持格式.JPG .JPEG .PNG。
                </div>
              </el-upload> -->
            </el-form-item>
            <el-form-item label="银行卡照片">
              <div class="pic-container">
                <Upp
                  action=""
                  :value="form.bank_card_pic"
                  :http-request="uploadBankFile"
                  @remove="onBankPicRemove"
                />
                <span class="tips">上传的照片大小不能超过 2MB；支持格式.JPG .JPEG .PNG。</span>
              </div>
              <!-- <el-upload
                :ref="bank_card_pic_upload"
                :class="hiddenBankUpload ? 'bank-card-uploaded' : 'drawer-upload'"
                :limit="1"
                :multiple="false"
                action="/api/resources/upload_file"
                list-type="picture-card"
                :data="{ type: 'rebate/bank_card_pic' }"
                :headers="{ Authorization: getToken() }"
                :on-remove="bankCardPicRemoved"
                :on-change="dealBankImgChange"
                :on-success="bankCardPicUploaded"
                :file-list="bankFileList"
                :before-upload="beforeUpload"
                accept=".jpg,.jpeg,.png"
              >
                <div class="upload-custom-content">
                  <tg-icon name="ico-add-thin"></tg-icon>
                  <div>上传图片</div>
                </div>
                <div class="el-upload__tip" slot="tip">
                  上传的照片大小不能超过 2MB；支持格式.JPG .JPEG .PNG。
                </div>
              </el-upload> -->
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="rebates-register-drawer-footer">
        <tg-button size="small" @click="close">取消</tg-button>
        <tg-button size="small" type="primary" @click="save">保存</tg-button>
      </div>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在删除，请稍候..." />
  </el-drawer>
</template>

<script src="./rebates.register.ts"></script>

<style lang="less">
@import './rebates.register.less';
</style>
