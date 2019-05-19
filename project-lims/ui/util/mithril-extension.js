
import * as m from 'mithril';

var h = (function () {
    //a = controller, b = view.
    //or
    //a = module

    var routes = [];
    var models = [];

    var h = function (route, a, b) {
        var controller = a.controller || a;
        var view = a.view || b || function () { return m(); };

        /*
        if(a.controller){
            controller = a.controller;
            view = a.view || function(){ return m(); }
        }
        else{
            controller = a;
            view = b;
        }
        */

        //Introduce module name

        var module = new Module({ controller: controller, view: view, Name: 'Module Name', Title: 'Module Title' });
        routes.push({ route: route, module: module });

        return module;
    };

    h.Modules = function () {
        //return modules
    };
    h.Models = function () {
        //return models
    };
    h.Routes = function () {
        return routes;
    };

    h.xhrArray = [];
    h.request = function (args) {
        function LogRequest(xhr) {

            //10 seconds = 10000 milliseconds
            /**********************************************
            Event name 	        Interface 	    Dispatched when…
            readystatechange 	Event 	        The readyState attribute changes value, except when it changes to UNSENT.
            loadstart 	        ProgressEvent 	The fetch initiates.
            progress 	        ProgressEvent 	Transmitting data.
            abort 	            ProgressEvent 	When the fetch has been aborted. For instance, by invoking the abort() method.
            error 	            ProgressEvent 	The fetch failed.
            load 	            ProgressEvent 	The fetch succeeded.
            timeout 	        ProgressEvent 	The author specified timeout has passed before the fetch completed.
            loadend 	        ProgressEvent 	The fetch completed (success or failure). 
            ***********************************************/
            xhr.timeout = 60000;
            xhr.addEventListener('timeout', function () {
                console.log('Timeout');
            });
            xhr.addEventListener('error', function (event) {
                console.log('Request Failure');
            });
            xhr.addEventListener('loadend', function () {
                index = h.xhrArray.indexOf(xhrObject);
                if (index > -1) {
                    h.xhrArray.splice(index, 1);
                }
            });

            var xhrObject = { xhr: xhr, url: args.url }; // you can other usefull things when needed
            h.xhrArray.push(xhrObject);
        }

        args.config = LogRequest;
        args.extract = args.extract || function (xhr) {
            //xhr.responseBody
            //xhr.responseText = xhr.response
            //xhr.responseType
            //xhr.status
            //xhr.response
            //if an ajax call is aborted. all properties will have default values
            //ex. readyState: 0, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, responseURL: "", status: 0, statusText: "", responseType: "", response: ""
            //console.log(xhr.response, xhr.status, JSON.parse(xhr.response));
            if (xhr.status == 200) {
                if (xhr.response) {
                    try {
                        JSON.parse(xhr.response);
                    }
                    catch (ex) {
                        //SPA.ShowNotification('Error while trying to parse server response. Reponse wasn\'t in correct format. Please contact KNPC Customer Service.', 'Response Parse Error', 'error');
                        console.log('Error while trying to parse server response. Reponse wasn\'t in correct format. Please contact KNPC Customer Service.', 'Response Parse Error')
                        return error;
                    }
                }
                return xhr.response;
            }
                //else if (xhr.status == 404) {
                //    //Not Found
                //    return xhr.response;
                //}
            else if (xhr.status == 401) {
                //Unauthorized
                //SPA.ShowNotification('You are not authorized to receive this content. If this is an error, Please contact KNPC Customer Service.', xhr.statusText, 'error');
                console.log('You are not authorized to receive this content. If this is an error, Please contact KNPC Customer Service.', xhr.statusText);
                return false;
            }
            else if (xhr.status == 403) {
                //Forbidden
                //SPA.ShowNotification('You are forbidden to receive this content. If this is an error, Please contact KNPC Customer Service.', xhr.statusText, 'error');
                console.log('You are forbidden to receive this content. If this is an error, Please contact KNPC Customer Service.', xhr.statusText);
                return false;
            }
            else if (xhr.status == 0) //case of aborted ajax request. mithriljs expects a json response instead of an empty string.
            {
                return "[]";
            }
            else {
                var message = "";
                try {
                    message = JSON.parse(xhr.responseText);
                }
                catch (ex) { }

                //SPA.ShowNotification(message, xhr.statusText, 'error');
                console.log(message, xhr.statusText);
                return false;
            }
        };
        //args.background = true;
        args.url = args.url + '?' + (new Date()).getTime();

        return m.request(args);
    };

    h.request.abortAll = function () {
        h.xhrArray.forEach(function (xhrObject) {
            try {
                xhrObject.xhr.abort();
                console.log(xhrObject.url, 'aborted');
            }
            catch (ex) {
                console.log(xhrObject.url, ex);
            }
        });
    };

    h.route = function (el, init, ctx, callee, length) {
        el.addEventListener('click', function () { h.request.abortAll(); });

        //future: use arguments to tell signature
        //this h.route method works with element config which passes 5 arguments
        m.route(el, init, ctx, callee, length);
    };

    h.RegisterModel = function (baseUrl, fields, keys) {

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

            models = models || [];
            models.push(model);

            return model;

        })();

        return model;
    };

    h.InitializeRoutes = function (element, defaultRoute) {
        var routesObj = {};

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            routesObj[route.route] = route.module;
        }

        m.route(element, defaultRoute, routesObj);
    }

    /******************/
    /*Table Utitlities*/
    /******************/
    Function.prototype.implementsClasses = function () {
        var classes = [];
        //classes = classes instanceof Array ? classes : [classes];

        parent = this;

        this.classes = {
            add: function (className) {
                //add support for array of classNames
                classes.push(className);
                return this;
            },
            remove: function (className) {
                //add support for array of classNames
                var index = classes.indexOf(className);
                if (index != -1)
                    classes.splice(index, 1);
                return this;
            },
            toggle: function (className) {
                var index = classes.indexOf(className);
                if (index != -1)
                    classes.splice(index, 1);
                else
                    classes.push(className);
                return this;
            },
            render: function () {
                return classes.join(' ');
            },
            parent: parent
        };

        return this;
    };

    var implementsClasses = function (classes) {
        var classes = classes || [];
        classes = classes instanceof Array ? classes : [classes];

        parent = this;

        this.classes = {
            add: function (className) {
                //add support for array of classNames
                classes.push(className);
                return this;
            },
            remove: function (className) {
                //add support for array of classNames
                var index = classes.indexOf(className);
                if (index != -1)
                    classes.splice(index, 1);
                return this;
            },
            toggle: function (className) {
                var index = classes.indexOf(className);
                if (index != -1)
                    classes.splice(index, 1);
                else
                    classes.push(className);
                return this;
            },
            render: function () {
                return classes.join(' ');
            },
            parent: parent
        };

        return this;
    };

    var Cell = function (value, row, dataType) {
        this.row = row;
        var cell = this;

        var dataType = dataType || '';
        var value = value || '';
        var dateFormat = 'DD-MM-YYYY HH:mm:ss';


        this.addClass = function (className) {
            this.classes.add(className);
            return this;
        };

        this.removeClass = function (className) {
            this.classes.remove(className);
            return this;
        };

        this.setType = function (type) {
            dataType = type;
            return this;
        };

        this.setValue = function (newValue) {
            value = newValue;
            return this;
        }

        this.render = function () {
            var column = '';
            var cells = row.cells;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i] === cell) {
                    column = row.columns.get(i);
                    break;
                }
            }

            dataType = dataType || (column ? column.dataType : '');

            return m('td', { 'class': this.classes.render() }, dataType.toLowerCase() == 'datetime' ? moment(value).format(dateFormat) : value);
        }

        implementsClasses.call(this);
    };

    //Returns array of cells
    Cell.fromArray = function (values, row) {
        var cells = [];

        if (values instanceof Array)
            for (var i = 0; i < values.length; i++)
                cells.push(new Cell(values[i], row));

        return cells;
    };

    var Row = function (values, classes, table) {
        var cells = [];

        if (values instanceof Array)
            cells = Cell.fromArray(values, this);
        else
            cells.push(new Cell(values, this));

        this.table = table;
        this.cells = cells;
        this.columns = table.columns;

        this.getCell = function (cell) {
            var index;

            if (typeof (cell) === 'string') {
                var columns = this.table.columns;
                index = columns.indexOf(cell);
            }
            else {
                index = cell;
            }
            if (index < 0 || index >= this.cells.length)
                throw "Index out of range or Column name doesn't exist";

            return this.cells[index];
        };

        this.render = function () {
            return m('tr', { 'class': this.classes.render() }, [cells.map(function (cell) {
                return cell.render();
            })]);
        };

        implementsClasses.call(this, classes);
    };

    var TableColumn = function (columnName, type, classes) {
        this.dataType = type || 'string';
        this.name = columnName || 'Column';

        this.render = function () {

        };

        implementsClasses.call(this, classes);
    };

    var Table = function (columns) {
        var columns = columns || [];

        //Parsing column names if any to TableColumn objects
        if (columns instanceof Array) {
            var newColumns = [];
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (!(column instanceof TableColumn) && typeof (column) === 'string')
                    newColumns.push(new TableColumn(column));
                else
                    newColumns.push(column);
            }

            columns = newColumns;
        }

        var rows = [];
        //var cells = [];

        var table = this;

        this.render = function () {
            return m('table', { 'class': this.classes.render() }, [
                m('thead', m('tr', [
                    columns.map(function (col) {
                        return m('th', col);
                    })
                ])),
                m('tbody', [
                    rows.map(function (row) {
                        return row.render();
                    })
                ])
            ]);
        };

        this.columns = {
            add: function (col) {
                if (col instanceof Array) {
                    for (var i = 0; i < col.length; i++) {
                        var colName = col[i];
                        columns.push(colName);
                    }
                }
                else
                    columns.push(col);

                return this;
            },
            remove: function () {

            },

            indexOf: function (column) {
                for (var i = 0; i < columns.length; i++) {
                    if (column instanceof TableColumn) {
                        if (columns[i] == column)
                            return i;
                    }
                    else {
                        if (columns[i].name == column)
                            return i;
                    }
                }
                //return columns.indexOf(columnName);
                return -1;
            },

            get: function (index) {
                return columns[index];
            },

            parent: table
        };

        this.rows = {
            add: function (row, className) {
                rows.push(new Row(row, className, table));
                return this;
            },

            remove: function (index) {
                rows.splice(index, 1);
                return this;
            },

            get: function (index) {
                return rows[index];
            },

            parent: table
        };

        implementsClasses.call(this);
    };

    h.htmlHelper = {
        table: function (columns) { return new Table(columns); }
    };

    return h;

})();