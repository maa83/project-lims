

/*****************************/
    /********Future Plans***********/
    /*****************************/

    
    /**
     * Typical Uses
     */

    // Promise.resolve(1);
    // Promise.reject(1);
    // Promise.all([ new Promise(resolve, reject), new Promise(resolve, reject) ]).then( ([dataset1, dataset2]) => {  } );

    // let sampleColumns = [
    //     { render: ({row}) => {
    //         return m('td.collapsing', m('.ui.fitted.slider.checkbox', [
    //             m('input[type=checkbox]'),
    //             m('label')
    //         ]))
    //     } },
    //     'code',
    //     { name: 'location', classes: [ 'two', 'wide', 'column' ], render: ({val}) => { if(val == 'Ahmadi') return m('td.positive', val); return m('td.negative', val); } },
    //     { name: 'receivedDate', onrender: toDateTimeFormat },
    //     'matrixName',
    //     'purchaseOrderCode',
    //     'customerName',
    //     { name: 'actions', render: ({row}) => { return [ 
    //         m('td.collapsing', [
    //             m('button.ui.small.icon.button[data-tooltip=Add Result][data-inverted]', { onclick: () => { console.log('Editing ' + row.id); } }, m('i.edit.icon')),
    //             m('button.ui.small.icon.button[data-tooltip=View][data-inverted]', { onclick: () => { console.log('Viewing ' + row.id); } }, m('i.eye.icon'))
    //         ])];
    //     }}
    // ];

    // Promise.all([DataManagers.Customers.GetAll(), DataManagers.Customers.GetAllContacts(), DataManagers.TestParameters.GetAllMatrices()]).then( ([customers, contacts, matrices]) => {
    //     if(customers) setCustomers(customers);
    //     if(contacts) setContacts(contacts);
    //     if(matrices) setMatrices(matrices);
    //     m.redraw();
    // } );

    // let rulesManager = {
    //     fields: {
    //         dateReceived: {
    //             min: '',
    //             max: ''
    //         }
    //     }
    // };
    // let typesManager = {

    // };
    // function receivedDateRulesValidation(date) {
    //     let min = '', max = '';
    // }

    h = (() => {
        let h = () => {

        };
        h.route = m.route;
        h.request = {};
        h.request.abortAll = () => {};
        h.models = {};
        h.dataManagers = {};
        h.transformationManagers = {};

        h.businessRulesValidator = function() {};
        h.formValidator = function() {};

        //Models are posted to server. [POST, PUT, DELETE]
        //ViewModels are returned by server. [GET]
        //Model <=> ViewModel transformation Managers
        //click events and form post events: [businessRulesValidation, formValidation, dataTypeTransformation]

        function renderNavigationMenu() {

        }

        function createDataManager(baseUrl, keys, type=null) {        

            return {
                Get: (id) => {

                },
                GetAll: () => {

                },
                Post: (model) => {

                },
                Put: (model) => {

                },
                Delete: (id) => {

                },

                //utils
                Count: () => {

                },
                Page: (pageNum, itemsCount) => {

                }
            }
        }
        
    })();

    // var CacheManager = {};
    // var DataManagersReimp = function() {
    //     let { block, unblock } = SPA.Common;
    //     block();
    //     m.request().then( data => { unblock(); return data; } );
    //     return {

    //     }
    // }

    //var url = '[controller]/Model/{id}/submodelinclude/{submodelid}/submodelsubmodel';