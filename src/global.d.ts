declare global {
  // 常用表单 Ref
  interface IFormRef {
    validate(func?: (valid?: boolean, obj?: any) => void);
    validate(): Promise<any>;
    resetFields(): void;
  }
  // 常用树形组件Ref
  interface ITreeRef {
    setChecked(key: any, checked: boolean, deep?: boolean): void;
    setCheckedKeys(keys: any[], leafOnly?: boolean);
    filter(value: any): void;
  }

  // 常用表格组件Ref
  interface ITableRef {
    toggleRowSelection(row: any, selected?: boolean): void;
    toggleAllSelection(): void;
    clearSelection(): void;
  }
  interface IAnyFunc {
    (...args: any): any;
  }
}

export {};
