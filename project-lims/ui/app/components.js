

const LabelComponent = (text, forAttrib = '') => {
    let attribs = {};
    if(forAttrib)
        //attribs['for'] = forAttrib;
        Object.assign(attribs, { for: forAttrib });
    return m('label', attribs, text);
}

const FieldComponent = ({ type='text', title='', name='', value='', onchange= null, id='', attrs=null, oninput=null }) => {
    type = ['text', 'date'].find((item) => { return item == type; }) ? type : 'text';
    let inputAttrs = { type, id, name, value };
    if(attrs) Object.assign(inputAttrs, attrs);
    if (onchange) inputAttrs['onchange'] = m.withAttr('value', onchange);
    if (oninput) inputAttrs['oninput'] = m.withAttr('value', oninput);
    title = title ? _.startCase(title) : _.startCase(name);
    return m('.field', [
        m('label', { for: name }, title),
        m('input', inputAttrs)
    ]);
};

function FieldsTableComponent({fields=[{name: 'Field', value: 'Value'}]})
{
    if(typeof(fields) == 'object' ) {
        let arr = [];
        for(let prop in fields) arr.push({ name: prop, value: fields[prop] });
        fields = arr;
    }
    return m('table.ui.very.basic.table', m('tbody', fields.map( ({name, value}) => ( m('tr', [ m('td.collapsing', m('strong', _.startCase(name) + ' :' )), m('td', value) ]) ) ) ));
}

class FieldComponent1
{
    view() {
        return  m('.field', [
            m('label[for=samplingFees]', 'Sampling Fees'),
            m('.ui.right.labeled.input', [
                m('input[type=text]', {
                    name: 'extraFees',
                    id: 'extraFees',
                    value: extraFees,
                    onchange: m.withAttr('value', (val) => { setExtraFees(val, extraFeesReason); })
                }),
                m('label.ui.dropdown.label', { oncreate: ({dom}) => { $(dom).dropdown(); } }, [
                    m('span.text', '.com'),
                    m('input[type=hidden]'),
                    m('i.dropdown.icon'),
                    m('.menu', [
                        m('.item', '.org'),
                        m('.item', '.something')
                    ])
                ])
            ])
        ]);
    }
}

// const DropDownComponent = ( { selection=true, link=false, search=false, multiple=false, text='Select ...', name='dropdown', items=[], onchange=null, render=null } ) => {

//     let classes = ['.ui'];
//     if(multiple) classes.push('multiple');
//     if(search) classes.push('search');
//     if(selection) classes.push('selection')
//     classes.push('dropdown');

//     if(!onchange) onchange = (val) => { console.log( val, ' Item Selected'); }
//     if(!render) render = (item) => {
//                     //id, name and description
//                     return !item['description'] ? item.name : [
//                         m('span.text', item.name),
//                         m('span.description', item.description)
//                     ];
//                 }

//     return m(classes.join('.'), [
//         m('.default.text', text),
//         m('input[type=hidden]', { name, onchange: m.withAttr('value', onchange) }),
//         m('i.dropdown.icon'),
//         m('.menu', [
//             items.map( (item) => {
//                 return m('.item', { 'data-value': item.id }, render(item) )
//             } )
//             // m('.item', { 'data-value': '1' }, 'Value')
//             // m('.item', { 'data-value': '1' }, [
//             //     m('span.text', 'Value'),
//             //     m('span.description', 'Value Description')
//             // ])
//         ])
//     ])
// }

class DropDownComponent
{
    oninit( { attrs: { selection=true, link=false, compact=false, scrolling=false, fluid=false, search=false, multiple=false, text='Select ...', name='', id='', items=[], value='', onchange=null, onAdd=null, onRemove=null, render=null } } ) {

        let classes = ['.ui'];
        if(multiple) classes.push('multiple');
        if(search) classes.push('search');
        if(selection) classes.push('selection');
        if(scrolling) classes.push('scrolling');
        if(compact) classes.push('compact');
        if(fluid) classes.push('fluid');
        classes.push('dropdown');

        this.classes = classes.join('.');

        if(onchange) this.onchange = m.withAttr('value', onchange);
        this.render = render? render : (item) => {
                        //id, name and description
                        return !item['description'] ? item.name : [
                            m('span.text', item.name),
                            m('span.description', item.description)
                        ];
                    };
        this.options = { selection, link, multiple, search, text };

        this.createHandle = dom => {
            return {
                clear: () => { $(dom).dropdown('clear'); },
                setSelected: val => $(dom).dropdown('set selected', val),
                refresh: () => $(dom).dropdown('refresh'),
                defaults: () => $(dom).dropdown('restore defaults')
            }
        }
    }

