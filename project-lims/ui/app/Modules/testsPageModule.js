

/**
 * /{url}/Count
 * /{url}/Page/{itemsPerPage}/{pageNum}
 * 
 * /{controller}/Query
 * /{controller}/Query/Count
 * /{controller}/Query/Page/{itemsPerPage}/{pageNum}
 */

class TestsPageModule
{
    oninit() {
        let defState = {
            matrices: [],
            methods: [],
            tests: [],

            window: null
        };
        let actions = {
            SET_MATRICES: matrices => ({matrices}),
            ADD_MATRIX: () => {},
            REMOVE_MATRIX: () => {},

            SET_METHODS: methods => ({methods}),
            ADD_METHOD: (method, {methods}) => { methods.push(method); return { methods: [...methods] }; },
            REMOVE_METHOD: () => {},

            SET_TESTS: tests => ({tests}),
            ADD_TEST: (testParameter, {tests}) => { tests.push(testParameter); return {tests: [...tests]}; },
            REMOVE_TEST: () => {},

            SET_WINDOW: window => { return { window } },
            CLEAR_WINDOW: () => ({window: null})
        };
        assignStore(this, defState, actions);

        let ctx = this;
        let { setMatrices, setMethods, setTests } = ctx;
        ctx.store.subscribe( () => console.log(ctx.store.getState()) );
        Promise.all( [
            m.request({
                method: 'GET',
                url: 'Matrices/'
            }),
            m.request({
                method: 'GET',
                url: 'Methods/'
            }),
            m.request({
                method: 'GET',
                url: 'Tests/'
            })
        ] ).then( ([matrices, methods, tests]) => {
            setMatrices(matrices);
            setMethods(methods);
            setTests(tests);
        } );
    }

    view() {
        let ctx = this;
        let { store } = ctx;
        let { window } = store.getState();
        
        return m('.ui.doubling.stackable.grid', [
            m('.two.column.row', [
                m('.column', m('.ui.segment', m(MatricesComponent, { masterContext: ctx }))),
                m('.column', m('.ui.segment', m(MethodsComponent, { masterContext: ctx })))
            ]),
            m('.one.column.row', [
                m('.column', m('.ui.segment', m(TestsComponent, { masterContext: ctx })))
            ]),
            window? m('.centered.row', m('.ten.wide.column', m(window, { masterContext: ctx }))) : ''
        ]);
    }
}

class TestsComponent
{
    oninit() {

    }

    view({attrs: { masterContext } }) {
        let masterState = masterContext.store.getState();
        let { tests, methods } = masterState;
        let { setWindow } = masterContext;

        let testsColumns = [
            'name', 'code', 'description'
        ];

        return TableComponent({ columns: testsColumns, rows: tests, footer: [
            m('tr', [
                m('th[colspan=3]', [
                    m('button.ui.small.secondary.button', { onclick: () => {
                        setWindow(null);
                    } }, m( 'i.minus.icon' ), 'Delete'),
                    m('button.ui.small.button.right.floated', { onclick: () => {
                        setWindow(TestAddModule);
                    } }, m( 'i.plus.icon' ), 'Add')
                ])
            ])
        ] });
    }
}

class TestAddModule
{
    oninit() {
        let defState= {
            code: '',
            name: '',
            description: '',

            selectedMatrices: '',
            testMethods: [],
            selectedMethodId: null,
            selectedMethodPrice: ''
        };
        let actions = {
            SET_CODE: code => ({code}),
            SET_NAME: name => ({name}),
            SET_DESCRIPTION: description => ({description}),

            SET_MATRICES: matrices => ({selectedMatrices: matrices}),

            SELECT_METHOD: methodId => ({selectedMethodId: methodId}),
            SET_METHOD_PRICE: price => ({selectedMethodPrice: price}),
            ADD_TEST_METHOD: (method, {testMethods}) => { testMethods.push(method); return { testMethods: [...testMethods] }; },
            REMOVE_TEST_METHOD: (methodId, { testMethods }) => { 
                let index = testMethods.findIndex( method => (method.methodId == methodId) ); 
                if(index != undefined) {
                    let deleted = testMethods.splice(index, 1);
                    return { testMethods: [...testMethods] };
                }
                return {};
            },
            CLEAR_SELECTED_METHOD: () => ({selectedMethodId: null, selectedMethodPrice: ''})
        };

        assignStore(this, defState, actions);
        let ctx = this;
        this.store.subscribe( () => console.log(ctx.store.getState()) );

    }

