

//import lodash library

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