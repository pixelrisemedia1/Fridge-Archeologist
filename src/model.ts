export type Location='Fridge'|'Freezer'|'Pantry';
export type Item={id:string,name:string,location:Location,quantity:number,price:number,first:string,last:string,expiry:string,status:'active'|'unobserved'|'consumed'|'discarded'};
export type Event={id:string,item:string,action:string,date:string,value:number};
export type State={items:Item[],events:Event[],shopping:{id:string,name:string,done:boolean}[],onboarded:boolean,currency:string,household:number};
export const initial:State={items:[],events:[],shopping:[],onboarded:false,currency:'USD',household:1};
export const day=86400000;
export function age(i:Item,now=Date.now()){return Math.max(0,Math.floor((now-Date.parse(i.first))/day))}
export function classification(n:number){return n<=2?'Fresh Discovery':n<=5?'Established Resident':n<=10?'Forgotten Treasure':n<=20?'Ancient Artifact':n<=30?'Relic':'Museum Exhibit'}
export function score(i:Item,now=Date.now()){const days=i.expiry?(Date.parse(i.expiry)-now)/day:Infinity;return Math.min(100,Math.round(Math.max(0,Math.min(65,65-days*10))+Math.min(20,age(i,now))+Math.min(15,i.price*i.quantity)))}
export function normalize(s:string){return s.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ')}
export function match(items:Item[],name:string,location:Location){return items.filter(i=>(i.status==='active'||i.status==='unobserved')&&normalize(i.name)===normalize(name)&&i.location===location)}
export function totals(items:Item[],events:Event[]){return {inventory:items.filter(i=>i.status==='active').reduce((s,i)=>s+i.price*i.quantity,0),risk:items.filter(i=>i.status==='active'&&score(i)>=60).reduce((s,i)=>s+i.price*i.quantity,0),waste:events.filter(e=>e.action==='discarded').reduce((s,e)=>s+e.value,0)}}