
// m.route.set = ( () => {
//     let routeSet = m.route.set;
//     return function() {
//         document.querySelectorAll('div.dimmer').forEach((el) => { console.log(el); document.body.removeChild(el); })
//         let args = arguments || [];
//         routeSet(...args);
//     }
// } )();

function assignStore(ctx, state, actions) {
    let store = Redux.createStore(createReducer(state));
    let commandActions = createActions(actions);
    for(let actionName in commandActions) {
        let commandAction = commandActions[actionName];
        let action = function() { 
            let args = [].slice.call(arguments);
            store.dispatch(commandAction.apply(ctx, args));
        }
        _.assign(ctx, { [actionName]: action });
    }
    _.assign(ctx, { store });
    //_.assign(ctx, createActions(actions));
}

function createModel(baseUrl, fields, keys) {

    var baseUrl = baseUrl;
    var keys = keys || 'id';
    var _fields = fields;
    keys = keys instanceof Array ? keys : [keys];

    var GenerateKeyFields = function (id) {

        id = id || '';

        if (id instanceof Array) {
            id = id.join('/');
        }
        else if (id instanceof Object) {
            keyFields = [];

            for (var i = 0; i < keys.length; i++) {
                keyFields.push(id[keys[i]]);
            }

            id = keyFields.join('/');
        }
        else {
        }

        return id;
    }

    var model = (function () {

        var _baseUrl = baseUrl;
        var _fields = fields;

        model = function (data) {
            for (var i = 0; i < _fields.length; i++) {
                var field = _fields[i];
                try {
                    this[field] = data[field];
                }
                catch (e) {
                }
            }
        };

        model.Get = function (id) {
            id = GenerateKeyFields(id);

            var url = [_baseUrl, id].join('/');
            console.log('GET', url);

            return h.request({ url: url, data: {}, type: model, method: 'GET' });
        };
        model.Post = function (data) {
            var url = _baseUrl;
            return h.request({ url: url, data: data, method: 'POST' });
        };

        model.Put = function (data) {
            var url = [_baseUrl, data.id].join('/');
            return h.request({ url: url, data: data, method: 'PUT' });
        };

        model.Delete = function (id) {
            id = GenerateKeyFields(id);

            if (!id)
                throw 'Delete API must have a key';

            var url = [_baseUrl, id].join('/');
            return h.request({ url: url, data: {}, type: model, method: 'DELETE' });
        }

        model.Query = function (query) {

            var url = [_baseUrl, id, 'Query'].join('/');
            return h.request({ url: url, data: query, type: model, method: 'POST' });
        }

        /******************/
        /*Search Functions*/
        /******************/
        //model.Validate = function(query){
        //    var customerId = parseInt(query.customerId);
        //    if (isNaN(customerId) || customerId < 0) {
        //        throw 'Invalid Customer ID';
        //    }
        //};
        
        Count = function (query) {
            //this.Validate(query);

            var fullUrl = [
                _baseUrl,
                'Query/Count'
            ];

            return h.request({ url: fullUrl.join('/'), method: 'POST', data: query });
        };

        model.Fetch = function (query) {
            //this.Validate(query);

            var fullUrl = [
                _baseUrl,
                'Query'
            ];

            return h.request({ url: fullUrl.join('/'), method: 'POST', data: query, type: Payment });
        };

        model.FetchPaged = function (query, pageNo, itemsCount) {
            //this.Validate(query);

            var fullUrl = [
                _baseUrl,
                'Query',
                pageNo,
                itemsCount
            ];
            
            return h.request({ url: fullUrl.join('/'), method: 'POST', data: query, type: Payment });
        };

        return model;

    })();

    return model;
}