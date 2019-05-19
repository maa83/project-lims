


import { createStore } from 'redux';
import { m } from 'mithril';



var state = {
    id: 1,
    name: 'Mohammad Abdullah'
};


function setId(id) {
    return {
        type: 'SET_ID',
        id
    };
}

function setName(name) {
    return {
        type: 'SET_NAME',
        name
    };
}

function createCommand(commandName, callback) {
    return commandName;
}

var setSomething = createCommand('', (args) => { return {} });
execute(setSomething, args)

var reducer = function (state, action) {
    state = state || {
        id: 1,
        name: 'Mohammad Abdullah'
    };

    switch (action.type) {
        case 'SET_NAME':
            state = Object.assign({}, ...state, { name: action.name });
            break;
        default:
            state = Object.assign({}, ...state);
            break;
    }

    return state;
}

var testStore = createStore(reducer);
var log = testStore.subscribe(() => {
    var state = testStore.getState();
    console.log(state.name);
});

testStore.dispatch(setName('Hiba Abdulqader'));