    view({ attrs: { masterContext } }) {
        let masterState = masterContext.store.getState();
        let { setWindow, addTest } = masterContext;
        let { matrices, methods } = masterState;

        let ctx = this;
        let state = ctx.store.getState();
        let { code, name, description, selectedMethodId, selectedMethodPrice, testMethods, selectedMatrices } = state;
        let { setCode, setName, setDescription, addTestMethod, removeTestMethod, setMethodPrice, selectMethod, clearSelectedMethod, setMatrices } = ctx;

        return m(WindowComponent, {
            oncreate: ({state, dom}) => { let handle = state.createHandle(dom); handle.show(); },
            onApprove: handle => {
                let currentState = ctx.store.getState();
                let { name, code, description, selectedMatrices, testMethods } = currentState;
                let testParameter = { name, code, description, matrices: selectedMatrices.split(',').map( matrixId => (matrixId.trim()) ), methods: testMethods.map( method => ({methodId: method.methodId, price: method.methodPrice}) ) };
                
                m.request({
                    method: 'POST',
                    url: 'Tests/',
                    data: testParameter
                }).then( testParameter => { addTest(testParameter); handle.hide(); setWindow(null); } ).catch( error => console.log(error) );
            },
            onDeny: h => setWindow(null) ,
            onClose: handle => {  }
        }, [
            m('.ui.form', [
                m('.two.fields', [
                    FieldComponent({
                        name: 'name',
                        value: name,
                        onchange: setName
                    }),
                    FieldComponent({
                        name: 'code',
                        value: code,
                        onchange: setCode
                    })
                ]),
                m('.field', [
                    m('label[for=description]', 'Description'),
                    m('input[type=text][name=description]', { value: description, onchange: m.withAttr('value',  setDescription ) })
                ]),

                m('.field', [
                    m('label[for=matrices]', 'Matrices'),
                    m(DropDownComponent, { 
                        selection: true,
                        multiple: true,
                        search: true,
                        items: matrices,
                        value: selectedMatrices,
                        onchange: setMatrices
                    })
                ]),
                
                m('.ui.dividing.header', m('h5', 'Methods')),

                TableComponent( {

                    columns: [ 'methodName', 'methodPrice', { name: 'actions', render: ({row}) => {
                        return m( 'td.collapsing',  [
                            m('button.ui.tiny.icon.button', { onclick: () => {
                            }  }, m('i.edit.icon')),
                            m('button.ui.tiny.icon.button', { onclick: () => {
                                removeTestMethod(row.methodId);
                            } }, m('i.times.icon'))
                        ]);
                    } } ],

                    rows: testMethods,

                    footer: [
                        m('tr', [
                            m('th', m(DropDownComponent, { selection: true, fluid: true,
                                value: selectedMethodId,
                                onchange: selectMethod,
                                items: methods.filter(method => { return testMethods.find( testMethod => (testMethod.methodId == method.id) ) ? false : true; }).map( method => ({ id: method.id, name: method.name }) ) })),
                            m('th.four.wide.column', m('.ui.right.labeled.fluid.input', [
                                m('input[type=text]', { value: selectedMethodPrice, onchange: m.withAttr('value', setMethodPrice) }),
                                m('label.ui.label', 'KD')
                            ])),
                            m('th.collapsing', [
                                m('button.ui.positive.small.button', { onclick: () => {
                                    let currentState = ctx.store.getState();
                                    let { selectedMethodId, selectedMethodPrice } = currentState;
                                    let currentMasterState = masterContext.store.getState();
                                    let { methods } = currentMasterState;
                                    let methodName = methods.find( method => (method.id == selectedMethodId) ).name;
                                    let testMethod = { methodId: selectedMethodId, methodName: methodName, methodPrice: selectedMethodPrice };
                                    addTestMethod(testMethod);
                                    clearSelectedMethod();
                                } }, 'Add')
                            ])
                        ])
                    ]

                } )
            ])
        ] );

    }
}

