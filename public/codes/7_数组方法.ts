//flat
function flatten(arr: Array<any>, depth: number = 1): Array<any> {
  let ret: Array<any> = [];
  arr.forEach((v) => {
    if (Array.isArray(v) && depth !== 0) {
      ret.push(...flatten(v, depth - 1));
    } else {
      ret.push(v);
    }
  });
  return ret;
}
//reduce
function reduce(arr: Array<any>, callback: Function, initValue: any) {
  if (arr.length) {
    let curValue = initValue == undefined ? arr[0] : initValue;
    let firstIndex = initValue == undefined ? 1 : 0;
    for (let i = firstIndex; i < arr.length; i++) {
      curValue = callback(curValue, arr[i], i, arr);
    }
    return curValue;
  } else if (initValue !== undefined) {
    return initValue;
  }
}
//map
function map(arr: Array<any>, callback: Function) {
  let ret: Array<any> = [];
  for (let i = 0; i < arr.length; i++) {
    ret.push(callback.call(arr, arr[i], i, arr));
  }
  return ret;
}
//filter
function filter(arr: Array<any>, callback: Function) {
  let ret: Array<any> = [];
  for (let i = 0; i < arr.length; i++) {
    callback.call(arr, arr[i], i, arr) && ret.push(arr[i]);
  }
  return ret;
}
