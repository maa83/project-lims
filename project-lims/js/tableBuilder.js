
class HtmlElement {
    constructor () {
        this.styles = [];
        this.classes = [];
        this.tag = 'div';
    }

    addStyle(style) {
        if(!style['name'] || !style['value']) return;


    }

    render() {
        let el = [this.tag, ...classes].join('.');
        return m(el, )
    }
}
class TableCell : HtmlElement
{
    constructor (value) {
        this.value = value | 'cell-value';
    }
}

class Row
{

}

class TableSection
{
    constructor(table) {
        this.parent = table;
        this.rows = [];
    }

    addRow(row) {
        return this;
    }
    removeRow(i) {
        return this;
    }

    parent() {
        return parent;
    }
}

class TBody : TableSection, HtmlElement
{

}

class TableBuilder
{
    constructor() {
        let columnsCount = 2;

        this.options = {
            fullWidth: false,
            compact: false,
            celled: false,
            definition: false,
            columns: columnsCount
        };
        this.head = {
            options: {
                fullWidth: false
            },
            classes: [],
            styles: [],
            rows: [ [ 'Row1-Column1', 'Row1-Column2' ] ]
        };
        this.body = new TableSection(this);
        this.footer = {
            styles: [],
            classes: [],
            rows: [ [ 'Row1-Cell1', 'Row1-Cell2' ] ]
        };
        
    }

    addClass() {
        // add class logic
        return this;
    }
    removeClass() {
        return this;
    }

    addStyle() {
        //add style logic
        return this;
    }

    setCompact() {
        addClass('compact');
        return this;
    }

    addRow() {
        this.body.addRow({});
        return this;
    }
}