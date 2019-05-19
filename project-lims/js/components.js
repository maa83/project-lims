

const LabelComponent = (text, forAttrib = '') => {
    let attribs = {};
    if(forAttrib)
        //attribs['for'] = forAttrib;
        Object.assign(attribs, { for: forAttrib });
    return m('label', attribs, text);
}

const FieldComponent = ({ type='text', title='', name='', value='', onchange= null }) => {
    type = ['text', 'date'].find((item) => { return item == type; }) ? type : 'text';
    onchange = onchange ? m.withAttr('value', onchange) : () => { console.log('Not Implemented'); };
    title = title ? _.startCase(title) : _.startCase(name);
    return m('.field', [
        m('label', { for: name }, title),
        m('input', { type, name, value, onchange })
    ]);
};

const DropDownComponent = ( { selection=true, search=false, multiple=false, defaultText='Select ...', name='dropdown', items=[] } ) => {

    let classes = ['.ui'];
    if(multiple) classes.push('multiple');
    if(search) classes.push('search');
    if(selection) classes.push('selection')
    classes.push('dropdown');

    return m(classes.join('.'), [
        m('.default.text', defaultText),
        m('input[type=hidden]', { name }),
        m('i.dropdown.icon'),
        m('.menu', [
            items.map( (item) => {
                //id, name and description
                const display = !item['description'] ? item.name : [
                    m('span.text', item.name),
                    m('span.description', item.description)
                ];
                return m('.item', { 'data-value': item.id }, display )
            } )
            // m('.item', { 'data-value': '1' }, 'Value')
            // m('.item', { 'data-value': '1' }, [
            //     m('span.text', 'Value'),
            //     m('span.description', 'Value Description')
            // ])
        ])
    ])
}

class ModalComponent 
{
    constructor() {
    }

    oninit(vnode) {
        console.log('Modal Initiated');

        let defaultState = {
            val1: '',
            val2: ''
        };
        let actions = createActions({
            SET_VAL1: val => ({ val1: val }),
            SET_VAL2: val => ({ val2: val }),
            CLEAR_VAL1: () => ( { val1: '' } ),
            CLEAR_VAL2: () => ( { val2: '' } ),
            CLEAR_ALL: () => defaultState
        });
        this.store = Redux.createStore(createReducer(defaultState));
        this.logger = this.store.subscribe( () => { console.log(this.store.getState()); } );
        this.id = vnode.attrs.id;

        //Object.defineProperties(this, ...actions);
        _.assign(this, actions);
        this.callback = vnode.attrs.callback;

        this.options = {
            basic: false,
            centered: false,
            size: ''
        };
    }

    oncreate(vnode) {
        console.log(vnode);
        $(vnode.dom).modal({
            centered: false,
            selector: {
                close: '.close',
                approve: '.ok, .positive',
                deny: '.cancel, .negative'
            },
            onShow: () => { console.log('modal show'); },
            onVisible: () => {  },
            onHide: (el) => { console.log('modal hide'); vnode.state.store.dispatch(vnode.state.clearAll()); },
            onHidden: () => {  },
            onApprove: (el) => { console.log('modal approved'); vnode.state.callback(vnode.state.store.getState()); },
            onDeny: (el) => { console.log('modal denied'); }
        });
    }

    view() {
        let store = this.store;
        let state = store.getState();

        return m('.ui.modal', { id: this.id, 'class': this.options.basic? 'basic' : '' }, [
            m('.header', [
                m('h3', 'Modal')
            ]),

            m('.content', [
                m('.ui.form', { 'class': this.options.basic? 'inverted' : '' }, [
                    m('.two.fields', [
                        m('.field', [
                            m('label[for=name]', 'val1'),
                            m('input[type=text][name=name][placeholder=enter val1]', { onchange: m.withAttr( 'value', val => { store.dispatch(this.setVal1(val)); } ), value: state.val1 })
                        ]),
                        m('.field', [
                            m('label[for=name]', 'val1'),
                            m('input[type=text][name=name][placeholder=enter val2]', { onchange: m.withAttr( 'value', val => { store.dispatch(this.setVal2(val)); } ), value: state.val2 })
                        ])
                    ])
                ])
                // m('.ui.segment', { 'class': this.options.basic? 'inverted' : '' }, [
                    
                // ])
            ]),

            m('.actions', [
                m('button.ui.basic.positive.button', [
                    m('i.check.icon'),
                    'Ok'
                ]),
                m('button.ui.basic.cancel.negative.button', [
                    m('i.times.icon'),
                    'Cancel'
                ])
            ])
        ]);
    }
}


