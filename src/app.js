import {sum} from './math.js'
import './app.scss';
import nyancat from './nyancat.jpg';

document.addEventListener('DOMContentLoaded', () =>{
    document.body.innerHTML = `<img src="${nyancat}" />`
})
console.log(sum(100,10));
/* console.log(process.env.NODE_ENV);
console.log(TWO);
console.log(TWO_s);
console.log(api.domain); */

