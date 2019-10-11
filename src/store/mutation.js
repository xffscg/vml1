/**
 * 
 * @authors xff (you@example.org)
 * @date    2019-10-09 20:14:12
 * @version $Id$
 */
export const changeType = (state, funcType) => {
	state.funcType = funcType;
	console.log(state.funcType);
}
export const getPro = (state, proN) => {
	state.proList = deepCopy(proN);
}
export const getAlg = (state, alg) => {
	state.algList = deepCopy(alg);
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