class MethodsComponent
{
    view({attrs: {masterContext} }) {
        let masterState = masterContext.store.getState();
        let { methods } = masterState;
        let { setWindow } = masterContext;

        let methodsColumns = [
            { name: 'name', render: ({val, row, cell}) => { return m('td.collapsing', val) } },
            { name: 'code', render: ({val}) => ( m('td.collapsing', val) ) },
            { name: 'unitOfMeasurement', text: 'Unit', render: ({val}) => ( m('td.collapsing', val) ) },
            'description'
        ];

        return TableComponent({ columns: methodsColumns, rows: methods, footer: [
            m('tr', [
                m('th[colspan=4]', [
                    m('button.ui.button.right.floated', { onclick: () => {
                        setWindow(MethodAddModule);
                    } }, [
                        m('i.plus.icon'),
                    ], 'Add'),
                    m('button.ui.secondary.button', [
                        m('i.minus.icon'),
                    ], 'Delete')
                ])
            ])
        ] });
    }
}

class MethodAddModule
{
    oninit() {
        const defState = {
            code: '',
            name: '',
            unit: '',
            description: ''
        };
        const actions = {
            SET_CODE: code => ({code}),
            SET_NAME: name => ({name}),
            SET_UNIT: unit => ({unit}),
            SET_DESCRIPTION: description => ({description})
        };
        assignStore(this, defState, actions);
    }

    view({attrs: { masterContext }}) {
        let { clearWindow, addMethod } = masterContext;
        let ctx = this;
        let { store, setCode, setName, setUnit, setDescription } = ctx;
        let { code, name, unit, description } = store.getState();

        return m(WindowComponent, { visible: false, oncreate: ({state, dom}) => { let handle = state.createHandle(dom); handle.show(); }, onApprove: handle => {

            let { name, code, unit, description } = ctx.store.getState();
            

            m.request({
                method: 'POST',
                url: '/Methods/',
                type: MethodModel,
                data: new MethodModel({name, code, unitOfMeasurement: unit, description})
            }).then( method => {

                addMethod(method);
                handle.hide();
                clearWindow();

            } ).catch( error => console.log(error) );
        }, onDeny: handle => { handle.hide(); clearWindow(); } }, [
            m('.ui.dividing.header', m('h3', 'Add Method Form')),
            m('.ui.form', [
                m('.three.fields', [
                    FieldComponent({
                        name: 'name',
                        value: name,
                        onchange: setName
                    }),
                    FieldComponent({
                        name: 'code',
                        value: code,
                        onchange: setCode
                    }),
                    FieldComponent({
                        name: 'unitOfMeasurement',
                        value: unit, 
                        onchange: setUnit
                    })
                ]),
                m('.field', [
                    m('label[for=description]', 'Description'),
                    m('textarea[name=description]', { onchange: m.withAttr('value', setDescription), value: description })
                ])
            ])
        ]);
    }
}

class MatricesComponent
{
    view({attrs: {masterContext} }) {
        let masterState = masterContext.store.getState();
        let { matrices } = masterState;
        let { setWindow } = masterContext;

        let matricesColumns = [
            'name', 'code'
        ];

        return TableComponent({ columns: matricesColumns, rows: matrices, footer: [
            m('tr', [
                m('th[colspan=4]', [
                    m('button.ui.button.right.floated', { onclick: () => {
                        setWindow(MatrixAddModule);
                    } }, [
                        m('i.plus.icon'),
                    ], 'Add'),
                    m('button.ui.secondary.button', [
                        m('i.minus.icon'),
                    ], 'Delete')
                ])
            ])
        ] });
    }
}

class MatrixAddModule
{
    oninit() {

    }

    view({attrs: { masterContext }}) {
        let { clearWindow } = masterContext;
        return m(WindowComponent, { visible: false, oncreate: ({state, dom}) => { let handle = state.createHandle(dom); handle.show(); }, onApprove: whnd => console.log('approved', whnd), onDeny: handle => { handle.hide(); clearWindow(); } }, [
            m('.ui.dividing.header', m('h3', 'Add Matrix Form')),
            m('.ui.form', [
                m('.two.fields', [
                    FieldComponent({
                        name: 'name',
                        value: ''
                    }),
                    FieldComponent({
                        name: 'code',
                        value: ''
                    })
                ])
            ])
        ]);
    }
}