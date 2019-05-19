
import * as m from "mithril";
import { createStore, createActions, createReducer } from "../../util/redux-extension";
import { ClassComponent, CVnode } from 'mithril'
import * as moment from "moment";
import { start } from "repl";
import { EventEmitter } from "events";


/**
 * Globals and Declarations
 */
declare function Event(eventName: string) : void;
interface IDocument
{
    createEvent: (name: string) => any;
    createElement: (tagName: string) => any;
    querySelectorAll: (query: string) => any;
    querySelector: (query: string) => any;
}

declare const document: IDocument;

let Util = {
    momentDateFormat: 'YYYY.MMM.DD',
    momentDateTimeFormat: 'YYYY.MMM.DD hh:mm:ss',
    calendarDateFormat: '%Y.%M.%d',
    calendarDateTimeFormat: '%Y.%M.%d %H:%m:%s'
}

interface Vnode<T> extends CVnode<T>
{
    dom?: any
}



/**
 * Button component
 */
export class ButtonModule implements ClassComponent
{
    view() {

    }
}


/**
 * DatePicker Component
 */
export interface IComponentAttr
{
    parent?: ClassComponent
}
export interface IDatePickerAttr extends IComponentAttr
{
    placeholder: string
    defaultDate?: Date
    dateFormat?: string
    disableTo?: () => Date
    disableFrom?: () => Date
    holidays?: Date[]
    onChange?: Function
}
export class DatePickerComponent implements ClassComponent<IDatePickerAttr>
{
    private placeholder: string;
    private dateFormat: string;
    private defaultDate: Date;
    private disableFrom: () => Date;
    private disableTo: () => Date;
    private calendarObj: any;
    private parent: DateRangeComponent;

    private getDisabledDates() {
        // return { dateFrom: this.disableFrom? moment(this.disableFrom()).format(Util.momentDateFormat) : null, dateTo: this.disableTo ? moment(this.disableTo()).format(Util.momentDateFormat) : null };
        
        return { dateFrom: this.disableFrom? this.disableFrom() : null, dateTo: this.disableTo ? this.disableTo() : null };
    }

    constructor() {
        this.dateFormat = '%d.%M.%Y';
        this.defaultDate = new Date();
        this.disableFrom = null;
        this.disableTo = null;
    }

    oninit({ attrs } : Vnode<IDatePickerAttr>) {
        this.placeholder = attrs.placeholder;
        if (attrs.dateFormat)
            this.dateFormat = attrs.dateFormat;
        if (attrs.defaultDate)
            this.defaultDate = attrs.defaultDate;
        if(attrs.parent)
            this.parent = attrs.parent as DateRangeComponent;
        if (attrs.disableFrom)
            this.disableFrom = attrs.disableFrom;
        if (attrs.disableTo)
            this.disableTo = attrs.disableTo;
    }

    oncreate({ attrs, dom }: Vnode<IDatePickerAttr>) {
        let input = dom.children[0];

		var myCalendar = new dhtmlXCalendarObject(input) as any;
        myCalendar.setSkin("dhx_terrace");
        myCalendar.setDateFormat(this.dateFormat);
        myCalendar.setDate(this.defaultDate);
        myCalendar.showToday();
        myCalendar.setHolidays(null); // clears holidays
        myCalendar.setWeekStartDay(7);
        myCalendar.attachEvent('onClick', (val) => {
            input.value = moment(val).format(Util.momentDateFormat);
            //input.dispatchEvent(new Event('change'));
            /**
             * IE specific implementation
             */
            let event = document.createEvent('Event');
            event.initEvent('change', false, false);
            input.dispatchEvent(event);
        })
        //myCalendar['attachEvent']('onClick', attrs.onChange);
        myCalendar.clearInsensitiveDays();
        let { dateFrom, dateTo } = this.getDisabledDates();
        myCalendar.setInsensitiveRange(dateFrom, dateTo);

        this.calendarObj = myCalendar;

        /* Calendar API */
        //myCalendar.show();
        //myCalendar.setHolidays([moment(new Date()).add(1, 'day').toDate()]); // marked with red
        //myCalendar.disableDays("week", [5, 6]);
        //myCalendar.setInsensitiveRange(null, new Date());
        //myCalendar['attachEvent'].call(myCalendar, 'onClick', attrs.onChange)
        /* Localization */
        // dhtmlXCalendarObject.prototype.langData["de"] = {
		// 	dateformat: '%d.%m.%Y',
		// 	monthesFNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
		// 	monthesSNames: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],
		// 	daysFNames: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
		// 	daysSNames: ["So","Mo","Di","Mi","Do","Fr","Sa"],
		// 	weekstart: 1,
		// 	weekname: "w",
		// 	today: "Heute",
		// 	clear: "Reinigen"
        // }
    }

    onupdate({ attrs, dom } : Vnode<IDatePickerAttr>) {
        let { dateFrom, dateTo } = this.getDisabledDates();

        this.calendarObj.clearInsensitiveDays();
        this.calendarObj.setInsensitiveRange(dateFrom, dateTo);
    }

    view({ attrs } : Vnode<IDatePickerAttr>) {
        return m('div', { class: 'ui icon input' }, [
            m('input[type=text]', { class: 'ui input', placeholder: this.placeholder, onchange: attrs.onChange }),
            m('i.calendar.icon')
        ])
    }
}



/**
 * DateRange Component
 */
export class DateRangeComponent implements ClassComponent 
{
    private startDate: Date;
    private endDate: Date;

    public getStartDate() {
        return this.startDate;
    }
    public getEndDate() {
        return this.endDate;
    }

    private setEndDate(val) {
        this.endDate = moment(val, Util.momentDateFormat).toDate();
    }

    private setStartDate(val) {
        this.startDate = moment(val, Util.momentDateFormat).toDate();
    }

    view() {
        return [
            m(DatePickerComponent, { placeholder: 'from', onChange: m.withAttr('value', this.setStartDate.bind(this)), disableFrom: this.getEndDate.bind(this), parent: this } as IDatePickerAttr ),
            ' ',
            m(DatePickerComponent, { placeholder: 'to', onChange: m.withAttr('value', this.setEndDate.bind(this)), disableTo: this.getStartDate.bind(this), parent: this } as IDatePickerAttr)
        ]
    }
}



/**
 * Table Component
 */
export class TableModule implements ClassComponent
{
    view() {
    }
}



/**
 * Input Component
 */
enum InputComponentOptions
{

}
export class InputComponent implements ClassComponent
{
    view() {
        return m('div.labeled.input', [ m(label) ]);
    }
}


const label = {
    compAttributes: {
        leftAligned: 'right aligned',
        rightAligned: 'left aligned'
    },

    view({ attrs }) {
        return m('label', attrs);
    }
} as m.Comp;