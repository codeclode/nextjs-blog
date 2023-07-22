function deep_clone(target: any, map = new WeakMap()) {
  if (typeof target !== "object" || target === null) {
    return target;
  } else {
    if (map.has(target)) {
      return map.get(target);
    }
    let ret = Object.create(target.__proto__);
    if (Array.isArray(target)) ret = [];
    map.set(target, ret);
    for (let v in target) {
      ret[v] = deep_clone(target[v], map);
    }
    return ret;
  }
}

class TreeNode {
  children: Array<number | TreeNode>;
  id: number;
  pid: number;
  constructor(id, pid, children: TreeNode[] = []) {
    this.children = children;
    this.id = id;
    this.pid = pid;
  }
}

function arrToTree(arr: Array<TreeNode>) {
  let m = new Map<number, TreeNode>();
  arr.forEach((v) => {
    let node: TreeNode;
    if (m.has(v.id)) {
      node = m.get(v.id)!;
      node.pid = v.pid;
    } else {
      node = new TreeNode(v.id, v.pid);
      m.set(v.id, node);
    }
    if (m.has(v.pid)) {
      m.get(v.pid)!.children.push(node);
    } else if (v.pid !== -1) {
      m.set(v.pid, new TreeNode(v.id, -1, [node]));
    }
  });
  let ret: TreeNode[] = [];
  m.forEach((v) => {
    if (v.pid === -1) {
      ret.push(v);
    }
  });
  return ret;
}

function treeToArr(rootArr: Array<TreeNode>): Array<TreeNode> {
  let ret: Array<TreeNode> = [];
  rootArr.forEach((v) => {
    if (v.children && v.children.length) {
      ret.push(...treeToArr(v.children as Array<TreeNode>));
    }
    ret.push({ id: v.id, pid: v.pid, children: [] });
  });
  return ret;
}

//下划线—>驼峰
function hump<T>(target: T) {
  let copy = JSON.parse(JSON.stringify(target));
  if (Array.isArray(target)) {
    let ret: any = [];
    for (let k in copy) {
      ret[k] = hump(target[k]);
    }
    return ret;
  } else if (typeof target === "object") {
    let keys = Object.keys(target);
    let ret = {};
    keys.forEach((v) => {
      ret[trans(v)] = hump(copy[v]);
    });
    return ret;
  } else {
    return target;
  }
}

function trans(str: string): string {
  return str.replaceAll(/_([a-z])/g, (...rest) => {
    //rest就是正则exec得到的那个数组(匹配,括号1,括号2...,下标,整个字符串)
    return rest[1].toUpperCase();
  });
}