    oncreate( { dom, attrs: { onchange } } ) {

        $(dom).dropdown({
            // values: [
            //     {
            //         name: 'Male',
            //         value: 'male'
            //     },
            //     {
            //         name     : 'Female',
            //         value    : 'female',
            //         selected : true
            //     }
            // ],
            // onAdd: (val, text, choice) => {},
            // onRemove: (val, text, choice) => {},
            // onChange: (val, text, element) => {},
            allowAdditions: true,
            match: 'text',
            forceSelection: false,
            fullTextSearch: true
        });
    }

    onupdate({attrs: { multiple=false, value, items=[] }, state, dom}) {

        if( value ) {

            $(dom).dropdown('set value', value);
            if(!multiple){
                let item = this.formatDropdownItems(items).find( item => item.id == value );
                $(dom).dropdown('set text', item.text);
            }

            //let currentValue = $(dom).dropdown('get value');
            //let item = $(dom).dropdown('get item');
            //if(item) $(dom).dropdown('set value', item.id).dropdown('set text', item.name).dropdown('set selected', item.name);
            // $(dom).dropdown('set exactly', value);
            //$(dom).dropdown('set selected', value);
        }
        else
            $(dom).dropdown('clear');
        $(dom).dropdown('refresh');
        //$(dom).dropdown('restore defaults');
    }

    formatDropdownItems(items) {
        //perform items cleanup and formating
        return items.filter( item => { if(item.id) return true; return false; } ).map( item => {
            let { id=null, name=null, text=null, description=null } = item;
            if(!name) name = id;
            if(!text) text = name;
            return Object.assign({...item}, { id, name, text, description });
        } );
    }

    view({attrs: { name=null, id=null, onchange=null, items=[], value=null }}) {

        let options = this.options;
        let inputAttrs = { };
        if(id) inputAttrs['id'] = id;
        if(name) inputAttrs['name'] = name;
        if(value) inputAttrs['value'] = value;
        if(onchange) inputAttrs['onchange'] = m.withAttr('value', onchange);

        /**
         * this needs to be cleaned the hell up
         */
        //prepare items and format to satisfy dropdown component
        items = this.formatDropdownItems(items);
        
        //convert to an array of value. in case of a multiple select
        if(typeof(value) === 'string') value = value.split(',');
        else value = [value];

        return m(this.classes, [
            m('.default.text', options.text),
            m('input[type=hidden]', inputAttrs),
            m('i.dropdown.icon'),
            m('.menu', [
                items.map( (item) => {
                    let { id=null, name=null, text=null, description=null } = item;
                    
                    let attrs = {
                        'data-value': id,
                        'data-text': text,
                        'class': 'item'
                    }
                    // if(id == value) attrs['class'] = [attrs['class'], 'active'].join(' ');
                    if( value.find( val => (val == id) ) ) attrs['class'] = [attrs['class'], 'active'].join(' ');
                    return m('.item', attrs, this.render(item) )
                } )
            ])
        ]);

    }
}

h = (c) => {
    
    //check
    if( !(c instanceof HTMLElement) )
        throw 'not a HTMLElement';

    const scrollTo = (el) => {

        let position = el.getBoundingClientRect();
        let scrollX = window.pageXOffset || document.documentElement.scrollLeft, scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        let top = position.y + scrollY, left = position.x + scrollX, behavior = 'smooth';
        window.scrollTo( { top, left, behavior } );
    }


    return {
        show: () => {
            // c.style.display = 'inherit';
            // c.hidden = false;
            scrollTo(c);
        },
        hide: () => {
            c.style.display = 'none';
            c.hidden = true;
        }
    };
}

class ModalComponent 
{

