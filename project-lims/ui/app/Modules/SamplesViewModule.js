

class SamplesViewModule
{
    oninit() {
        let ctx = this;
        this.samples = [];
        this.matrices = [];
        DataManagers.TestParameters.GetAllMatrices().then( matrices => ctx.matrices = matrices );

        DataManagers.Samples.GetAll().then( samples => ctx.samples = samples );//.then( () => { m.redraw(); } );
        
    }

    view() {
        let ctx = this;
        let { samples, matrices=[] } = ctx;
        let { toDateFormat, toDateTimeFormat } = SPA.Common;

        let sampleColumns = [
            'code',
            'location',
            { name: 'receivedDate', onrender: toDateTimeFormat },
            { name: 'matrixName', text: 'Matrix' },
            'purchaseOrderRequestCode',
            { name: 'customerName', text: 'Customer' },
            { name: 'actions', render: ({row}) => { return [ 
                m('td.collapsing', [
                    m('button.ui.small.icon.button[data-tooltip=Add Result][data-inverted]', { onclick: () => { console.log('Editing ' + row.id); } }, m('i.edit.icon')),
                    m('button.ui.small.icon.button[data-tooltip=View][data-inverted]', { onclick: () => { let { id } = row; m.route.set('/sample/:id', { id }); } }, m('i.eye.icon'))
                ])];
            }}
        ];

        return TableComponent({
            compact: false,
            striped: false,
            celled: true,
            columns: sampleColumns,
            rows: samples
        });
    }
}

class SampleModule
{
    oninit() {
        let defState = {
            sampleId: 0,
            matrixId: 0,
            contactId: 0,
            purchaseOrderRequestId: 0,
            receivedDate: null,
            code: '',
            location: '',
            samplingPoint: '',
            samplingDate: '',
            samplingBy: '',
            samplingTemprature: '',

            contactName: '',

            sample: {},

            sampleTestParameters: [],

            selectedTestResultRevisions: [
                //{testId: 0, resultId: 0}
            ]
        };

        const actions = {
            SET_SAMPLE: sample => ({sample: {...sample}}),
            SET_SELECTED_RESULT_REVISION: (testId, resultId, { selectedTestResultRevisions }) => {
                let index = selectedTestResultRevisions.findIndex( selected => selected.testId == testId );
                if(index != -1) selectedTestResultRevisions.splice(index, 1);
                selectedTestResultRevisions.push({ testId, resultId });
                return { selectedTestResultRevisions: [...selectedTestResultRevisions] };
            },
            ADD_RESULT_REVISION: (resultRevision, { sample }) => { 
                let testParameter = sample.testParameters.find( testParameter => testParameter.id == resultRevision.sampleTestParameterId );
                let results = testParameter.sampleTestParameterResults;
                results.push(resultRevision);
                testParameter.sampleTestParameterResults = [...results];
                sample.testParameters = [...sample.testParameters];
                return { sample: { ...sample } };
              }
        };

        assignStore(this, defState, actions);

        //let logger = this.store.subscribe( () => { let state = this.store.getState(); console.log(state, moment().format('HH:mm:ss:SS')); } );

        let sampleId = m.route.param('id');
        let ctx = this;
        let { setSample, setSelectedResultRevision } = this;

        DataManagers.Samples.Get(sampleId).then( sample => { 
            setSample(sample);
            sample.testParameters.forEach( testParameter => {
                let lastRevision = _.last(_.sortBy( testParameter.sampleTestParameterResults, 'revision' ));
                lastRevision = lastRevision ? lastRevision.id : null;
                if(lastRevision) setSelectedResultRevision(testParameter.id, lastRevision);
            } );
            return sample.contactId;
        } );//.then( contactId => { console.log(contactId); Promise.all([DataManagers.Customers.GetContact(contactId)]).then(([contact]) => { setContactName(contact.name); } ); } ).catch( error => console.log(error) );
    }

