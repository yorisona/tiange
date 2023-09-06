<template>
  <div>
    <!-- 表单验证 ref prop rules -->
    <el-form
      size="small"
      :inline="true"
      :model="displayInfoForm"
      label-width="80px"
      label-position="top"
      ref="displayInfoForm"
    >
      <el-form-item label="直播标题">
        <el-input name="title" v-model="displayInfoForm.title"></el-input>
      </el-form-item>
      <el-form-item label="主播昵称">
        <el-input
          name="starName"
          v-model="displayInfoForm.star_name"
          disabled
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="主 播 ID">
        <el-input
          name="starId"
          disabled
          v-model="displayInfoForm.star_id"
          placeholder="请输入内容"
          type="number"
          @mousewheel.native.prevent
        ></el-input>
      </el-form-item>
      <el-form-item
        label="场次PV"
        prop="pv"
        :rules="[{ required: true, message: '场次PV是必填项' }]"
      >
        <el-input
          name="pv"
          v-model="displayInfoForm.pv"
          placeholder="请输入内容"
          type="number"
          @mousewheel.native.prevent
        >
          <template #append>万</template>
        </el-input>
      </el-form-item>
      <el-form-item label="场次UV">
        <el-input
          type="number"
          placeholder="请输入内容"
          v-model="displayInfoForm.uv"
          @mousewheel.native.prevent
        >
          <template #append>次</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="直播类型"
        prop="display_type"
        :rules="[{ required: true, message: '直播类型是必填项' }]"
      >
        <el-select
          name="displayType"
          v-model="displayInfoForm.display_type"
          placeholder="请选择直播类型"
        >
          <el-option
            v-for="item in displayTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="直播日期"
        prop="display_time"
        :rules="[{ required: true, message: '直播日期是必填项' }]"
      >
        <el-date-picker
          name="displayTime"
          v-model="displayInfoForm.display_time"
          placeholder="请选择直播日期"
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="是否预售场"
        prop="is_presell"
        :rules="[{ required: true, message: '是否预售场为必填项' }]"
      >
        <el-select
          placeholder="请选择是否为预售场"
          name="is_presell"
          v-model="displayInfoForm.is_presell"
        >
          <el-option
            v-for="(item, index) in presellSelectOption"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- <div class="dialog-footer">
      <el-button size="small" @click="handleCancleAddDisplay">取消</el-button>
      <el-button type="primary" size="small" @click="addDisplay('displayInfoForm')">添加</el-button>
    </div> -->
  </div>
</template>
<script>
import { presellSelectOption, displayTypeOptions } from '@/const/options';
export default {
  name: 'displayForm',
  props: ['displayInfoForm'],
  data() {
    return {
      presellSelectOption,
      displayTypeOptions,
    };
  },
  mounted() {
    this.$emit('display-form-ref', this.$refs['displayInfoForm']);
  },
  methods: {
    // handleCancleAddDisplay () {
    //   this.$emit('cancleAddDisplay')
    // }
  },
};
</script>
<style lang="less">
.add-display-form {
  .el-form-item__label {
    padding-bottom: 0;
    line-height: 18px;
    margin-left: 10%;
  }
  .el-form-item__error {
    right: 10%;
    top: -16px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
<style lang="scss" scoped>
$color-primary: var(--theme-color);
.add-display-form {
  .el-form {
    .el-form-item {
      width: 79%;
      margin: 2px auto;
      position: relative;
      margin-left: 10%;
      span {
        font-size: 12px;
        color: $color-primary;
        position: absolute;
        top: -26px;
        right: 0;
        margin-right: 10%;
      }
    }
    .el-input,
    .el-select {
      width: 80%;
      margin-left: 10%;
    }
  }
}
.el-table {
  color: #666;
}
</style>
