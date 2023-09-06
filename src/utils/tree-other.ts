/*
 * @Author: 矢车
 * @Date: 2021-01-07 11:43:07
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-07 13:57:02
 * @Description: 树结构下拉框的一些交互方法
 */
// @ts-nocheck

//  1. 点击 popover 显示
export const popoverShow = (className = 'select-icon') => {
  document.querySelector(`.${className}`).className += ' select-icon-rotate';
};

// 2. 点击 popover 隐藏
export const popoverHide = (className = 'select-icon') => {
  document.querySelector(`.${className}`).classList.remove('select-icon-rotate');
};

// 3. 控制点击 select 部门树不收缩的问题
export const selectControlPopoverHide = () => {
  document.querySelector('.controlPopoverHide').click();
};