    view() {

        let ctx = this;
        let store = ctx.store;
        let state = store.getState();
        let { setSelectedResultRevision, addResultRevision } = ctx;
        let { sample } = state;
        let { id, code, location, receivedDate, samplingPoint, samplingBy, samplingDate, 
            samplingTemprature, remarks, testParameters, customerName, contactName, matrixName, 
            purchaseOrderRequestCode, purchaseOrderRequestReceivedDate } = sample;
        let { toDateFormat } = SPA.Common;

        let testParameterColumns = [
            { name: 'testParameter', classes: [ 'six', 'wide', 'column' ], attrs: { 'colspan': '2' }, render: ({row, cell}) => { return [ m('td', row.testParameterCode), m('td', row.testParameterName) ] } },
            { name: 'method', classes: [ 'six', 'wide', 'column' ], attrs: { 'colspan': '3' }, render: ({row, cell}) => { return [ m('td', row.methodName), m('td', row.methodCode), m('td', row.methodUnit) ] } },
            { name: 'revision', render: ({row, cell}) => {
                let sampleTestParameterId = row.id;
                let resultRevisions = [];
                if(row.sampleTestParameterResults && row.sampleTestParameterResults.length > 0) resultRevisions = row.sampleTestParameterResults.map( result => ( { id: result.id, name: ''+result.revision } ) );

                let { selectedTestResultRevisions } = state;
                let selectedRevision = selectedTestResultRevisions.find( revision => revision.testId == sampleTestParameterId ) || null;
                if(selectedRevision) selectedRevision = selectedRevision.resultId;

                return m('td.collapsing', [
                    m('label', 'Revision:'),
                    m.trust('&nbsp'),
                    m(DropDownComponent, {
                        items: resultRevisions,
                        selection: true,
                        scrolling: true,
                        compact: true,
                        value: selectedRevision,
                        text: 'N/A',
                        //oncreate: ({dom, state}) => { let handle = state.createHandle(dom); handle.setSelected(selectedRevision); },
                        onchange: val => setSelectedResultRevision(sampleTestParameterId, val)
                        // onupdate: ({dom}) => $(dom).dropdown('set selected', 1)
                    })
                ])
            } }, 
            { name: 'result', classes: ['two', 'wide', 'column'], render: ({row}) => {
                let { selectedTestResultRevisions, sample } = state;
                let sampleTestParameterId = row.id;
                let revision = selectedTestResultRevisions.find(revision => revision.testId == sampleTestParameterId) || '';
                let result = '';
                if(revision) {
                    let testParameter = sample.testParameters.find(testParameter => ( testParameter.id == sampleTestParameterId ) );
                    let resultRevision = testParameter.sampleTestParameterResults.find( result => result.id == revision.resultId );
                    if(resultRevision) result = resultRevision.result;
                }
                return m('td', result);
            } },
            { name: 'actions', render: ({row, cell}) => {
                return m('td.collapsing', [
                    m('button.ui.small.icon.button[data-tooltip=Add Result Revision][data-inverted]', { onclick: () => {
                        let sampleTestParameterId = row.id;

                        //move to modal function
                        let modal = document.createElement('div');
                        document.body.appendChild(modal);

                        let modalCtx = {};
                        let modalState = {
                            result: ''
                        };
                        let modalActions = {
                            SET_RESULT: val => ({result: val})
                        };
                        assignStore(modalCtx, modalState, modalActions);
                        let { setResult, store: modalStore } = modalCtx;

                        //render the content
                        m.render(modal, m('.ui.mini.modal', {
                        }, [
                            m('.content', [
                                m('.ui.form', [
                                    FieldComponent( { name: 'resultRevision', value: modalStore.getState().result, onchange: setResult } )
                                ])
                            ]),
                            m('.actions', [
                                m('button.ui.small.positive.button', { onclick: (e) => {
                                    let { result } = modalStore.getState();
                                    if(!result) return;

                                    e.target.className = e.target.className.concat( ' loading disabled' );
                                    DataManagers.TestParameters.AddTestResult(sampleTestParameterId, result ).then( result => {

                                        let resultId = result.id;
                                        addResultRevision(result);
                                        setSelectedResultRevision(sampleTestParameterId, resultId);
                                        el.modal('hide');
            
                                    } ).catch( error => { console.log(error), el.modal('hide'); } );
                                    
                                 } }, [
                                    m('i.check.icon'),
                                    ' Ok'
                                ])
                            ])
                        ]) );

                        let el = $(modal.firstChild);

                        //initialize the modal
                        el.modal({
                            detachable: true,
                            closable: true,
                            transition: 'fade',
                            duration: 200,
                            onShow: () => {},
                            onVisible: () => {},
                            onHide: (el) => {},
                            onHidden: () => {
                                document.querySelectorAll('div.dimmer').forEach((el)=>{ document.body.removeChild(el); });
                                document.body.removeChild(modal);
                            },
                            onApprove: (el) => { 
                                // DataManagers.TestParameters.AddTestResult(sampleTestParameterId, moment().format('HHmmssSSS') ).then( result => {

                                //     let resultId = result.id;
                                //     addResultRevision(result);
                                //     setSelectedResultRevision(sampleTestParameterId, resultId);
                                //     el.modal('hide');
                                //     console.log(el);
        
                                // } ).catch( error => { console.log(error), $(el).modal('hide'); } );
                                return false;
                             },
                            onDeny: (el) => {},
                            selector: {
                                //close: '.close, .actions .button',
                                close: '.close',
                                approve: '.actions .positive, .actions .approve, .actions .ok',
                                deny: '.actions .negative, .actions .deny, .actions .cancel'
                            },
                            className: {
                                active: 'active',
                                scrolling: 'scrolling'
                            }
                        }).modal('show');

                    } }, m('i.plus.icon')),

                    m('button.ui.small.icon.button[data-tooltip=Edit Result Revision][data-inverted]', { onclick: () => {
                        
                    } }, m('i.edit.icon'))
                ])
            } }
        ];

        //sample test parameter results



        return m('.ui.doubling.stackable.grid', [
            m('.centered.row', [
                
                m('.sixteen.wide.mobile.twelve.wide.tablet.ten.wide.computer.column', [
                    
                    m('.ui.segment', [
                        m('.ui.dividing.header', m('h3', 'Purchase Order Details')),
    
                        m('.ui.doubling.stackable.grid', [
                            // m('.one.column.row', [
                            //     m('.column', m('.ui.dividing.header', m('h3', 'Purchase Order Details')))
                            // ]),
                            m('.two.column.row', [
                                m('.column', [
                                    FieldsTableComponent({fields: { code: purchaseOrderRequestCode, recievedDate: toDateFormat(purchaseOrderRequestReceivedDate)} })
                                ]),

                                m('.column', [
                                    FieldsTableComponent({fields: { contact: contactName, customer: customerName} })
                                ])

                            ]),
                        ])
                    ])

                ])
            ]),

            m('.centered.row', [
                m('.sixteen.wide.mobile.twelve.wide.tablet.ten.wide.computer.column', [
                    m('.ui.doubling.stackable.grid.segment', [
                        m('.two.column.row', [
                            m('.column', [
                                m('.ui.dividing.header', m('h3', 'Initial Details')),
                                
                                FieldsTableComponent({fields: { code, location, matrix: matrixName, receivedDate: toDateFormat(receivedDate) } })
                            ]),
                            m('.column', [
                                m('.ui.dividing.header', m('h3', 'Sampling Details')),
            
                                FieldsTableComponent({fields: { point: samplingPoint, by: samplingBy, date: toDateFormat(samplingDate), 'temp.': samplingTemprature } })
                            ])
                        ]),
                        m('.one.column.row', m('.column', FieldsTableComponent( { fields: { remarks } } )))
                    ])
                ]),
            ]),

            m('.one.column.row', [
                m('.column', [
                    m('.ui.dividing.header', m('h3', 'Test Parameters')),

                    TableComponent({
                        columns: testParameterColumns,
                        rows: testParameters
                    })
                ])
            ])
        ]);
    }
}