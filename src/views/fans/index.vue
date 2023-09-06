<template>
  <section class="page-section">
    <el-row class="search-star" v-if="!$props.starName">
      <div>
        <input
          type="text"
          v-model="searchStarName"
          @keyup.enter="searchStarFans"
          @focus="isOnfoucs = true"
          @blur="isOnfoucs = false"
          :class="isOnfoucs ? 'foucs-bg' : 'blur-bg'"
          placeholder="请输入主播昵称"
        />
        <button @click="searchStarFans"></button>
      </div>
    </el-row>
    <el-row class="basic-chara">
      <p class="part-tit">基本特征</p>
      <el-row>
        <el-col :span="12">
          <div class="sex-account">
            <span class="chart-tit">性别占比</span>
            <genderChart
              v-loading="genderChartLoading"
              :genderChartData="genderChartData"
            ></genderChart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="age-account">
            <span class="chart-tit">年龄占比</span>
            <ageChart v-loading="genderChartLoading" :ageChartData="ageChartData"></ageChart>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="city-distri">
      <p class="part-tit">城市分布</p>
      <el-row>
        <el-col :span="12">
          <div class="chart-par">
            <mapChart
              v-loading="genderChartLoading"
              :barNameData="barNameData"
              :areaChartData="areaChartData"
            ></mapChart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-par">
            <areaBarChart
              :barNameData="barNameData"
              v-loading="genderChartLoading"
              :areaChartData="areaChartData"
            ></areaBarChart>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="pay-like">
      <p class="part-tit">消费偏好</p>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <div class="pay-like-part">
            <span class="chart-tit">类目偏好</span>
            <cateChart
              :cateChartData="cateChartData"
              v-loading="genderChartLoading"
              :cateNameChartData="cateNameChartData"
            ></cateChart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="pay-like-part">
            <span class="chart-tit">风格定位</span>
            <styleChart
              v-loading="genderChartLoading"
              :styleChartData="styleChartData"
              :styleNameChartData="styleNameChartData"
            ></styleChart>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="life-like">
      <p class="part-tit">生活偏好</p>
      <div>
        <radarChart
          v-loading="genderChartLoading"
          :radarChartData="radarChartData"
          :radarChartNameData="radarChartNameData"
        ></radarChart>
      </div>
    </el-row>
  </section>
</template>

<script>
import { queryFans } from '@/api/stat';
import { queryStars } from '@/api/star';

import genderChart from './component/basicCharacter/genderAccount';
import ageChart from './component/basicCharacter/ageAccount';
import mapChart from './component/cityDesc/areaMap';
import areaBarChart from './component/cityDesc/areaBar';

import cateChart from './component/payLike/cateChart';
import styleChart from './component/payLike/styleChart';
import radarChart from './component/lifeLike';

