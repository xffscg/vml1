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
  state.showDetail = b;
}
export const changeConfigType = (state, configType) => {
  state.configType = configType;
}
export const changeRelation = (state, relation) => {
  console.log(relation);
  state.relationship = [];
  state.relationship = deepCopy(relation);
}
export const changeStart = (state, start) => {
  if(start.type == "add"){
    state.start.push(start.detail);
  }else{
    let index = state.start.indexOf(start.detail);
    if(state.start.length == 1){
      state.start = [];
    }else{   
      if(index == 0){
        state.start = state.start.slice(1);
      }else if(index == state.start.length -1){
        state.start = state.start.slice(0, state.start.length-1);
      }else{
        state.start = (state.start.slice(0, index)).concat(state.start.slice(index+1, state.start.length));
      }
    }

  }
    console.log(state.start);
}
export const changeConfig = (state, configC) => {
  console.log(configC);
  if(state.configData[configC.name]){
    console.log("already");
    delete state.configData[configC.name];
  }
  state.configData[configC.name] = deepCopy(configC.config);
  console.log(state.configData);
}
export const changeResult = (state, result) => {
  console.log(result);
  if(state.runResult[result.name]){
    console.log("already");
    delete state.runResult[result.name];
  }
  state.runResult[result.name] = deepCopy(result.config);
  console.log(state.runResult);
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
