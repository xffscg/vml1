/**
 * 
 * @authors xff (you@example.org)
 * @date    2019-10-09 20:14:12
 * @version $Id$
 */
export const changeType = (state, funcType) => {
	state.funcType = funcType;
}
export const getPro = (state, proN) => {
	state.proList = deepCopy(proN);
}
export const getData = (state, dataN) => {
  state.dataList = deepCopy(dataN);
}
export const getAlg = (state, alg) => {
	state.algList = deepCopy(alg);
}
export const changeDrag = (state, content) => {
	state.dragContent = content;
}
export const changeMenu = (state, menuType) => {
  state.menuType = deepCopy(menuType);
}
export const changeOp = (state, op) => {
  state.menuOp = op;
}
export const changeShow = (state, b) => {
  console.log(b)
  state.showDetail = b;
}
export const changeConfig = (state, detailC) => {
  state.workData[detailC.name] = deepCopy(detailC.detail);
}
function deepCopy(oldVal){
    let target = oldVal.constructor === Array?[]:{};
    for(let key in oldVal){
      if(oldVal.hasOwnProperty(key)){
        if(oldVal[key] && typeof oldVal[key] === "object"){
          target[key] = oldVal[key].constructor === Array?[]:{};
          target[key] = deepCopy(oldVal[key]);
        }else{
          target[key] = oldVal[key];
        }
      }
    }
    return target;
}
