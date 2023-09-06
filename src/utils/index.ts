const utils = {
  /**
   * 截取字符多余用省略号代替
   * @param str
   * @param num
   */
  ellipsisText(str: string, num = 9, char = '...') {
    if (str === null || str === undefined) return str;
    if (str.length <= num) return str;
    return `${str.substring(0, num)}${char}`;
  },
  /** 获取文件名 **/
  basename(url: string): string | null {
    const reg = /[^\\/]+$/.exec(url);
    if (reg) {
      const remove_querys = reg[0].replace(/\?.+$/g, '');
      return decodeURIComponent(remove_querys);
    } else {
      return null;
    }
  },
  getFileInfo(url: string) {
    if (url) {
      const fileInfoURL = new URL(url);
      const fileName = fileInfoURL.pathname.substring(fileInfoURL.pathname.lastIndexOf('/') + 1);
      const arr = fileName.split('.');
      const extName = arr[arr.length - 1];
      let icoName;
      if (extName) {
        switch (extName.toLowerCase()) {
          case 'docx':
          case 'doc':
            icoName = 'ico-word';
            break;
          case 'pptx':
          case 'ppt':
            icoName = 'ico-ppt';
            break;
          case 'xls':
          case 'xlsx':
            icoName = 'ico-excel';
            break;
          case 'pdf':
            icoName = 'ico-pdf';
            break;
          case 'mp4':
            icoName = 'ico-icon_tongyong_tongyongxingwenjian_mianxing';
            break;
          case 'bmp':
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'webp':
          case 'gif':
            icoName = 'ico-picture';
            break;
          default:
            icoName = 'ico-icon_tongyong_tongyongxingwenjian_mianxing';
        }
      } else {
        icoName = 'ico-icon_tongyong_tongyongxingwenjian_mianxing';
      }
      return { fileName, icoName };
    } else {
      return { fileName: '', icoName: 'ico-word' };
    }
  },

  createPromise<T = any>() {
    const pm: { promise: Promise<T>; resolve: (obj: T) => void; reject: (e: Error) => void } =
      {} as any;
    pm.promise = new Promise((resolve, reject) => {
      pm.resolve = resolve as any;
      pm.reject = reject;
    });
    return pm;
  },
};
/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-28 16:05:28
 */
export default utils;

export class URLHelper {
  /**
   * 获取url图片后缀及图片类型
   * @param url
   */
  getFileInfo(url: string) {
    if (url) {
      const fileInfoURL = new URL(url);
      const pathName = decodeURI(fileInfoURL.pathname);
      const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
      const [_, extName] = fileName.split('.');
      let icoName;
      if (extName) {
        switch (extName.toLowerCase()) {
          case 'docx':
          case 'doc':
            icoName = 'ico-word';
            break;
          case 'xlsx':
          case 'xls':
            icoName = 'ico-excel';
            break;
          case 'pdf':
            icoName = 'ico-pdf';
            break;
          default:
            icoName = 'ico-picture';
        }
      } else {
        icoName = 'ico-picture';
      }

      return { fileName, icoName };
    } else {
      return { fileName: '', icoName: '' };
    }
  }
}
