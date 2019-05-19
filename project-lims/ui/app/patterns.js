class HomeModule
{
    constructor(store) {
        this.store = store;
    }

    oninit() {
        this.modalId = 'testParameterModal';
    }

    oncreate() {

        // $('.dropdown').dropdown({
        //     onAdd: (val, text, choice) => {
        //         // console.log(val, text, choice);
        //     },
        //     onRemove: (val, text, choice) => {
        //         // console.log(val, text, choice);
        //     },
        //     onChange: (val, text, choice) => {
        //         //console.log(val, text, choice);
        //     },
        //     allowAdditions: true,
        //     match: 'text',
        //     forceSelection: false
        // });

    }

    submit() {
        this.matrixDropdownHandle.clear();
    }

    view() {
        var store = this.store;
        let currentState = store.getState();

        const testParameters = [
            { id: 1, name: 'Test Parameter 1', code: 'TEST1', description: 'TEST1' },
            { id: 2, name: 'Test Parameter 2', code: 'TEST2', description: 'TEST2' }
        ];
        const matrices = [
            { id: 1, name: 'Solid' },
            { id: 2, name: 'Water' },
            { id: 3, name: 'Gas' }
        ];
        const methods = [
            { id: 1, name: 'Method 1', unit: 'psi' },
            { id: 2, name: 'Method 2', unit: 'm^2' },
            { id: 3, name: 'Method 3', unit: 'cm^2' }
        ];

        let segmentMenu = m('.ui.top.attached.menu', [
            m('.ui.icon.dropdown.item', [
                m('i.wrench.icon'),
                m('.menu', [
                    m('.item', 'Action')
                ])
            ]),

            m('.right.menu', [
                m('button.ui.small.button.item', { onclick: () => { console.log('clicked'); } }, [
                    m('i.plus.icon'),
                    'Add Test'
                ]),
                m('button.ui.button.item', { onclick: () => { console.log('clicked'); } }, [
                    m('i.plus.icon'),
                    'Add Test Matrix'
                ]),
                m('button.ui.button.item', { onclick: () => { console.log('clicked'); } }, [
                    m('i.plus.icon'),
                    'Add Test Method'
                ])
            ])
        ]);

        var icon = 'boxes';
        var iconEl = ['i.', icon, '.icon'].join('');

        let segment = m('.ui.bottom.attached.segment', m('.ui.stackable.double.grid', [
            m('.two.column.centered.row', m('.column', { style: { textAlign: 'center' } }, m('.ui.icon.header', [
                m(iconEl),
                m('.content', 'New Sample', m('.sub.header', 'Enter new sample details'))
            ]))),

            m('.row', [
                m('.column', 
                    m('.ui.form', [
                        m('.ui.dividing.header', 'Initial Details'),
                        m('.four.fields', [
                            m('.field', [
                                LabelComponent('Code', 'code'),
                                m('input[type=text][name=code]', { value: currentState.code, onchange: m.withAttr('value', (val) => { store.dispatch(setCode(val.toUpperCase())); }) })
                            ]),
                            m('.field', [
                                LabelComponent('Location', 'location'),
                                m('input[type=text][name=location]', { value: currentState.location, onchange: m.withAttr('value', (val) => { store.dispatch(setLocation(val)); }) })
                            ]),
                            m('.field', [
                                LabelComponent('Received Date', 'receivedDate'),
                                m('input[type=date][name=receivedDate]', { value: currentState.receivedDate, onchange: m.withAttr('value', (val) => { store.dispatch(setReceivedDate(val)); }) })
                            ]),
                            m('.field', [
                                m('label[for=matrix]', 'Matrix'),
                                m(DropDownComponent, {
                                    text: 'Select Matrix ...',
                                    oncreate: (({state, dom}) => {
                                        this.matrixDropdownHandle = state.createHandle(dom);
                                    }).bind(this),
                                    items: matrices,
                                    onchange: (id) => { store.dispatch(selectMatrix(id)); }
                                })
                            ]),
                        ]),

                        m('.ui.dividing.header', 'Sampling Details'),

                        m('.four.fields', [
                            FieldComponent({
                                type: 'text',
                                name: 'samplingPoint',
                                value: currentState.samplingPoint,
                                onchange: (val) => { store.dispatch(setSamplingPoint(val)); }
                            }),
                            FieldComponent({
                                type: 'date',
                                name: 'samplingDate',
                                title: 'Sampling Date',
                                value: currentState.samplingDate,
                                onchange: (val) => { store.dispatch(setSamplingDate(val)); }
                            }),
                            FieldComponent({
                                type: 'text',
                                name: 'samplingBy',
                                value: currentState.samplingBy,
                                onchange: (val) => { store.dispatch(setSamplingBy(val)); }
                            }),
                            FieldComponent({
                                type: 'text',
                                name: 'samplingTemprature',
                                value: currentState.samplingTemprature,
                                onchange: (val) => { store.dispatch(setSamplingTemprature(val)); }
                            })
                        ]),

                        m('.ui.dividing.header', 'Test Details'),

                        m('.ui.top.attached.menu', [
                            m('.right.menu', [
                                m('button.ui.icon.button.item', { onclick: () => {
                                        this.modalHandle.show();
                                    } }, [
                                    m('i.plus.icon')
                                ])
                            ])
                        ]),
                        m('table.ui.compact.celled.bottom.attached.table', [
                            m('thead', [
                                m('tr', [
                                    m('th[width=35%]', 'Parameter'),
                                    m('th[width=10%]', 'Code'),
                                    m('th[width=35%]', 'Method'),
                                    m('th', 'Unit'),
                                    m('th', 'Actions')
                                ])
                            ]),
                            m('tbody', [
                                currentState.testParameters.map((test) => {
                                    return m('tr', [
                                        m('td', test.name),
                                        m('td', test.code),
                                        m('td', test.methodName),
                                        m('td', test.methodUnit),
                                        m('td.collapsing', [
                                            m('.ui.small.basic.icon.button[data-tooltip=delete][data-inverted]', m('i.times.icon')),
                                            m('.ui.small.basic.icon.button[data-tooltip=edit][data-inverted]', m('i.edit.icon'))
                                        ])
                                    ])
                                })
                            ]),
                            m('tfoot', [
                                m('tr', [
                                    m('th[colspan=2].field', [
                                        m(DropDownComponent, {
                                            name: 'testParameterId',
                                            items: testParameters,
                                            onchange: (id) => {
                                                store.dispatch(selectTestParameter(id));
                                            }
                                        })
                                    ]),
                                    m('th[colspan=2].field', [
                                        m(DropDownComponent, {
                                            name: 'testParameterMethodId',
                                            items: methods,
                                            onchange: (id) => {
                                                store.dispatch(selectTestParameterMethod(id));
                                            }
                                        })
                                    ]),
                                    m('th', [
                                        m('.ui.positive.button', { onclick: () => {

                                            store.dispatch(addTestParameter( new TestParameterViewModel('Test Parameter 2', 'TST2KSJ', 'Method 3', 't.m^2') ));
                                        } }, 'Add')
                                    ])
                                ])
                            ])
                        ])
                    ])
                )
            ]),

            m('.row', [
                m('.column', [
                    m('button.ui.button.float.right', { onclick: this.submit.bind(this) }, 'Submit')
                ])
            ])
        ]));

        return [
            segmentMenu, 
            segment,
            m(ModalComponent, { id: 'someModal', name: 'someModal', title: 'Some Modal', 
                onApprove: () => { 
                    //store.dispatch(addTestParameter( new TestParameterViewModel('yellow', 'TST2KSJ', 'world', 't.m^2') ));
                    //because modals have their own events. mithril only triggers with events attached to elements created by mithril.
                    //m.redraw();
                },
                oncreate: ({state, dom}) => {
                    this.modalHandle = state.createHandle(dom);
                }
            }),
            m('.ui.segment', [
                m('button.ui.button', { onclick: ((ctx) => { return () => { ctx.windowHandle.show(); } })(this) }, 'Show Window'),
                m('button.ui.button', { onclick: ((ctx) => { return () => { ctx.windowHandle.hide(); } })(this) }, 'Hide Window'),
                m(WindowComponent, { 
                        onApprove: () => { console.log('approve'); },
                        onDeny: () => { console.log('deny'); },
                        visible: false,
                        oncreate: ({state, dom}) => { this.windowHandle = state.createHandle(dom); this.windowHandle.show(); }
                    }, [
                        m('.ui.form', [
                            FieldComponent({
                                name: 'userName',
                            }),
                            FieldComponent({
                                name: 'password'
                            }),
                            m('button.ui.button', { onclick: () => { console.log('clicked'); } }, 'Click Me')
                    ])
                ])
            ]),
            m(SegmentComponent, [
                m('.ui.form', [
                    FieldComponent({
                        name: 'userName',
                    }),
                    FieldComponent({
                        name: 'password'
                    }),
                    m('.field', [
                        m(DropDownComponent, {
                            text: 'Select Something',
                            name: 'parameter',
                            search: true,
                            render: (item) => {
                                return [
                                    m('i.check.icon'),
                                    item.name,
                                    item.description? m('span.description', item.description) : ''
                                ]
                            },
                            items: [
                                { id: 1, name: 'Selection 1', description: 'Some Description' },
                                { id: 2, name: 'Selection 2' }
                            ]
                        })
                    ])
                ])
            ]),
            m(SegmentComponent, [
                m('.ui.form', [
                    FieldComponent({
                        name: 'userName',
                    }),
                    FieldComponent({
                        name: 'password'
                    })
                ])
            ]),
            m(MasterPage)
        ];
    }
};

