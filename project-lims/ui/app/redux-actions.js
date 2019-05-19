

//import lodash library

function createActions(actions) {

    if (!_.isPlainObject(actions)) throw TypeError('Passed actions must be of a type Object');
    if (!_.values(actions).every(function (item) { return _.isFunction(item); })) throw TypeError('Property values must be callback functions');

    let newActions = {};

    let keys = _.keys(actions);

    for (let key in actions) {
        let funcName = _.camelCase(key);
        
        //note to self:
        //whenever you need access to 'arguments' object. don't use arrow functions.
        newActions[funcName] = function() {
            
            let args = [].slice.call(arguments);
            //console.log(args, arguments, e);

            const callback = (state) => {
                let obj = actions[key].apply(this, [...args, state]);
                return obj;
            };
            
            return { type: key, command: callback };
        }
    }

    return newActions;
}

function createReducer(defState, reducer) {
    function assign(dest, src) {
        for(let prop in src)
            if(!((src[prop] instanceof Array) || (src[prop] instanceof String) || (src[prop] instanceof Number))) {
                let obj = Object.assign({}, src[prop]);
                delete src[prop];
                src[prop] = assign(src, obj);
            }
    }
    return (state, action) => {
        state = state || defState;
        action = action.command ? { type: action.type, ...action.command(state) } : action;
        //let newState = Object.assign({ ...state }, _.omit(action, 'type'))
        let newState = _.assign({ ...state }, _.omit(action, 'type'))
        return reducer ? reducer(newState, action) : newState;
    }
}