class SegmentComponent
{
    constructor() {

    }

    oninit({ attrs: { inverted=false, menu={}, actions={}, header=null } }) {
        this.options = {
            inverted: inverted,
            menu: menu,
            actions: menu,
            header: header
        }
    }

    view( { children } ) {
        let nodes = [], header = this.options.header;
        if(this.options.header)
            nodes.push(m('.ui.dividing.header', m('h3', 'Some Header')));
        
        nodes.push(...children);

        return m('.ui.segment', [
            ...nodes
        ]);
    }
}


//wrapper around content
class WindowComponent
{
    bindCallback() {
        if(typeof(vnode.attrs.callback) === 'function')
            this.callback = vnode.attrs.callback;
    }

    constructor() {

    }

    oninit({ attrs: { title='', onApprove=null, onDeny=null, onClose=null, defaultState={field1: ''} } }) {
        //callback to master: [onApprove, onDeny, onClose].
        //options { modal: true | false },
        //expose APIs: { store }
        //expect:
        //three callback functions
        //master to implement state functionality
        //master to bind controls to vnode elements

        this.onApprove = (state) => {
            console.log('onApprove not implemented');
        };
        this.onDeny = () => {
            console.log('onDeny not implemented');
        }
        this.onClose = () => {
            console.log('onDeny not implemented');
        }

        if(onApprove) this.onApprove = onApprove;
        if(onDeny) this.onDeny = onDeny;
        if(onClose) this.onClose = onClose;

        // vnode.attrs
        // vnode.tag
        // vnode.children

        // let elements = [
        //     {
        //         text: 'Val',
        //         name: 'val',
        //         value: 'SomeValue',
        //         type: 'text',
        //         actions: [
        //             {
        //                 name: 'setValue',
        //                 command: '',
        //                 action: (val, state) => { return { val: state.val }; }
        //             }
        //         ],
        //         events: {
        //             onchange: (val) => { setValue(); }
        //         }
        //     }
        // ];
        // bindElements(vnode, elements);
        //Extract State
    }

    bindElements(nodes, elements) {
        if( !(nodes instanceof Array) ) nodes = [nodes];

        nodes.forEach( (node) => {

            //execute binding
            

            //traverse children
            var children = node.children;
            if(children && children instanceof Array && children.length > 0){
              bindElements(children, elements);
            }
        } );
    }

    view(vnode) {

        let modal = m('.ui.modal', [
            m('.header', [

            ]),
            m('.content', [

            ]),
            m('.actions', [
                m('button.ui.basic.positive.button', [
                    m('i.check.icon'),
                    'Ok'
                ]),
                m('button.ui.basic.positive.button', [
                    m('i.times.icon'),
                    'Cancel'
                ])
            ])
        ]);

        let segment = m('.ui.segments', [
            m('.ui.segment', [
                m('.ui.dividing.header', m('h3', 'Some Header'))
            ]),
            m('.ui.secondary.segment', { style: { textAlign: 'right' } }, [
                m('button.ui.secondary.button', [
                    m('i.check.icon'),
                    'Submit'
                ])
            ])
        ]);

        let children = vnode.children || [];
        return m('.ui.segments', [
            m(SegmentComponent, {}, ...children),
            m('.ui.secondary.segment', { style: { textAlign: 'right' } }, [
                m('button.ui.info.button', [
                    m('i.check.icon'),
                    'Submit'
                ])
            ])
        ]);
    }
}