class SampleModule
{
    oninit() {
        const defState = {
            field: ''
        };
        const actions = {
            SET_FIELD: (val, state) => { return { field: val } },
            CLEAR: () =>(defState)
        }

        //creates this.store, this.setField
        assignStore.call(this, defState, actions);
        let store = this.store;
        this.logger = store.subscribe(() => { console.log(store.getState()); });

        this.logger(); //to unsubscribe
    }

    view() {
        let ctx = this;
        let store = ctx.store;
        let state = store.getState();
        let { setField } = ctx;

        return m('.ui.form', [
            m('.field', [
                m('label[for=field]', 'Field'),
                m('input[type=text][name=field]', { value: '' })
            ])
        ])
    }
}

class SampleWindow
{
    oninit({attrs: { onApprove=null, onDeny=null }}) {
        //handles: { windowHandle: { show, hide } }

        this.createHandle = ( ctx => { return () => {
            return {
                show: () =>  { this.windowHandle.show(); },
                hide: () => { this.windowHandle.hide(); }
            };
        } } )(this);
    }

    view({attrs: { onApprove=null, onDeny=null }}) {
        let ctx = this;

        //create windowHandle using WindowComponent.oncreate{ state.createHandle.call(state, dom) } and assign to this.windowHandle;
        //create sampleStore using SampleModule.oncreate{ state.store } and assign to this.sampleStore; 
        return m(WindowComponent, { title: 'Sample Add',
                                    name: 'sampleAddWindow',
                                    onApprove: (wndh) => { onApprove(ctx.sampleStore.getState()); ctx.sampleContext.clear(); wndh.hide(); /*ctx.windowHandle.hide();*/ },
                                    onDeny: (wndh) => { onDeny(wndh); }, 
                                    oncreate: ({state, dom}) => { ctx.windowHandle = state.createHandle(dom); ctx.windowHandle.show(); } },

                    //the window elements
                    //Get SampleModule context(state)
                    //state contains all required state actions
                    m(SampleModule, { oncreate: ({state: sampleCtx}) => { ctx.sampleStore = sampleCtx.store; ctx.sampleContext = sampleCtx; } }));
    }
}

