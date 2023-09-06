import { Message } from 'element-ui';

const defaultFiles = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
const defaultVideo = ['.mp4'];
const defaultImage = ['.png', '.jpg', '.jpeg'];
const exclFiles = ['.xls', '.xlsx', '.csv'];
const defaultDoc = ['.doc', '.docx'];
const defaultPdf = ['.pdf'];
const defaultCsv = ['.csv'];
export const ValidationFileUpload = (config: {
  image?: boolean;
  fileSize?: number;
  file?: boolean;
  video?: boolean;
  excel?: boolean;
  pdf?: boolean;
  doc?: boolean;
  csv?: boolean;
  extensions?: string[];
}) => {
  return (file: File) => {
    const match = /(\.[^.]+)$/.exec(file.name);
    let ext = '';
    if (match) {
      ext = match[1];
    }

    const extensions = [];
    if (config.image) extensions.push(...defaultImage);
    if (config.file) extensions.push(...defaultFiles);
    if (config.video) extensions.push(...defaultVideo);
    if (config.excel) extensions.push(...exclFiles);
    if (config.pdf) extensions.push(...defaultPdf);
    if (config.doc) extensions.push(...defaultDoc);
    if (config.csv) extensions.push(...defaultCsv);
    if (config.extensions) extensions.push(...config.extensions);

    if (extensions.length > 0) {
      if (!extensions.includes(ext)) {
        Message.warning(`文件格式不正确，请使用 ${extensions.join(';')}`);
        return false;
      }
    }

    if (config.fileSize !== undefined) {
      const isLt10M = file.size / 1024 / 1024 < config.fileSize;
      if (!isLt10M) {
        Message.warning(`文件不能超过${config.fileSize}MB!`);
        return false;
      }
    }
    return true;
  };
};

export default {
  ValidationFileUpload,
};
