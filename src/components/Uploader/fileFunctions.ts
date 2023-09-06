/**
 * 获取宽高数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-21 20:29:57
 */
export const getRect = async (file: File): Promise<{ width: number; height: number }> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        resolve({ width, height });
      };
    };
    reader.readAsDataURL(file);
  });
};