class SampleWindow2
{
    oninit() {
        const defState = {
            field: ''
        };
        const actions = {
            SET_FIELD: (val, state) => { return { field: val } },
            CLEAR: () => (defState)
        }

        //creates this.store, this.setField
        assignStore.call(this, defState, actions);
        let store = this.store;
        this.logger = store.subscribe(() => { console.log(store.getState()); });

        this.logger(); //to unsubscribe

        this.createHandle = ( ctx => { return () => {
            return {
                show: () =>  { this.windowHandle.show(); },
                hide: () => { this.windowHandle.hide(); }
            };
        } } )(this);
    }

    view({attrs: { title, name, id, onApprove, onDeny }}) {
        let ctx = this;
        let store = ctx.store;
        let state = store.getState();
        let { setField } = ctx;

        return m(WindowComponent, {
            visible: true,
            title: '',
            name: '',
            id: '',
            oncreate: ({state, dom}) => {
                ctx.windowHandle = state.createHandle.call(state, dom);
            },
            onApprove: (wndh) => { onApprove(state); ctx.clear(); wndh.hide(); },
            onDeny: (wndh) => { onDeny(); wndh.hide(); },
            onClose: (wndh) => { wndh.hide(); }
        }, [
            m('.ui.form', [
                m('.field', [
                    m('label[for=field]', 'Field'),
                    m('input[type=text][name=field]', { value: '' })
                ])
            ])
        ]);
    }
}