export default {
  components: { mapChart, genderChart, ageChart, areaBarChart, cateChart, styleChart, radarChart },
  props: ['starName'],
  data() {
    return {
      searchStarName: '洋气大小姐',
      isOnfoucs: false,
      isMounted: false,
      currentStarId: '',

      genderChartLoading: false,

      genderChartData: [],
      ageChartData: [],
      areaChartData: [],
      barNameData: [],

      cateChartData: [],
      cateNameChartData: [],
      styleChartData: [],
      styleNameChartData: [],

      radarChartData: [],
      radarChartNameData: [],
      radarMax: '',
    };
  },
  mounted() {
    // debugger
    this.isMounted = true;
    if (this.$route.query.starName) {
      this.searchStarName = this.$route.query.starName;
    } else if (this.$props.starName) {
      this.searchStarName = this.$props.starName;
    }
    this.searchStarFans();
  },
  methods: {
    searchStarFans() {
      if (this.searchStarName === '') {
        this.$message({ message: '请先输入主播昵称', type: 'warning' });
      } else {
        this.genderChartLoading = true;
        queryStars({ star_name: this.searchStarName }).then(response => {
          const result = response.data;
          // console.log(result)
          if (result.success) {
            if (result.data.data.length === 0) {
              this.$message({ message: '暂无此主播粉丝信息', type: 'warning' });
              this.genderChartLoading = false;
            } else {
              this.currentStarId = result.data.data[0].star_id;
              this.searchStarName = result.data.data[0].star_name;
              if (this.isMounted) {
                this.queryFansInfo();
              }
            }
          }
        });
      }
    },
    queryFansInfo() {
      this.genderChartData = [];
      this.ageChartData = [];
      this.areaChartData = [];
      this.barNameData = [];
      this.cateChartData = [];
      this.cateNameChartData = [];
      this.styleChartData = [];
      this.styleNameChartData = [];
      this.radarChartData = [];
      this.radarChartNameData = [];
      queryFans({ star_id: this.currentStarId }).then(response => {
        const result = response.data;
        if (result.success) {
          this.genderChartLoading = false;
          const res = result.data.data[0];
          res.gender.forEach(item => {
            this.genderChartData.push({
              name: item.title,
              value: item.value,
            });
          });
          res.age.forEach(item => {
            this.ageChartData.push({
              name: item.title,
              value: item.value,
            });
          });
          res.area.forEach(item => {
            this.areaChartData.push({
              name: item.title,
              value: item.value,
            });
            this.barNameData.push(item.title);
          });
          res.cate.forEach(item => {
            this.cateChartData.push({
              name: item.title,
              value: item.value,
            });
            this.cateNameChartData.push({
              name: item.title,
              icon: 'pin',
            });
          });
          res.interest.forEach(item => {
            this.styleChartData.push({
              name: item.title,
              value: item.value,
            });
            this.styleNameChartData.push({
              name: item.title,
              icon: 'pin',
            });
          });
          res.career.forEach(item => {
            this.radarChartData.push(item.value);
            this.radarMax = JSON.parse(JSON.stringify(this.radarChartData));
            this.radarMax.sort((aa, bb) => {
              return aa - bb;
            });
            this.radarChartNameData.push({
              name: item.title,
              max: this.radarMax[this.radarMax.length - 1],
            });
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/vars.scss';

.page-section {
  min-width: 800px;
}
.search-star {
  height: 48px;
  div {
    position: relative;
    display: inline-block;
  }
  button {
    width: 18px;
    height: 18px;
    background: url(../../assets/img/personal_sprite.png);
    background-position: -8px -6px;
    border: none;
    outline: none;
    position: absolute;
    right: 18px;
    top: 22px;
    cursor: pointer;
  }
  button:hover {
    top: 23px;
  }
  input {
    width: 306px;
    height: 32px;
    line-height: 32px;
    padding-left: 14px;
    margin-top: 14px;
    font-size: 12px;
    outline: none;
    border: none;
    color: #666;
    border-radius: 3px;
  }
  .foucs-bg {
    background-color: #e4e4e4;
  }
  .blur-bg {
    background-color: #dcdcdc;
  }
}
.basic-chara {
  background: #fff;
  height: 386px;
  margin: 0 0 14px;
  .sex-account {
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
  .age-account {
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
}
.city-distri {
  background: #fff;
  height: 380px;
  .chart-par {
    width: 100%;
    margin-top: 4px;
    height: 340px;
  }
}
.pay-like {
  height: 400px;
  background: #fff;
  margin-top: 14px;
  .pay-like-part {
    text-align: center;
    margin-top: 10px;
  }
}
.life-like {
  background: #fff;
  height: 360px;
  margin-top: 14px;
}
.part-tit {
  font-size: 14px;
  margin: 14px 10px 0;
  color: var(--text-color);
}
.chart-tit {
  background: #eee;
  color: #666;
  font-size: $size-small;
  padding: 3px 20px;
  border-radius: 10px;
}
</style>
