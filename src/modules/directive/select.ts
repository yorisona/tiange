/** 拓展el-select多选时，选择器中的tag无法禁用删除的问题，默认将前几项作为禁止删除项 */
export const updateSelectTag = function (el: HTMLElement, bindings: any) {
  const defaultValues = bindings.value;
  const dealStyle = function (tags: NodeListOf<HTMLElement>) {
    // 因为不可删除原有值，所以原有值的index是不会变的，也就是将前n个tag的close隐藏掉即可。n即已有值的长度defaultValues.length
    tags.forEach((el, index) => {
      if (
        index <= defaultValues.length - 1 &&
        ![...el.classList].includes('select-tag-close-none')
      ) {
        // el.classList.add('none');
        el.style.display = 'none';
      }
    });
  };
  // 设置样式 隐藏close icon
  const tags = el.querySelectorAll('.el-tag__close') as NodeListOf<HTMLElement>;
  if (tags.length === 0) {
    // 初始化tags为空处理
    setTimeout(() => {
      const tagTemp = el.querySelectorAll('.el-tag__close') as NodeListOf<HTMLElement>;
      dealStyle(tagTemp);
    });
  } else {
    dealStyle(tags);
  }
};
