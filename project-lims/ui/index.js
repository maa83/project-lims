
import { MasterModule } from "./app/main"
import * as m from "mithril"

document.addEventListener('readystatechange', function(e){
    if(e.target.readyState == 'interactive') {
        let main = document.querySelector('div#main')
        m.mount(main, MasterModule)
    }
})