class SampleWindow3
{
    oninit({attrs: { onApprove=null, onDeny=null }}) {
        //handles: { windowHandle: { show, hide } }
    }

    view({attrs: { onApprove=null, onDeny=null }}) {
        let ctx = this;

        return m(WindowComponent, { title: 'Sample Add', name: 'sampleAddWindow', onApprove: () => { onApprove(ctx.sampleStore.getState()); ctx.windowHandle.hide(); }, onDeny, oncreate: ({state, dom}) => { ctx.windowHandle = state.createHandle(dom); ctx.windowHandle.show(); } }, m(SampleAddWindowComponent, { oncreate: ({state: sampleCtx}) => { ctx.sampleStore = sampleCtx.store; } }));
    }
}

class SamplePage
{
    oninit() {
        const defState = {
            field: ''
        };
        const actions = {
            SET_FIELD: (val, state) => { return { field: val } }
        }

        //creates this.store, this.setField
        assignStore.call(this, defState, actions);
        let store = this.store;
        this.logger = store.subscribe(() => { console.log(store.getState()); });

        this.logger(); //to unsubscribe
    }

    view() {
        let ctx = this;
        let store = ctx.store;
        let state = store.getState();
        let { setField } = ctx;

        return m('.ui.form', [
            m('.field', [
                m('label[for=field]', 'Field'),
                //m('input[type=text][name=field]', { value:  })
            ])
        ])
    }
}


//Add-Remove Window example
class MasterPage
{
    oninit() {
        let defState = {
            porModule: false
        };
        const actions = {
            SHOW_MODULE: () => ({porModule: true}),
            HIDE_MODULE: () => ({porModule: false})
        };
        createStore(this, defState, actions);
    }
    view() {

        const ctx = this;
        let store = this.store;
        let state = store.getState();

        let porModule = m(SampleWindow, {
            oncreate: ({state}) => { ctx.sampleHandle = state.createHandle(dom) }, 
            onApprove: (data) => {
                //do something with the data
                console.log('close window', data); 
                store.dispatch(ctx.hidePorModule());
            },
            onClose: () => {
                //do something
                store.dispatch(ctx.hidePorModule());
            }
        });
        const button = m('button.ui.button', {
            onclick: () => {
                store.dispatch(ctx.showPorModule());
            }
        }, 'Test Button');

        const children = [];
        if(state.porModule) children.push(porModule);
        children.push(button);

        return m('.ui.segment', ...children);
    }
}


class PORModule
{
    oninit( { attrs: { onApprove=null, onDeny=null, onClose=null } } ) {
        const defState = {
            field1: '',
            field2: ''
        }
        const actions = createActions({
            SET_FIELD_1: (val) => ( { field1: val } ),
            SET_FIELD_2: (val) => ( { field2: val } ),
            CLEAR_ALL: () => ( defState )
        });
        _.assign(this, actions);
        this.store = Redux.createStore(createReducer(defState));

        this.onApprove = () => {
            let state = this.store.getState();
            this.store.dispatch(this.clearAll());
            console.log('approved', state);
            onApprove(state);
        };
        this.onDeny = () => {
            console.log('denied');
            onDeny();
        };
        this.onClose = () => {
            console.log('closed');
            onClose();
        };
    }

    clear() {
        this.store.dispatch(this.clearAll());
        //clear dropdowns.
        //clear checkboxes.
    }

    execute(action) {
        this.store.dispatch(action);
    }

    view() {
        const ctx = this;
        let store = this.store;
        let state = store.getState();

        return m(WindowComponent, {
            oncreate: (( {state, dom} ) => {
                this.windowHandle = state.createHandle(dom);
                this.windowHandle.show();
            }).bind(this),
            onApprove: ctx.onApprove.bind(ctx)
        }, m('.ui.form', [
            FieldComponent({
                name: 'field_1',
                value: state.field1,
                onchange: (val) => { ctx.store.dispatch(ctx.setField1(val)); }
            }),
            FieldComponent({
                name: 'field_2',
                value: state.field2,
                onchange: (val) => { ctx.store.dispatch(ctx.setField2(val)); }
            })
        ]))
    }
}