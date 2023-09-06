/**
 * 树
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-06 15:37:00
 */

/**
 * 树节点选中状态
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-06 15:38:31
 * @property {K} key 类型
 * @property {N} node 节点类型
 */
export interface TreeNodeCheckState<K, N> {
  /** 选中节点key */
  checkedKeys: K[];
  /** 选中节点 */
  checkedNodes: N[];
  /** 部分选中节点key */
  halfCheckedKeys: K[];
  /** 部分选中节点 */
  halfCheckedNodes: N[];
}
