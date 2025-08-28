export type Prefs={name?:string;email?:string;category:string;budget:number;style:string;goal:string;audience?:string}
export type ProductLite={id:string;title:string;brand?:string;category:string;price:number;rating?:number;tags?:string[];popularity?:number}
function overlap(a:string[] = [], b:string[] = []){const A=new Set(a.map(x=>x.toLowerCase()));const B=new Set(b.map(x=>x.toLowerCase()));let c=0;for(const x of A) if(B.has(x)) c++;return c/Math.max(1,A.size)}
export function scoreProduct(p:ProductLite,prefs:Prefs){
  const cat=p.category.toLowerCase()===prefs.category.toLowerCase()?1:0.3
  const diff=Math.abs(p.price-(prefs.budget))
  const budget=Math.max(0,1-diff/Math.max(50,prefs.budget))
  const styleTags:Record<string,string[]>={minimalista:['minimalista','sobrio','compacto','ligero'],premium:['premium','alta gama','pro','aluminio','sapphire','lujo'],lowcost:['barato','low-cost','básico','ahorro'],ecologico:['eco','reciclado','bajo consumo','eficiencia'],alto_rendimiento:['alto rendimiento','gaming','pro','potente','fps','rpm'],retro:['retro','vintage','clásico','analogico'],juguetes:['juguete','toy','kids','niños'],deportivo:['deportivo','sport','fitness','running','gym'],lujo:['lujo','premium','alta gama','exclusivo'],outdoor:['outdoor','camping','senderismo','resistente al agua'],'smart-home':['domótica','smart','wifi','alexa','homekit']}
  const goalTags:Record<string,string[]>={'mejor calidad/precio':['valor','calidad-precio','equilibrado'],'mejor valoraciones':['top rated','mejor valorado','4.5+'],'lo mas vendido':['más vendido','bestseller','top ventas'],'novedades':['nuevo','2025','latest']}
  const audTags:Record<string,string[]>={unisex:['unisex'],hombre:['hombre','men','caballero','male'],mujer:['mujer','women','señora','female'],niños:['niños','niñas','kids','child']}
  const tags=(p.tags||[]).map(t=>t.toLowerCase())
  const style=overlap(tags,styleTags[prefs.style]||[])
  const goal=overlap(tags,goalTags[prefs.goal]||[])
  const audience=overlap(tags,audTags[prefs.audience||'unisex']||[])
  const rating=(p.rating||3.5)/5
  const popularity=p.popularity??0.5
  const score=0.22*cat+0.22*budget+0.18*style+0.1*goal+0.1*rating+0.08*popularity+0.1*audience
  return score
}
export function rankProductsWithScore<T extends ProductLite>(products:T[],prefs:Prefs,topN=5):Array<{product:T;score:number}>{return products.map(p=>({product:p,score:scoreProduct(p,prefs)})).sort((a,b)=>b.score-a.score).slice(0,topN)}
