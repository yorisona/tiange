<!--
 * @Author: 矢车
 * @Date: 2020-11-29 20:10:50
 * @LastEditors: 矢车
 * @LastEditTime: 2020-12-18 20:47:14
 * @Description: 附件预览
-->
<template>
  <div class="file-back">
    <ul class="file-list" style="padding-top: 10px">
      <li class="xj-header" style="border: none">
        <span style="flex: 1">附件类型</span>
        <span style="flex: 2">附件名称</span>
        <span v-if="type === '--'" style="flex: 1">状态</span>
        <span style="flex: 1; text-align: center">操作</span>
      </li>
      <li v-for="(item, i) in dataList" :key="i">
        <span style="flex: 1">{{ type }}</span>
        <span
          style="flex: 2"
          class="list-name"
          :title="decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')"
          >{{ decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--') }}</span
        >
        <div style="flex: 1; text-align: center">
          <a class="download-link" @click.stop="dowload(item)">
            <tg-icon name="ico-download"></tg-icon>
          </a>
          <a class="preview" @click.stop="preview(item)">
            <tg-icon name="ico-preview"></tg-icon>
          </a>
        </div>
      </li>
      <div class="nodata" v-if="!dataList.length">暂无数据</div>
    </ul>
  </div>
</template>

<script>
import { getToken } from '@/utils/token';
import TgIcon from '@/components/IconFont/tg.vue';
import { fixFileToken } from '@/utils/http';
import { downloadFileFromBlob } from '@/utils/func';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      token: getToken(),
    };
  },
  components: {
    TgIcon,
  },
  methods: {
    fixFileToken,
    preview(attachment_url) {
      const url = attachment_url;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    dowload(url) {
      const requestOptions = {
        headers: {
          Authorization: getToken() ?? '',
        },
      };
      fetch(url, requestOptions).then(async response => {
        if (response.status === 200) {
          const data = await response.blob();
          const filename = decodeURIComponent(url.split('/')[url.split('/').length - 1]);
          downloadFileFromBlob(data, filename);
        } else {
          console.log('下载失败');
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.file-back {
  .file-list {
    li {
      display: flex;
      line-height: 50px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px solid #e8e8e8;
      span {
        padding-left: 10px;
      }
      a {
        font-size: 16px;
      }
      .list-name {
        display: inline-block;
        width: 215px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .download-link {
        font-size: 16px;
        margin-right: 5px;
      }
    }
    .xj-header {
      background: #fafafa;
      width: 405px;
      line-height: 40px;
      display: flex;
    }
    .nodata {
      margin-top: 20px;
      text-align: center;
      width: 406px;
    }
  }
}
</style>