    oninit({attrs: { onDeny=null, onApprove=null, onClose=null, title='', basic=false, size='small' }}) {

        this.options = {
            title,
            basic,
            size: size //tiny, mini, small, large, huge
        }
        
        this.onApprove = (state) => {
            console.log('onApprove not implemented');
        };
        this.onDeny = () => {
            console.log('onDeny not implemented');
        }
        this.onClose = () => {
            console.log('onDeny not implemented');
        }

        this.createHandle = ( (ctx) => {
            return dom => {
                let el = $(dom);
                return {
                    show: () => {
                        el.modal('show');
                    },
                    hide: () => {
                        el.modal('hide');
                    }
                }
            };
        } )(this);

        if(onApprove) this.onApprove = () => { onApprove(this.handle); };
        if(onDeny) this.onDeny = () => { onDeny(this.handle); };
        if(onClose) this.onClose = () => { onClose(this.handle); };

    }

    oncreate({ dom: el }) {

        let parent = el.parentNode;
        let elClone = el.cloneNode();

        $(el).modal({
            centered: true,
            detachable: true,
            selector: {
                close: '.close',
                approve: '.ok, .positive',
                deny: '.cancel, .negative'
            },
            // onShow: () => { console.log('modal show'); },
            // onVisible: () => {  },
            // onHide: (el) => { console.log('modal hide'); },
            // onHidden: () => {  },
            // onApprove: (el) => { console.log('modal approved'); },
            // onDeny: (el) => { console.log('modal denied'); }
        });

        parent.appendChild(elClone);
        this.handle = this.createHandle(el);
    }

    onremove() {
        document.querySelectorAll('div.dimmer').forEach((el)=>{ console.log(el); document.body.removeChild(el); });
    }

