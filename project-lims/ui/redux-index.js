
import { createStore } from 'redux'
import { createActions, createReducer, createAdvActions, createAdvReducer } from './util/redux-extension'
import * as moment from 'moment'


/*****************/
//State Management Objects
/*****************/
var defaultCriteriaState = {
    startDate: '',
    endDate: '',
    orders: [],
    modOrders: []
};

var { setStartDate, setEndDate, setDate, clear, addDays } = createAdvActions({
    SET_START_DATE: startDate => ({ startDate }),
    SET_END_DATE: endDate => ({ endDate }),
    SET_DATE: (startDate, endDate) => ({ startDate, endDate }),
    ADD_DAYS: (amount, { startDate : oldStartDate }) => ({ startDate: moment(oldStartDate, format).add(amount, 'days').format('YYYY-MM-DD') }),
    CLEAR: () => (defaultCriteriaState)
});
var criteriaStore = createStore(createAdvReducer(defaultCriteriaState));

var event = criteriaStore.subscribe(function () { console.log(criteriaStore.getState()); });

let format = 'YYYY-MM-DD';
criteriaStore.dispatch(setDate('Hiba', 'Abdulqader'));
criteriaStore.dispatch(clear());
criteriaStore.dispatch(setDate(moment().format(format), moment().format(format)));
criteriaStore.dispatch(addDays(2));
criteriaStore.dispatch(clear());

