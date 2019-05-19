
import * as _ from 'lodash'
import { createStoreOrig } from 'redux'

/*****************/
//State Management Functions
/*****************/

export function createActions(actions) {

    if (!_.isPlainObject(actions)) throw TypeError('Passed actions must be of a type Object');
    if (!_.values(actions).every(function (item) { return _.isFunction(item); })) throw TypeError('Property values must be callback functions');

    let newActions = {};

    let keys = _.keys(actions);

    for (let key in actions) {
        let funcName = _.camelCase(key);
        
        newActions[funcName] = (e) => {
            
            let args = [].slice.call(arguments);
            const callback = (state) => { 
                let obj = actions[key].apply(this, [...args, state]);
                return obj;
            };
            
            return { type: key, command: callback };
        }
    }

    return newActions;
}

export function createReducer(defState, reducer) {
    return (state, action) => {
        state = state || defState;
        action = action.command ? { type: action.type, ...action.command(state) } : action;
        //let newState = Object.assign({ ...state }, _.omit(action, 'type'))
        let newState = _.assign({ ...state }, _.omit(action, 'type'))
        return reducer ? reducer(newState, action) : newState;
    }
}


export const createStore = createStoreOrig;





export function createBasicActions(actions) {

    if (!_.isPlainObject(actions)) throw TypeError('Passed actions must be of a type Object');
    if (!_.values(actions).every(function (item) { return _.isFunction(item); })) throw TypeError('Property values must be callback functions');

    let newActions = {};

    let keys = _.keys(actions);

    for (let key in actions) {
        let funcName = _.camelCase(key);
        
        newActions[funcName] = (args) => {
            
            //because arguments doesn't have .concat method. the compilation of ts to es3
            args = Array.prototype.slice.call(arguments);
            let obj = actions[key].apply(this, args);
            //let obj = actions[key].apply(this, [...args, state]);
            //to provide extra functionality for the reducer. knowing the command.
            obj['type'] = key;
            return obj;
        }
    }

    return newActions;
}

export function createBasicReducer(defState) {
    return function (state, action) {
        state = state || defState;

        return Object.assign({ ...state }, _.omit(action, 'type'));
    }
}


function createActionsOld(actions) {

    if (!_.isPlainObject(actions)) throw TypeError('Must be an Object');
    if (!_.values(actions).every(function (item) { return _.isFunction(item); })) throw TypeError('property values must be callback functions');

    let newActions = {};

    let keys = _.keys(actions);

    for (key in actions) {
        let funcName = _.camelCase(key);
        //to immediate function invokation to capture 'key'
        newActions[funcName] = (function (key) {
            return function (args) {
                
                let obj = actions[key].apply(this, arguments);
                //to provide extra functionality for the reducer. knowing the command.
                obj['type'] = key;
                return obj;
            }
        })(key);
    }

    return newActions;
}