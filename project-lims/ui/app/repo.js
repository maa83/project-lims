

/***********************/
    /********Managers*******/
    /***********************/


    const DataManagers = (() => {
        
        const ctx = {

            Samples: {
                Get: (id) => {
                    return m.request({
                        method: 'GET',
                        url: ['Samples', id].join('/'),
                        type: SampleViewModel
                    });
                },
                GetAll: () => {
                    return m.request({
                        method: 'GET',
                        url: '/Samples/',
                        type: SampleSummaryViewModel
                    });
                }
            },

            PurchaseOrder: {
                Get: (id) => {
                    return m.request({
                        method: 'GET',
                        url: ['/PurchaseOrderRequests', id].join('/'),
                        type: PurchaseOrderRequestViewModel
                    });
                },
                GetAll: () => {
                    return m.request({
                        method: 'GET',
                        url: '/PurchaseOrderRequests/',
                        type: PurchaseOrderRequestViewModel
                    });
                },
                GetBySampleId: () => {},
                GetQuotation: (porId) => {

                },
                //POST or PUT
                Save: (por) => {

                    if(!por) return Promise.reject('Invalid POR Object');

                    let method = por.id? 'PUT' : 'POST';

                    let { code, contactId, receivedDate, samples, quotation } = por;

                    return m.request({
                        method,
                        url: '/PurchaseOrderRequests/',
                        data: { ...por }
                    });
                },
                Delete: (porId) => {

                    if(!porId) return Promise.reject('Invalid POR ID');

                    return m.request({
                        method: 'DELETE',
                        url: ['/PurchaseOrderRequests', porId].join('/')
                    });
                }
            },

            Customers: {
                Get: function(id) {
                    return m.request({
                        method: 'GET',
                        url: ['/Contacts', id].join('/')
                    });
                },
                GetAll: function() {
                    let { customers } = SPA.store.getState();
                    let { setCustomers } = SPA;
                    if(customers && customers.length > 0)
                        return new Promise( (resolve, reject) => { resolve(customers); } );
                    
                    return m.request({
                        method: 'GET',
                        url: '/Customers/',
                        type: CustomerModel
                    }).then( customers => { setCustomers(customers); return customers; } );

                },
                GetContact: (id) => { },
                GetContacts: (customerId) => {
                    return ctx.Customers.GetAllContacts().then( contacts => (contacts.filter( (contact) => (contact.customerId == customerId) )) );
                },
                GetAllContacts: function() {

                    let { contacts } = SPA.store.getState();
                    let { setContacts } = SPA;
                    if(contacts && contacts.length > 0)
                        // return [...customers];
                        return Promise.resolve(contacts);
                    
                    return m.request({
                        method: 'GET',
                        url: '/Contacts/',
                        type: ContactModel
                    }).then( contacts => { setContacts(contacts); return contacts; } );
                }
            },

            TestParameters: {
                Get: (id) => {

                },
                GetByMethodId: (methodId) => { 
                    let testMethodAssignment = [
                        { testParameterId: 1, methodId: 1 },
                        { testParameterId: 1, methodId: 2 },
                        { testParameterId: 1, methodId: 3 },
                        { testParameterId: 2, methodId: 1 },
                        { testParameterId: 2, methodId: 4 },
                        { testParameterId: 3, methodId: 4 },
                        { testParameterId: 3, methodId: 5 },
                        { testParameterId: 3, methodId: 6 }
                    ];
                    let testParameterIds = testMethodAssignment.filter(item => (item.methodId == methodId)).map( item => (item.testParameterId) );
                    return ctx.TestParameters.GetAll().filter( testParameter => ( testParameterIds.findIndex( testParameterId => (testParameterId == testParameter.id) ) >= 0 ) );
                },
                GetByMatrixId: (matrixId) => {
                    return m.request({
                        method: 'GET',
                        url: ['/Matrices', matrixId, 'Tests'].join('/'),
                        type: TestParameterModel
                    });
                },
                GetAll: function() {
                    return m.request({
                        method: 'GET',
                        url: '/Tests/',
                        type: TestParameterModel
                    });
                },
                GetMethod: (id) => {
                    return m.request({
                        method: 'GET',
                        url: ['/Methods', id].join('/'),
                        type: MethodModel
                    });
                },
                GetMethods: (testParameterId) => {
                    return m.request({
                        method: 'GET',
                        url: ['/Tests', testParameterId, 'Methods/'].join('/'),
                        type: MethodModel
                    });
                },
                GetTestParameterMethod: (testParameterId, methodId) => {
                    return m.request({
                        method: 'GET',
                        url: ['/Tests', testParameterId, 'Methods', methodId].join('/'),
                        type: TestParameterMethodViewModel
                    });
                },
                GetMethodsByMatrixId: (matrixId) => {
                    return m.request({
                        method: 'GET',
                        url: '/Methods/',
                        type: MethodModel
                    });
                },
                GetAllMethods: () => {
                    return m.request({
                        method: 'GET',
                        url: '/Methods/',
                        type: MethodModel
                    });
                },
                GetMatrix: (id) => {
                    return ctx.TestParameters.GetAllMatrices().then( matrices => (matrices.find( matrix => (matrix.id == id) )) );
                },
                GetAllMatrices: () => {
                    let { matrices } = SPA.store.getState();
                    let { setMatrices } = SPA;
                    if(matrices && matrices.length > 0)
                        return Promise.resolve(matrices);

                    return m.request({
                        method: 'GET',
                        url: '/Matrices/',
                        type: MatrixModel
                    }).then(matrices => { setMatrices(matrices); return matrices; });
                 },

                 AddTestResult: (sampleTestParameterId, value) => {
                     return m.request({
                        method: 'POST',
                        url: ['Samples/TestParameter', sampleTestParameterId, 'Result'].join('/'),
                        data: value,
                        type: SampleTestParameterResult
                     });
                 },
                 GetSampleTestResults: (sampleTestParameterId) => {
                    return m.request({
                       method: 'GET',
                       url: ['Samples/TestParameter', sampleTestParameterId, 'Result'].join('/'),
                       data: value
                    });
                }
            }
        };

        return ctx;
    })();