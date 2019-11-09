/**
 * 
 * @authors xff (you@example.org)
 * @date    2019-10-09 20:14:12
 * @version $Id$
 */
export const changeType = (state, funcType) => {
  console.log(funcType);
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
export const changeReportList = (state, content) => {
  if(content.type = "add"){
    state.reportList.push(content.detail);
  }
}
export const changeDrag = (state, content) => {
	state.dragContent = content;
}
export const changeClear = (state, flag) => {
  state.clearFlag = flag;
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
  state.relationship = [];
  state.relationship = deepCopy(relation);
  console.log(state.relationship);
}
export const changeStart = (state, start) => {
  if(start.type == "add"){
    state.start.push(start.detail);
  }else if(start.type == "clear"){
    state.start = [];
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
}
export const changeConfig = (state, configC) => {
  if(configC.type == "addNode"){    
    if(state.configData[configC.detail.name]){
      delete state.configData[configC.detail.name];
    }
    state.configData[configC.detail.name] = {type :configC.detail.type, name : configC.detail.nameAll, config : {}, next : [], pre : [] , location : {}};
  }else if(configC.type == "delNode"){
    delete state.configData[configC.detail.name];
  }else if(configC.type == "addConfig"){
     state.configData[configC.detail.name]["config"] = {};
    state.configData[configC.detail.name]["config"] = deepCopy(configC.detail.config);
  }else if(configC.type == "addRelation"){
     // state.configData[configC.detail.name]["config"] = {};
     // state.configData[configC.detail.name]["config"] = deepCopy(configC.detail.config);
  }else if(configC.type == "clear"){
    state.configData = {}
  }
}
export const changeResult = (state, result) => {
  if(state.runResult[result.name]){
    delete state.runResult[result.name];
  }
  state.runResult[result.name] = deepCopy(result.config);
}
export const changeLoc = (state, result) => {
  if(result.name == "clearClear"){
    state.location = {};
  }else{
    if(state.location[result.name]){
      delete state.location[result.name];
    }
    console.log(result);
    state.location[result.name] = {x : result.x, y : result.y};
  }
  console.log(state.location);
}
export const changeRun = (state, result) => {
  state.runList = {};
  state.runList = deepCopy(result);
}
export const changeConfigOrder = (state, node) => {
  console.log(node);
  // if()
  if(node.type == "addColumn"){
    if(!state.configOrder[node["config"]["name"]]){
      state.configOrder[node["config"]["name"]] = {column : deepCopy(node["config"]["column"]), columnNumber : []};
    }else{
      state.configOrder[node["config"]["name"]]["column"] = [];
      state.configOrder[node["config"]["name"]]["column"] = deepCopy(node["config"]["column"]);
    }
  }else if(node.type == "addColumnN"){
    if(!state.configOrder[node["config"]["name"]]){
      state.configOrder[node["config"]["name"]] = {column : [], columnNumber : deepCopy(node["config"]["columnNumber"])};
    }else{
      state.configOrder[node["config"]["name"]]["columnNumber"] = [];
      state.configOrder[node["config"]["name"]]["columnNumber"] = deepCopy(node["config"]["columnNumber"]);
    }
  }else if(node.type == "del"){
    delete state.configOrder[node["config"]["name"]];
  }else if(node.type == "clear"){
    state.configOrder = {};
  }
  console.log(state.configOrder);
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
