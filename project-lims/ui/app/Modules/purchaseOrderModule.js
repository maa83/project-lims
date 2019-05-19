

class PurchaseOrderRequestPageModule
{
    oninit() {
        let defState = {
            purchaseOrders: []
        };
        let actions = {
            SET_PURCHASE_ORDERS: purchaseOrders => ({purchaseOrders}),
            ADD_PURCHASE_ORDER: (purchaseOrder, {purchaseOrders}) => {
                purchaseOrders.push(purchaseOrder);
                return {purchaseOrders: [...purchaseOrders]};
            },
            REMOVE_PURCHASE_ORDER_BY_INDEX: (index, {purchaseOrders}) => {
                let removed = purchaseOrders.splice(purchaseOrders, index, 1)
                return {purchaseOrders: [...purchaseOrders]};
            },
            REMOVE_PURCHASE_ORDER_BY_ID: (id, {purchaseOrders}) => {
                let removed = _.remove(purchaseOrders, item => (item.id == id));
                return {purchaseOrders: [...purchaseOrders]};
            },
            CLEAR: () => ({...defState})
        };

        assignStore(this, defState, actions);

        let { setPurchaseOrders } = this;
        DataManagers.PurchaseOrder.GetAll().then( purchaseOrders => { setPurchaseOrders(purchaseOrders); m.redraw(); } ).catch( error => console.log(error) );
    }

    view() {
        let ctx = this;
        let store = this.store;
        let state = store.getState();

        let { toDateFormat, toMoneyFormat } = SPA.Common;
        let { removePurchaseOrderById } = ctx;
        let { purchaseOrders } = state;


        return m('.ui.grid', [
            m('.one.column.row', m('.column', [
                m('.ui.top.attached.menu', [
                    m('.ui.icon.dropdown.item', { oncreate: ({dom}) => { $(dom).dropdown(); } }, [
                        m('i.wrench.icon'),
                        m('.menu', [
                            m('button.ui.button.item', 'Settings')
                        ])
                    ]),
                    // m('a.ui.icon.button.item[href=/por/add]', { oncreate: m.route.link }, m('i.plus.icon')),
                    m('a.ui.right.icon.button.item[href=/por/add]', { oncreate: m.route.link }, m('i.plus.icon'))
                ]),
                m('table.bottom.attached.ui.compact.celled.striped.table', [
                    m('thead', [
                        m('tr', [
                            m('th', 'Code'),
                            m('th', 'Contact Name'),
                            m('th', 'Contact Phone'),
                            m('th', 'Customer Name'),
                            m('th', 'Date Received'),
                            m('th', 'Samples Count'),
                            m('th', 'Actions')
                        ])
                    ]),
                    m('tbody', purchaseOrders.map( purchaseOrder => {
                        let { id, code, contactName, contactPhoneNumber, customerName, receivedDate, samples } = purchaseOrder;
                        return m('tr', [
                            m('td', code),
                            m('td', contactName),
                            m('td', contactPhoneNumber),
                            m('td', customerName),
                            m('td', toDateFormat(receivedDate)),
                            m('td', samples.length),
                            m('td.collapsing', [
                                m('button.ui.icon.button[name=deleteButton]', { onclick: () => {
                                    DataManagers.PurchaseOrder.Delete(id).then( (data, status, xhr) => { removePurchaseOrderById(id); m.redraw(); } ).catch( error => console.log(error) );
                                } }, m('i.times.icon')),
                                m('button.ui.icon.button', m('i.edit.icon')),
                                m('button.ui.icon.button', m('i.eye.icon'))
                            ])
                        ]); 
                    } ))
                ])
            ]))
        ])
    }
}