    view({attrs: {id='', name=''}, children=[]}) {

        let ctx = this;
        let options = ctx.options;
        let attrs = {};
        if(id) attrs['id'] = id;
        if(name) attrs['name'] = name;
        children = children || [];
        let classes = [];
        if(options.size) classes.push(options.size);

        if(options.basic) {
            classes.push('basic');

            function appendClass(el) {
                if(el.className.split(' ').find( (className) => { return ['form', 'segment'].findIndex((item) => { className.toLowerCase() === item }) >= 0; } ))
                    el.className += ' inverted'

                if(el.children) {
                    if(el.children instanceof Array && el.children.length > 0)
                        for(child in el.children) appendClass(child);
                    appendClass(el.children);
                }
            }

            if(children.length > 0) {
                appendClass(children);
            }
        }
        attrs['class'] = classes.join(' ');

        let modalParts = [];
        if(options.title) modalParts.push( m('.header', m('h3', options.title)) );
        modalParts.push( m('.content', ...children) );
        modalParts.push( m('.actions', [
            m('button.ui.basic.negative.cancel.button', [
                m('i.times.icon'),
                'Cancel'
            ]),
            m('button.ui.basic.positive.ok.button', { onclick: this.onApprove }, [
                m('i.check.icon'),
                'Ok'
            ])
        ]) );

        return m('.ui.modal', attrs, modalParts);
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
    
    oninit({ attrs: { type='window', title='', onApprove=null, onDeny=null, onClose=null, visible=false } }) {
        //callback to master: [onApprove, onDeny, onClose].
        //options { modal: true | false },
        //expose APIs: { store }
        //expect:
        //three callback functions
        //master to implement state functionality
        //master to bind controls to vnode elements
        this.options = {
            type, //modal | window
            title,
            visible
        };

        this.onApprove = (state) => {
            console.log('onApprove not implemented');
        };
        this.onDeny = () => {
            console.log('onDeny not implemented');
        }
        this.onClose = () => {
            console.log('onDeny not implemented');
        }

        this.createHandle = ( (ctx) => {
            return dom => {
                    return {
                        show: () => {
                            ctx.options.visible = true;
                            ctx.show(dom, true);
                        },
                        hide: () => {
                            ctx.options.visible = false;
                            ctx.hide(dom);
                        }
                    }
                };
        } )(this);

        if(onApprove) this.onApprove = () => { onApprove(this.handle); };
        if(onDeny) this.onDeny = () => { onDeny(this.handle); };
        if(onClose) this.onClose = () => { onClose(this.handle); };

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

    oncreate({dom: el}) {
        this.handle = this.createHandle(el);
    }

    show(el, scrollTo=false) {
        el.style.display = 'inherit';
        el.hidden = false;
        
        let position = el.getBoundingClientRect();
        let scrollX = window.pageXOffset || document.documentElement.scrollLeft, scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        let top = position.y + scrollY, left = position.x + scrollX, behavior = 'smooth';

        if(scrollTo)
            window.scrollTo( { top, left, behavior } );
    }
    hide(el) {
        el.style.display = 'none';
        el.hidden = true;
    }

    view({attrs: { id='', name='' }, children=[]}) {
        let ctx = this;
        let options = ctx.options;
        let attrs = { style: { display: 'none' }, hidden: '' };
        if(id) attrs['id'] = id;
        if(name) attrs['name'] = name;
        if(options.title) children.unshift( m('.ui.dividing.header', m('h2', options.title.toUpperCase())) );
        if(options.visible) {
            attrs.style.display = 'inherit';
            delete attrs.hidden;
        }

        return m('.ui.segments', attrs, [
            m(SegmentComponent, ...children),
            m('.ui.secondary.segment', { style: { textAlign: 'right' } }, [
                m('button.ui.negative.button', { onclick: () => { 
                    ctx.onDeny();
                    ctx.onClose();
                } }, [
                    m('i.times.icon'),
                    'Cancel'
                ]),
                m('button.ui.positive.button', { onclick: () => {
                    ctx.onApprove();
                    ctx.onClose();
                } }, [
                    m('i.check.icon'),
                    'Submit'
                ])
            ])
        ]);
    }
}


function MenuComponent() {
    return {
        view: ({children}) => {

            return m('div', [
                m('.ui.top.attached.menu', [
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
                ]),

                m('.ui.bottom.attached.segment', children)
            ])
        }
    }
}


/**
 * 
 * Sample Table Columns variations
 */
// let columns = [
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

//render must return mithril vnode element. val and row are passed.
//onrender must return only a formatted value of a row cell. only cell value is passed.
function TableComponent({compact=false, celled=true, striped=false, definition=false, columns=[], rows=[], footer=null, render=null, onrender=null, renderHeader=null, onrenderHeader=null}) {
    let tableEl = ['table', 'ui'];

    if(compact) tableEl.push('compact');
    if(celled) tableEl.push('celled');
    if(striped) tableEl.push('striped');
    if(definition) tableEl.push('definition');

    tableEl.push('table');
    tableEl = tableEl.join('.');
    
    columns = columns.map( column => { if(typeof(column) == 'string' ) return { name: column }; return column; } )


    //render table head
    let headAttrs = { class: [ ] }, footerAttrs = { class: [ ] } ;
    if(definition) {
        headAttrs.class.push('full-width');
        footerAttrs.class.push('full-width'); // to be used
    }

    let tableHeadSearch = null; //implement functionality later

    let tableHeadColumns = [
        m('tr', columns.map( column => {

            let { text='', name='', attrs={}, classes=null } = column;

            attrs['name'] = name;
            if(classes) attrs['class'] = classes.join(' ');

            if(!text) text = _.startCase(name);

            return m('th', attrs, text);
        } ))
    ];

    if(tableHeadSearch) tableHeadColumns.unshift(tableHeadSearch);

    let tableHead = m('thead', headAttrs, tableHeadColumns);

    let tableBody = m('tbody', rows.map( (row, rowIndex) => {
                        // let cells = columns.filter( column => item.hasOwnProperty(column.name) ).map( column => {
                        //     return m('td', item[column.name]);
                        // } );
                        //if(!row.item) row = { item, attrs: {}, classes: [] };
                        let cells = columns.map( (column, colIndex) => {
                            let { name, render= ({val, row}) => (m('td', val)), onrender= val => (val) } = column;
                            let val = row[name] || '';
                            return render({val: onrender(val), row, cell: { row: rowIndex, col: colIndex }});
                            //return m('td', row[name]);
                        } );
                        if(cells) return m('tr', cells);
                    } ));

    let children = [tableHead, tableBody];

    //implement footer functionality and pagination later
    if(footer) children.push(m('tfoot', footer));

    return m(tableEl, children);
}