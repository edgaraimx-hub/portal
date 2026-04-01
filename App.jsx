import { useState } from "react";

const PROVEEDORES = [
  {id:1, razonSocial:"Materiales y Equipos Distribución SA de CV"},
  {id:2, razonSocial:"Acabados del Norte SA"},
];

const USERS = [
  {id:1,nombre:"Carlos Mendoza",usuario:"admin",password:"1234",rol:"admin"},
  {id:2,nombre:"Ing. López",usuario:"residente",password:"1234",rol:"residente"},
  {id:3,nombre:"Arq. Ramírez",usuario:"director",password:"1234",rol:"director"},
  {id:4,nombre:"Materiales y Equipos Distribución SA de CV",usuario:"electro",password:"1234",rol:"proveedor",proveedorId:1},
  {id:5,nombre:"Acabados del Norte SA",usuario:"acabados",password:"1234",rol:"proveedor",proveedorId:2},
];

const OCS0 = [
  {id:"OC-4500052830",obra:"Lote 14 — Instalación Eléctrica",descripcion:"SU.PRY.02.0004",monto:190000,montoIVA:220400,proveedorId:1,estatus:"activa",fecha:"26.03.2026",historial:[]},
  {id:"OC-4500052831",obra:"Lote 22 — Casa modelo",descripcion:"Acabados interiores",monto:42000,montoIVA:48720,proveedorId:2,estatus:"activa",fecha:"26.03.2026",historial:[]},
];
const ANTS0 = [
  {id:"ANT-001",ocId:"OC-4500052830",monto:76000,porcentaje:40,estatus:"enviado",fecha:"26.03.2026",nota:"Anticipo para inicio de trabajos",factura:null},
];
const VALES0 = [
  {id:"VE-001",oc:"OC-4500052831",descripcion:"Yeso terminado en 4 habitaciones",firmaResidente:false,firmaDirector:false,estatus:"pendiente_residente",proveedorId:2},
];
const AVANCES0 = [
  {id:"AV-001",oc:"OC-4500052830",descripcion:"Canalización planta baja 60%",fotos:3,estatus:"pendiente_residente",proveedorId:1},
];
const FACTS0 = [
  {id:"FAC-001",vale:"VE-001",antId:null,serie:"FB",folio:"20",uuid:"A2B3C6E5-F8D1-4572-AD5C-FFFBBD72A8FF",monto:76000,metodo:"PPD",uso:"I01",proveedorId:1,estatus:"en_revision",xmlNombre:"factura_FB20.xml",pdfNombre:"factura_FB20.pdf",origen:"vale",fecha:"27.03.2026",facAdjunto:"factura_FB20.pdf",pagoAdjunto:null,estatusPago:"pendiente"},
  {id:"FAC-002",vale:null,antId:"ANT-001",serie:"FC",folio:"5",uuid:"B3C4D5E6-A1B2-3456-BC7D-AABBCC001122",monto:42000,metodo:"PUE",uso:"I01",proveedorId:2,estatus:"aprobada",xmlNombre:"anticipo_FC5.xml",pdfNombre:"anticipo_FC5.pdf",origen:"anticipo",fecha:"28.03.2026",facAdjunto:"anticipo_FC5.pdf",pagoAdjunto:null,estatusPago:"pendiente"},
];

const RC = {admin:"#185FA5",residente:"#1D9E75",director:"#533AB7",proveedor:"#BA7517"};
const RN = {admin:"Administrador",residente:"Residente de Obra",director:"Director de Obra",proveedor:"Proveedor"};
const IS = {width:"100%",boxSizing:"border-box"};
const SS = {width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid #ccc",background:"white",fontSize:14,boxSizing:"border-box"};

const getPV = (id) => PROVEEDORES.find(p=>p.id===id);

const Bd = ({s}) => {
  const M = {
    activa:["#1D9E75","#E1F5EE","Activa"], modificada:["#533AB7","#EEEDFE","Modificada"],
    eliminada:["#A32D2D","#FCEBEB","Eliminada"], pendiente_residente:["#BA7517","#FAEEDA","Pend. residente"],
    pendiente_director:["#185FA5","#E6F1FB","Pend. director"], validado:["#1D9E75","#E1F5EE","Validado"],
    rechazado:["#A32D2D","#FCEBEB","Rechazado"], en_revision:["#BA7517","#FAEEDA","En revisión"],
    aprobada:["#1D9E75","#E1F5EE","Aprobada"], pagada:["#3B6D11","#EAF3DE","Pagada"],
    enviado:["#185FA5","#E6F1FB","Enviado"], recibido:["#BA7517","#FAEEDA","Recibido"],
    con_factura:["#1D9E75","#E1F5EE","Con factura"], sin_anticipo:["#888","#eee","Sin anticipo"],
  };
  const [c,bg,l] = M[s]||["#888","#eee",s];
  return <span style={{background:bg,color:c,fontSize:11,padding:"2px 9px",borderRadius:8,fontWeight:500,whiteSpace:"nowrap"}}>{l}</span>;
};

const Card = ({children,style}) => (
  <div style={{background:"white",border:"0.5px solid #e5e7eb",borderRadius:12,padding:"14px 16px",marginBottom:10,...style}}>
    {children}
  </div>
);

const Btn = ({children,onClick,c,sm,full,dis}) => {
  const bg={p:"#185FA5",d:"#A32D2D",s:"#1D9E75",a:"#BA7517",v:"#533AB7"}[c]||"transparent";
  return (
    <button onClick={onClick} disabled={dis} style={{
      padding:sm?"3px 9px":"6px 13px",fontSize:sm?12:13,fontWeight:500,
      background:bg,color:c?"white":"#374151",
      border:c?"none":"0.5px solid #d1d5db",
      borderRadius:8,cursor:"pointer",marginRight:5,marginBottom:4,
      width:full?"100%":"auto",opacity:dis?0.5:1
    }}>{children}</button>
  );
};

const Lbl = ({t}) => <p style={{fontSize:12,color:"#6b7280",margin:"0 0 3px"}}>{t}</p>;

function ProvSelect({value,nuevoNombre,onChange,error}) {
  const NUEVO="__nuevo__";
  const [modo,setModo]=useState(value===NUEVO?"nuevo":"lista");
  const [q,setQ]=useState(nuevoNombre||"");
  const handleSelect=(e)=>{if(e.target.value===NUEVO){setModo("nuevo");onChange(NUEVO,"");}else{setModo("lista");onChange(e.target.value,"");}};
  return (
    <div>
      <select value={modo==="nuevo"?NUEVO:value} onChange={handleSelect} style={{...SS,border:`0.5px solid ${error?"#A32D2D":"#d1d5db"}`,marginBottom:modo==="nuevo"?8:0}}>
        <option value="">Selecciona proveedor</option>
        {PROVEEDORES.map(p=><option key={p.id} value={p.id}>{p.razonSocial}</option>)}
        <option value={NUEVO}>+ Agregar nuevo proveedor...</option>
      </select>
      {modo==="nuevo"&&(
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={q} onChange={e=>{setQ(e.target.value);onChange(NUEVO,e.target.value);}} style={{...IS,border:`0.5px solid ${error?"#A32D2D":"#d1d5db"}`,borderRadius:8,padding:"7px 10px",fontSize:14}} placeholder="Razón social del nuevo proveedor..." autoFocus/>
          <button onClick={()=>{setModo("lista");onChange("","");setQ("");}} style={{flexShrink:0,fontSize:12,padding:"5px 10px",borderRadius:8,border:"0.5px solid #d1d5db",background:"transparent",cursor:"pointer"}}>✕</button>
        </div>
      )}
      {modo==="nuevo"&&q&&<p style={{fontSize:11,color:"#1D9E75",margin:"4px 0 0"}}>Se agregará "{q}" al catálogo al guardar.</p>}
    </div>
  );
}

function Visor({nombre,onClose}) {
  if(!nombre)return null;
  const isPdf=nombre.toLowerCase().endsWith(".pdf");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:14,width:"100%",maxWidth:520,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"0.5px solid #e5e7eb"}}>
          <p style={{margin:0,fontWeight:500,fontSize:14}}>📎 {nombre}</p>
          <Btn sm onClick={onClose}>Cerrar</Btn>
        </div>
        <div style={{padding:32,textAlign:"center"}}>
          <div style={{width:80,height:96,background:isPdf?"#FCEBEB":"#E6F1FB",borderRadius:10,margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>{isPdf?"📄":"🗒️"}</div>
          <p style={{margin:"0 0 6px",fontWeight:500,fontSize:14}}>{nombre}</p>
          <p style={{margin:0,fontSize:12,color:"#6b7280"}}>{isPdf?"Representación impresa del CFDI":"Archivo XML del CFDI"}</p>
          <p style={{margin:"12px 0 0",fontSize:11,color:"#9ca3af"}}>(En producción con servidor real se mostraría el documento)</p>
        </div>
      </div>
    </div>
  );
}

function Login({onLogin}) {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const go=()=>{const f=USERS.find(x=>x.usuario===u&&x.password===p);if(!f){setErr("Usuario o contraseña incorrectos");return;}onLogin(f);};
  return (
    <div style={{maxWidth:320,margin:"3rem auto",padding:"0 1rem"}}>
      <p style={{fontSize:22,fontWeight:500,margin:"0 0 6px"}}>Portal de proveedores</p>
      <p style={{fontSize:13,color:"#6b7280",margin:"0 0 20px"}}>Ingresa tus credenciales</p>
      <Card>
        <div style={{marginBottom:12}}><Lbl t="Usuario"/><input value={u} onChange={e=>{setU(e.target.value);setErr("");}} style={IS} placeholder="usuario" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <div style={{marginBottom:14}}><Lbl t="Contraseña"/><input type="password" value={p} onChange={e=>{setP(e.target.value);setErr("");}} style={IS} placeholder="••••" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        {err&&<p style={{color:"#A32D2D",fontSize:13,margin:"0 0 10px"}}>{err}</p>}
        <Btn c="p" onClick={go} full>Entrar</Btn>
        <p style={{fontSize:11,color:"#9ca3af",margin:"10px 0 0"}}>admin · residente · director · electro · acabados — pass: 1234</p>
      </Card>
    </div>
  );
}

function Ocs({ocs,setOcs,ants,user,toast_}) {
  const EMPTY={numOC:"",provId:"",nuevoNombre:"",desc:"",montoIVA:"",docNombre:""};
  const [show,setShow]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState(EMPTY);
  const [errs,setErrs]=useState({});
  const [q,setQ]=useState("");
  const [motivoId,setMotivoId]=useState(null);
  const [motivo,setMotivo]=useState("");
  const lista=user.rol==="proveedor"?ocs.filter(o=>o.proveedorId===user.proveedorId):ocs;
  const filtradas=q?lista.filter(o=>{const pv=getPV(o.proveedorId);return pv?.razonSocial.toLowerCase().includes(q.toLowerCase())||o.id.toLowerCase().includes(q.toLowerCase())||o.descripcion.toLowerCase().includes(q.toLowerCase());}):lista;
  const abrir=(oc=null)=>{if(oc){setEditId(oc.id);setForm({numOC:oc.id,provId:String(oc.proveedorId),nuevoNombre:"",desc:oc.descripcion,montoIVA:String(oc.montoIVA||Math.round(oc.monto*1.16)),docNombre:oc.docNombre||""});}else{setEditId(null);setForm(EMPTY);}setErrs({});setShow(true);};
  const ErrMsg=({k})=>errs[k]?<p style={{color:"#A32D2D",fontSize:11,margin:"2px 0 0"}}>{errs[k]}</p>:null;
  const guardar=()=>{
    const e={};
    if(!form.numOC.trim())e.numOC="Requerido";
    if(!form.provId&&!form.nuevoNombre?.trim())e.provId="Selecciona o escribe un proveedor";
    if(form.provId==="__nuevo__"&&!form.nuevoNombre?.trim())e.provId="Escribe el nombre";
    if(!form.desc.trim())e.desc="Requerido";
    if(!form.montoIVA)e.montoIVA="Requerido";
    setErrs(e);if(Object.keys(e).length)return;
    const montoIVA=parseFloat(form.montoIVA);
    const monto=montoIVA/1.16;
    let provId=parseInt(form.provId);
    if(form.provId==="__nuevo__"&&form.nuevoNombre?.trim()){const nid=Math.max(...PROVEEDORES.map(p=>p.id),0)+1;PROVEEDORES.push({id:nid,razonSocial:form.nuevoNombre.trim()});provId=nid;toast_(`Proveedor "${form.nuevoNombre.trim()}" agregado`);}
    if(editId){setOcs(p=>p.map(o=>o.id===editId?{...o,id:form.numOC,descripcion:form.desc,monto,montoIVA,proveedorId:provId,docNombre:form.docNombre,estatus:o.estatus==="activa"?"modificada":o.estatus,historial:[...(o.historial||[]),{accion:"Modificada",fecha:new Date().toLocaleDateString("es-MX"),por:user.nombre}]}:o));toast_("OC modificada");}
    else{setOcs(p=>[...p,{id:form.numOC,descripcion:form.desc,monto,montoIVA,proveedorId:provId,estatus:"activa",fecha:new Date().toLocaleDateString("es-MX"),docNombre:form.docNombre,historial:[]}]);toast_(`OC ${form.numOC} creada`);}
    setShow(false);setEditId(null);setForm(EMPTY);
  };
  const eliminar=(id)=>{if(!motivo.trim()){toast_("Escribe el motivo");return;}setOcs(p=>p.map(o=>o.id===id?{...o,estatus:"eliminada",historial:[...(o.historial||[]),{accion:"Eliminada",motivo,fecha:new Date().toLocaleDateString("es-MX"),por:user.nombre}]}:o));setMotivoId(null);setMotivo("");toast_("OC marcada como eliminada");};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <p style={{margin:0,fontWeight:500}}>Órdenes de compra</p>
        {user.rol==="admin"&&<Btn c="p" onClick={()=>abrir()}>+ Nueva OC</Btn>}
      </div>
      {show&&<Card>
        <p style={{fontWeight:500,margin:"0 0 14px",fontSize:14}}>{editId?"Editar OC":"Nueva orden de compra"}</p>
        <div style={{marginBottom:12}}><Lbl t="Número de orden de compra *"/><input value={form.numOC} onChange={e=>setForm({...form,numOC:e.target.value})} style={{...IS,border:`0.5px solid ${errs.numOC?"#A32D2D":"#d1d5db"}`}} placeholder="Ej. OC-4500052830"/><ErrMsg k="numOC"/></div>
        <div style={{marginBottom:12}}><Lbl t="Nombre / Razón Social *"/><ProvSelect value={form.provId} nuevoNombre={form.nuevoNombre} onChange={(id,nm)=>setForm({...form,provId:id,nuevoNombre:nm||""})} error={errs.provId}/><ErrMsg k="provId"/></div>
        <div style={{marginBottom:6}}><Lbl t="Descripción *"/><textarea value={form.desc} onChange={e=>{if(e.target.value.length<=150)setForm({...form,desc:e.target.value});}} rows={3} maxLength={150} style={{...IS,padding:"7px 10px",borderRadius:8,border:`0.5px solid ${errs.desc?"#A32D2D":"#d1d5db"}`,fontSize:14,resize:"vertical"}} placeholder="Descripción del trabajo (máx. 150 caracteres)"/><div style={{display:"flex",justifyContent:"space-between"}}><ErrMsg k="desc"/><span style={{fontSize:11,color:form.desc.length>=140?"#A32D2D":"#6b7280",marginLeft:"auto"}}>{form.desc.length}/150</span></div></div>
        <div style={{marginBottom:14}}><Lbl t="Monto total con IVA ($) *"/><div style={{display:"flex",alignItems:"center",gap:10}}><input type="number" value={form.montoIVA} onChange={e=>setForm({...form,montoIVA:e.target.value})} style={{...IS,border:`0.5px solid ${errs.montoIVA?"#A32D2D":"#d1d5db"}`}} placeholder="0.00"/>{form.montoIVA&&<div style={{flexShrink:0,fontSize:12,color:"#6b7280",whiteSpace:"nowrap"}}>Neto: <strong>${(parseFloat(form.montoIVA)/1.16).toLocaleString("es-MX",{maximumFractionDigits:2})}</strong> · IVA: <strong>${(parseFloat(form.montoIVA)/1.16*.16).toLocaleString("es-MX",{maximumFractionDigits:2})}</strong></div>}</div><ErrMsg k="montoIVA"/></div>
        <div style={{marginBottom:16}}><Lbl t="Importar documento OC (PDF o XML)"/><label style={{display:"flex",alignItems:"center",gap:10,border:"1px dashed #d1d5db",borderRadius:8,padding:"10px 14px",cursor:"pointer",background:"#f9fafb"}}><input type="file" accept=".pdf,.xml" onChange={e=>setForm({...form,docNombre:e.target.files[0]?.name||""})} style={{display:"none"}}/><div style={{width:32,height:32,borderRadius:8,background:form.docNombre?"#E1F5EE":"white",border:"0.5px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{form.docNombre?"✓":"📎"}</div><div>{form.docNombre?<><p style={{margin:0,fontSize:13,fontWeight:500,color:"#1D9E75"}}>{form.docNombre}</p><p style={{margin:0,fontSize:11,color:"#6b7280"}}>Clic para cambiar</p></>:<><p style={{margin:0,fontSize:13,color:"#6b7280"}}>Clic para adjuntar el documento de la OC</p><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>PDF o XML · Opcional</p></>}</div></label></div>
        <Btn c="p" onClick={guardar}>{editId?"Guardar cambios":"Crear orden de compra"}</Btn>
        <Btn onClick={()=>{setShow(false);setEditId(null);setErrs({});}}>Cancelar</Btn>
      </Card>}
      <input value={q} onChange={e=>setQ(e.target.value)} style={{...IS,marginBottom:12}} placeholder="Buscar por razón social, descripción o número..."/>
      {filtradas.map(oc=>{
        const pv=getPV(oc.proveedorId);const ant=ants.find(a=>a.ocId===oc.id);const elim=oc.estatus==="eliminada";const montoIVA=oc.montoIVA||oc.monto*1.16;const monto=oc.monto||montoIVA/1.16;
        return(<Card key={oc.id} style={{opacity:elim?0.6:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div style={{flex:1,minWidth:0,marginRight:10}}>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:4}}><p style={{margin:0,fontWeight:500,fontSize:14,textDecoration:elim?"line-through":"none"}}>{oc.id}</p><Bd s={oc.estatus}/></div>
              <p style={{margin:"0 0 4px",fontSize:13,color:"#6b7280"}}>{oc.descripcion}</p>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><span style={{background:"#FAEEDA",color:"#BA7517",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{pv?.razonSocial}</span>{oc.docNombre&&<span style={{background:"#FCEBEB",color:"#A32D2D",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>📎 {oc.docNombre}</span>}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}><p style={{margin:"0 0 1px",fontSize:12,color:"#6b7280"}}>Neto ${monto.toLocaleString("es-MX",{maximumFractionDigits:2})}</p><p style={{margin:"0 0 1px",fontSize:12,color:"#185FA5"}}>IVA ${(monto*.16).toLocaleString("es-MX",{maximumFractionDigits:2})}</p><p style={{margin:0,fontWeight:500,fontSize:14}}>${montoIVA.toLocaleString("es-MX",{maximumFractionDigits:2})} MXN</p><p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{oc.fecha}</p></div>
          </div>
          <div style={{borderTop:"0.5px solid #e5e7eb",paddingTop:8,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:oc.historial?.length?6:0}}>
            <span style={{fontSize:12,color:"#6b7280"}}>Anticipo:</span>
            {ant?<><Bd s={ant.estatus}/><span style={{fontSize:12,fontWeight:500,color:"#BA7517"}}>${ant.monto.toLocaleString()} ({ant.porcentaje}%)</span></>:<Bd s="sin_anticipo"/>}
          </div>
          {oc.historial?.map((h,i)=><div key={i} style={{fontSize:11,color:"#6b7280",background:"#f9fafb",padding:"2px 8px",borderRadius:6,marginBottom:2}}>{h.accion} · {h.fecha} · {h.por}{h.motivo?` — "${h.motivo}"`:""}</div>)}
          {user.rol==="admin"&&!elim&&<div style={{marginTop:8,display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
            <Btn c="v" sm onClick={()=>abrir(oc)}>Editar</Btn>
            {motivoId===oc.id?<><input value={motivo} onChange={e=>setMotivo(e.target.value)} style={{fontSize:12,padding:"3px 8px",borderRadius:6,border:"0.5px solid #d1d5db",width:180}} placeholder="Motivo..."/><Btn c="d" sm onClick={()=>eliminar(oc.id)}>Confirmar</Btn><Btn sm onClick={()=>{setMotivoId(null);setMotivo("");}}>Cancelar</Btn></>:<Btn c="d" sm onClick={()=>{setMotivoId(oc.id);setMotivo("");}}>Eliminar</Btn>}
          </div>}
        </Card>);
      })}
    </div>
  );
}

function Ants({ants,setAnts,ocs,user,toast_}) {
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({ocId:"",monto:"",nota:""});
  const [q,setQ]=useState("");
  const [subFacId,setSubFacId]=useState(null);
  const [ff,setFf]=useState({serie:"",folio:"",uuid:"",monto:"",xml:"",pdf:""});
  const [fe,setFe]=useState({});
  const libres=ocs.filter(o=>!ants.find(a=>a.ocId===o.id)&&o.estatus!=="eliminada");
  const ocSel=ocs.find(o=>o.id===form.ocId);
  const porc=ocSel&&form.monto?((parseFloat(form.monto)/ocSel.monto)*100).toFixed(1):"—";
  const lista=user.rol==="proveedor"?ants.filter(a=>ocs.find(o=>o.id===a.ocId&&o.proveedorId===user.proveedorId)):q?ants.filter(a=>{const oc=ocs.find(o=>o.id===a.ocId);const pv=getPV(oc?.proveedorId);return pv?.razonSocial.toLowerCase().includes(q.toLowerCase())||a.ocId.toLowerCase().includes(q.toLowerCase());}):ants;
  const registrar=()=>{if(!form.ocId||!form.monto)return;const n={id:`ANT-${String(ants.length+1).padStart(3,"0")}`,ocId:form.ocId,monto:parseFloat(form.monto),porcentaje:parseFloat(porc)||0,estatus:"enviado",fecha:new Date().toLocaleDateString("es-MX"),nota:form.nota,factura:null};setAnts(p=>[...p,n]);setForm({ocId:"",monto:"",nota:""});setShow(false);toast_("Anticipo registrado");};
  const guardarFac=(id)=>{if(!ff.pdf){setFe({pdf:"Adjunta el PDF"});return;}setAnts(p=>p.map(a=>a.id===id?{...a,estatus:"con_factura",factura:{pdf:ff.pdf,fecha:new Date().toLocaleDateString("es-MX")}}:a));setSubFacId(null);setFf({serie:"",folio:"",uuid:"",monto:"",xml:"",pdf:""});setFe({});toast_("Factura del anticipo guardada");};
  const tTotal=ants.length;const tFac=ants.filter(a=>a.factura).length;const tMonto=ants.reduce((s,a)=>s+a.monto,0);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <p style={{margin:0,fontWeight:500}}>Anticipos</p>
        {user.rol==="admin"&&<Btn c="a" onClick={()=>setShow(!show)}>+ Registrar anticipo</Btn>}
      </div>
      {user.rol==="admin"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[[tTotal,"Total","#533AB7","#EEEDFE"],[tFac,"Con factura","#1D9E75","#E1F5EE"],["$"+tMonto.toLocaleString(),"Monto total","#BA7517","#FAEEDA"]].map(([v,l,c,bg])=>(
          <div key={l} style={{background:bg,borderRadius:10,padding:"10px 12px"}}><p style={{margin:0,fontSize:11,color:c,fontWeight:500}}>{l}</p><p style={{margin:"3px 0 0",fontSize:18,fontWeight:500,color:c}}>{v}</p></div>
        ))}
      </div>}
      {show&&<Card>
        <p style={{fontWeight:500,margin:"0 0 10px",fontSize:14}}>Nuevo anticipo</p>
        <div style={{marginBottom:10}}><Lbl t="OC (sin anticipo previo)"/><select value={form.ocId} onChange={e=>setForm({...form,ocId:e.target.value,monto:""})} style={SS}><option value="">Selecciona OC</option>{libres.map(o=>{const pv=getPV(o.proveedorId);return<option key={o.id} value={o.id}>{o.id} — {pv?.razonSocial}</option>;})}</select></div>
        {ocSel&&<p style={{fontSize:12,background:"#F1EFE8",padding:"6px 10px",borderRadius:8,margin:"0 0 10px",color:"#5F5E5A"}}>Total OC: <strong>${ocSel.monto.toLocaleString()} MXN</strong></p>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><Lbl t="Monto ($)"/><input type="number" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} style={IS}/></div>
          <div><Lbl t="% calculado"/><div style={{padding:"7px 10px",borderRadius:8,background:"#f9fafb",fontSize:14,fontWeight:500,color:"#BA7517"}}>{porc}{porc!=="—"?"%":""}</div></div>
        </div>
        <div style={{marginBottom:12}}><Lbl t="Nota"/><input value={form.nota} onChange={e=>setForm({...form,nota:e.target.value})} style={IS} placeholder="Anticipo para inicio de trabajos"/></div>
        <Btn c="a" onClick={registrar}>Registrar</Btn><Btn onClick={()=>setShow(false)}>Cancelar</Btn>
      </Card>}
      {user.rol==="admin"&&<input value={q} onChange={e=>setQ(e.target.value)} style={{...IS,marginBottom:12}} placeholder="Buscar..."/>}
      {lista.length===0&&<p style={{color:"#6b7280",fontSize:14}}>Sin anticipos.</p>}
      {lista.map(a=>{
        const oc=ocs.find(o=>o.id===a.ocId);const pv=getPV(oc?.proveedorId);const pct=oc?(a.monto/oc.monto*100).toFixed(1):a.porcentaje;
        const puedeSubir=(user.rol==="admin")||(user.rol==="proveedor"&&oc?.proveedorId===user.proveedorId);
        return(<Card key={a.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1,minWidth:0,marginRight:10}}><p style={{margin:"0 0 2px",fontWeight:500,fontSize:14}}>{a.id} — {a.ocId}</p><span style={{background:"#FAEEDA",color:"#BA7517",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{pv?.razonSocial}</span><p style={{margin:"4px 0 0",fontSize:12,color:"#6b7280"}}>{oc?.obra||oc?.descripcion}</p>{a.nota&&<p style={{margin:"2px 0 0",fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{a.nota}</p>}</div>
            <div style={{textAlign:"right",flexShrink:0}}><Bd s={a.estatus}/><p style={{margin:"5px 0 0",fontWeight:500,fontSize:15}}>${a.monto.toLocaleString()} MXN</p><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>{a.fecha}</p></div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#6b7280"}}>Anticipo sobre OC</span><span style={{fontSize:11,fontWeight:500,color:"#BA7517"}}>{pct}%</span></div>
            <div style={{background:"#F1EFE8",borderRadius:4,height:5}}><div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:"#BA7517",borderRadius:4}}/></div>
            {oc&&<div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{fontSize:11,color:"#6b7280"}}>Total: ${oc.monto.toLocaleString()}</span><span style={{fontSize:11,color:"#6b7280"}}>Por amortizar: ${(oc.monto-a.monto).toLocaleString()}</span></div>}
          </div>
          <div style={{borderTop:"0.5px solid #e5e7eb",paddingTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <div><span style={{fontSize:12,color:"#6b7280",fontWeight:500}}>Factura anticipo: </span>{a.factura?<span style={{fontSize:12,color:"#1D9E75",fontWeight:500}}>✓ {a.factura.pdf} · {a.factura.fecha}</span>:<span style={{fontSize:12,color:"#BA7517"}}>Sin factura adjunta</span>}</div>
              <div style={{display:"flex",gap:6}}>{puedeSubir&&<Btn c="a" sm onClick={()=>setSubFacId(subFacId===a.id?null:a.id)}>{a.factura?"Actualizar":"Subir factura"}</Btn>}{user.rol==="admin"&&a.estatus==="enviado"&&<Btn c="s" sm onClick={()=>{setAnts(p=>p.map(x=>x.id===a.id?{...x,estatus:"recibido"}:x));toast_("Marcado como recibido");}}>Marcar recibido</Btn>}</div>
            </div>
            {a.factura&&<div style={{marginTop:6}}><span style={{background:"#FCEBEB",color:"#A32D2D",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>PDF: {a.factura.pdf}</span></div>}
            {subFacId===a.id&&<div style={{marginTop:10,padding:12,background:"#f9fafb",borderRadius:10}}>
              <Lbl t="Adjuntar factura PDF *"/>
              <label style={{display:"block",border:`1px dashed ${fe.pdf?"#A32D2D":"#d1d5db"}`,borderRadius:8,padding:"12px",cursor:"pointer",background:"white",textAlign:"center",marginBottom:8}}>
                <input type="file" accept=".pdf" onChange={e=>setFf({...ff,pdf:e.target.files[0]?.name||""})} style={{display:"none"}}/>
                {ff.pdf?<span style={{fontSize:12,color:"#1D9E75",fontWeight:500}}>✓ {ff.pdf}</span>:<span style={{fontSize:12,color:"#6b7280"}}>Haz clic para adjuntar PDF</span>}
              </label>
              {fe.pdf&&<p style={{color:"#A32D2D",fontSize:11,margin:"0 0 8px"}}>{fe.pdf}</p>}
              <Btn c="a" sm onClick={()=>guardarFac(a.id)}>Guardar</Btn><Btn sm onClick={()=>{setSubFacId(null);setFe({});}}>Cancelar</Btn>
            </div>}
          </div>
        </Card>);
      })}
    </div>
  );
}

function Avances({avances,setAvances,setVales,user,toast_}) {
  const lista=user.rol==="proveedor"?avances.filter(a=>a.proveedorId===user.proveedorId):avances;
  const validar=(id,ok)=>{setAvances(p=>p.map(a=>{if(a.id!==id)return a;if(ok){const vid=`VE-${String(Math.floor(Math.random()*900)+100)}`;setVales(v=>[...v,{id:vid,oc:a.oc,descripcion:a.descripcion,firmaResidente:false,firmaDirector:false,estatus:"pendiente_residente",proveedorId:a.proveedorId}]);toast_(`Vale ${vid} generado`);return{...a,estatus:"validado"};}toast_("Rechazado");return{...a,estatus:"rechazado"};}));};
  return (
    <div>
      <p style={{fontWeight:500,marginBottom:12}}>Avances reportados</p>
      {lista.length===0&&<p style={{color:"#6b7280",fontSize:14}}>Sin avances.</p>}
      {lista.map(av=>(
        <Card key={av.id}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div><p style={{margin:"0 0 2px",fontWeight:500,fontSize:14}}>{av.id} — {av.oc}</p><p style={{margin:"0 0 3px",fontSize:13,color:"#6b7280"}}>{av.descripcion}</p><p style={{margin:0,fontSize:12,color:"#6b7280"}}>{getPV(av.proveedorId)?.razonSocial} · {av.fotos} foto(s)</p></div>
            <Bd s={av.estatus}/>
          </div>
          {(user.rol==="residente"||user.rol==="admin")&&av.estatus==="pendiente_residente"&&<div><Btn c="s" sm onClick={()=>validar(av.id,true)}>Validar y generar vale</Btn><Btn c="d" sm onClick={()=>validar(av.id,false)}>Rechazar</Btn></div>}
        </Card>
      ))}
    </div>
  );
}

function Vales({vales,setVales,user,toast_}) {
  const lista=user.rol==="proveedor"?vales.filter(v=>v.proveedorId===user.proveedorId):vales;
  const firmar=(id,q)=>{setVales(p=>p.map(v=>{if(v.id!==id)return v;const u={...v};if(q==="r")u.firmaResidente=true;if(q==="d")u.firmaDirector=true;if(u.firmaResidente&&u.firmaDirector)u.estatus="validado";else if(u.firmaResidente)u.estatus="pendiente_director";toast_(`Vale ${id} firmado`);return u;}));};
  return (
    <div>
      <p style={{fontWeight:500,marginBottom:12}}>Vales de entrada</p>
      {lista.length===0&&<p style={{color:"#6b7280",fontSize:14}}>Sin vales.</p>}
      {lista.map(v=>(
        <Card key={v.id}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <div><p style={{margin:"0 0 2px",fontWeight:500,fontSize:14}}>{v.id} — {v.oc}</p><p style={{margin:"0 0 4px",fontSize:13,color:"#6b7280"}}>{v.descripcion}</p><span style={{background:"#FAEEDA",color:"#BA7517",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{getPV(v.proveedorId)?.razonSocial}</span></div>
            <Bd s={v.estatus}/>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:10}}>{[["Residente",v.firmaResidente],["Director",v.firmaDirector]].map(([l,ok])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:11,height:11,borderRadius:6,background:ok?"#1D9E75":"#ccc"}}/><span style={{fontSize:12,color:"#6b7280"}}>{l}</span></div>)}</div>
          {user.rol==="residente"&&!v.firmaResidente&&<Btn c="p" sm onClick={()=>firmar(v.id,"r")}>Firmar como residente</Btn>}
          {user.rol==="director"&&!v.firmaDirector&&<Btn c="p" sm onClick={()=>firmar(v.id,"d")}>Firmar como director</Btn>}
          {user.rol==="admin"&&<div>{!v.firmaResidente&&<Btn sm onClick={()=>firmar(v.id,"r")}>Firmar residente</Btn>}{!v.firmaDirector&&<Btn sm onClick={()=>firmar(v.id,"d")}>Firmar director</Btn>}</div>}
          {v.estatus==="validado"&&<span style={{fontSize:12,color:"#1D9E75",fontWeight:500}}>✓ Expediente listo para descarga</span>}
        </Card>
      ))}
    </div>
  );
}

function Reportar({ocs,avances,setAvances,user,toast_}) {
  const mis=ocs.filter(o=>o.proveedorId===user.proveedorId&&o.estatus!=="eliminada");
  const [form,setForm]=useState({oc:"",desc:"",fotos:0});
  const env=()=>{if(!form.oc||!form.desc)return;setAvances(p=>[...p,{id:`AV-${String(avances.length+1).padStart(3,"0")}`,oc:form.oc,descripcion:form.desc,fotos:parseInt(form.fotos)||0,estatus:"pendiente_residente",proveedorId:user.proveedorId}]);setForm({oc:"",desc:"",fotos:0});toast_("Avance enviado");};
  return (
    <div>
      <p style={{fontWeight:500,marginBottom:12}}>Reportar avance</p>
      <Card>
        <div style={{marginBottom:10}}><Lbl t="Orden de compra"/><select value={form.oc} onChange={e=>setForm({...form,oc:e.target.value})} style={SS}><option value="">Selecciona OC</option>{mis.map(o=><option key={o.id} value={o.id}>{o.id} — {o.descripcion}</option>)}</select></div>
        <div style={{marginBottom:10}}><Lbl t="Descripción"/><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={3} style={{...IS,padding:"7px 10px",borderRadius:8,border:"0.5px solid #d1d5db",fontSize:14,resize:"vertical"}} placeholder="Describe el trabajo realizado..."/></div>
        <div style={{marginBottom:14}}><Lbl t="Fotos adjuntas"/><input type="number" min={0} value={form.fotos} onChange={e=>setForm({...form,fotos:e.target.value})} style={{width:80}}/></div>
        <Btn c="p" onClick={env}>Enviar para validación</Btn>
      </Card>
    </div>
  );
}

function Facts({facts,setFacts,vales,ants,user,toast_}) {
  const [form,setForm]=useState({vale:"",serie:"",folio:"",uuid:"",monto:"",metodo:"PPD",uso:"I01"});
  const [xml,setXml]=useState(null);const [pdf,setPdf]=useState(null);const [errs,setErrs]=useState({});
  const [subFacId,setSubFacId]=useState(null);const [subPagoId,setSubPagoId]=useState(null);
  const [facFile,setFacFile]=useState("");const [pagoFile,setPagoFile]=useState("");
  const [visorFile,setVisorFile]=useState(null);
  const disp=vales.filter(v=>v.estatus==="validado"&&v.proveedorId===user.proveedorId&&!facts.find(f=>f.vale===v.id));
  const mis=facts.filter(f=>f.proveedorId===user.proveedorId);
  const enviar=()=>{const e={};if(!form.vale)e.vale="Req";if(!form.folio)e.folio="Req";if(!form.uuid)e.uuid="Req";if(!form.monto)e.monto="Req";if(!xml)e.xml="Sube XML";if(!pdf)e.pdf="Sube PDF";setErrs(e);if(Object.keys(e).length)return;setFacts(p=>[...p,{id:`FAC-${String(facts.length+1).padStart(3,"0")}`,vale:form.vale,serie:form.serie,folio:form.folio,uuid:form.uuid,monto:parseFloat(form.monto),metodo:form.metodo,uso:form.uso,proveedorId:user.proveedorId,estatus:"en_revision",xmlNombre:xml,pdfNombre:pdf,origen:"vale",fecha:new Date().toLocaleDateString("es-MX"),facAdjunto:null,pagoAdjunto:null,estatusPago:"pendiente"}]);setForm({vale:"",serie:"",folio:"",uuid:"",monto:"",metodo:"PPD",uso:"I01"});setXml(null);setPdf(null);setErrs({});toast_("Factura enviada a revisión");};

  if(user.rol==="proveedor"){return(
    <div>
      <p style={{fontWeight:500,marginBottom:12}}>Facturar</p>
      {disp.length===0?<Card><p style={{color:"#6b7280",fontSize:14,margin:0}}>Sin vales validados. Espera firmas del residente y director.</p></Card>
      :<Card>
        <p style={{fontWeight:500,margin:"0 0 12px",fontSize:14}}>Datos del CFDI</p>
        <div style={{marginBottom:10}}><Lbl t="Vale"/><select value={form.vale} onChange={e=>setForm({...form,vale:e.target.value})} style={SS}><option value="">Selecciona</option>{disp.map(v=><option key={v.id} value={v.id}>{v.id} — {v.oc}</option>)}</select>{errs.vale&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.vale}</p>}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginBottom:10}}><div><Lbl t="Serie"/><input value={form.serie} onChange={e=>setForm({...form,serie:e.target.value})} style={IS} placeholder="FB"/></div><div><Lbl t="Folio"/><input value={form.folio} onChange={e=>setForm({...form,folio:e.target.value})} style={IS} placeholder="20"/>{errs.folio&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.folio}</p>}</div></div>
        <div style={{marginBottom:10}}><Lbl t="UUID"/><input value={form.uuid} onChange={e=>setForm({...form,uuid:e.target.value})} style={IS} placeholder="A2B3C6E5-F8D1-4572..."/>{errs.uuid&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.uuid}</p>}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><div><Lbl t="Monto ($)"/><input type="number" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} style={IS}/>{errs.monto&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.monto}</p>}</div><div><Lbl t="Método"/><select value={form.metodo} onChange={e=>setForm({...form,metodo:e.target.value})} style={SS}><option value="PPD">PPD</option><option value="PUE">PUE</option></select></div><div><Lbl t="Uso CFDI"/><select value={form.uso} onChange={e=>setForm({...form,uso:e.target.value})} style={SS}><option value="I01">I01</option><option value="G03">G03</option><option value="P01">P01</option></select></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <div><Lbl t="XML *"/><label style={{display:"block",border:`1px dashed ${errs.xml?"#A32D2D":"#d1d5db"}`,borderRadius:8,padding:"10px",cursor:"pointer",background:"#f9fafb",textAlign:"center"}}><input type="file" accept=".xml" onChange={e=>setXml(e.target.files[0]?.name||null)} style={{display:"none"}}/>{xml?<span style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>✓ {xml}</span>:<span style={{fontSize:11,color:"#6b7280"}}>Adjuntar XML</span>}</label>{errs.xml&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.xml}</p>}</div>
          <div><Lbl t="PDF *"/><label style={{display:"block",border:`1px dashed ${errs.pdf?"#A32D2D":"#d1d5db"}`,borderRadius:8,padding:"10px",cursor:"pointer",background:"#f9fafb",textAlign:"center"}}><input type="file" accept=".pdf" onChange={e=>setPdf(e.target.files[0]?.name||null)} style={{display:"none"}}/>{pdf?<span style={{fontSize:11,color:"#1D9E75",fontWeight:500}}>✓ {pdf}</span>:<span style={{fontSize:11,color:"#6b7280"}}>Adjuntar PDF</span>}</label>{errs.pdf&&<p style={{color:"#A32D2D",fontSize:11,margin:0}}>{errs.pdf}</p>}</div>
        </div>
        <p style={{fontSize:12,background:"#E6F1FB",color:"#185FA5",padding:"7px 12px",borderRadius:8,margin:"0 0 12px"}}>El expediente completo se integrará para revisión.</p>
        <Btn c="p" onClick={enviar}>Enviar a revisión de pago</Btn>
      </Card>}
      {mis.length>0&&<div style={{marginTop:16}}><p style={{fontWeight:500,marginBottom:8}}>Mis facturas</p>{mis.map(f=><Card key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{margin:"0 0 2px",fontWeight:500,fontSize:14}}>{f.id} · {f.serie}{f.folio}</p><p style={{margin:0,fontSize:12,color:"#6b7280"}}>${f.monto?.toLocaleString()} · {f.fecha}</p></div><div style={{textAlign:"right"}}><Bd s={f.estatus}/><br/><span style={{background:f.estatusPago==="pagado"?"#E1F5EE":"#FAEEDA",color:f.estatusPago==="pagado"?"#0F6E56":"#BA7517",fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:500}}>{f.estatusPago==="pagado"?"Pagado":"Pendiente"}</span></div></Card>)}</div>}
    </div>
  );}

  return(
    <div>
      {visorFile&&<Visor nombre={visorFile} onClose={()=>setVisorFile(null)}/>}
      <p style={{fontWeight:500,marginBottom:12}}>Facturas y pagos</p>
      {facts.length===0&&<p style={{color:"#6b7280",fontSize:14}}>Sin facturas registradas.</p>}
      {facts.map(f=>{
        const iva=f.monto*0.16;const pv=getPV(f.proveedorId);
        return(<Card key={f.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div><p style={{margin:"0 0 2px",fontWeight:500,fontSize:14}}>{f.id} · {f.serie}{f.folio}</p><p style={{margin:"0 0 3px",fontSize:12,color:"#6b7280"}}>{pv?.razonSocial} · {f.fecha}</p><p style={{margin:0,fontSize:11,color:"#9ca3af"}}>UUID: {f.uuid?.slice(0,28)}...</p></div>
            <Bd s={f.estatus}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"0.9fr 1.1fr 1.1fr 1.3fr 0.9fr 1.3fr",gap:10,borderTop:"0.5px solid #e5e7eb",paddingTop:10}}>
            {/* Fecha */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Fecha</p>
              {(()=>{const esVale=f.origen==="vale"||(!f.origen&&f.vale);const ref=esVale?vales.find(v=>v.id===f.vale):ants.find(a=>a.id===f.antId);const fechaRef=ref?.fecha||f.fecha;return(<div><p style={{margin:"0 0 2px",fontSize:13,fontWeight:500}}>{fechaRef}</p><span style={{background:esVale?"#E1F5EE":"#FAEEDA",color:esVale?"#0F6E56":"#BA7517",fontSize:10,padding:"1px 7px",borderRadius:6,fontWeight:500}}>{esVale?"Vale":"Anticipo"}</span><p style={{margin:"3px 0 0",fontSize:11,color:"#9ca3af"}}>{f.vale||f.antId||"—"}</p></div>);})()}
            </div>
            {/* Origen */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Origen</p>
              <select value={f.origen||"vale"} onChange={e=>{setFacts(p=>p.map(x=>x.id===f.id?{...x,origen:e.target.value}:x));toast_("Origen actualizado");}} style={{...SS,fontSize:12,padding:"4px 8px"}}>
                <option value="vale">Vale</option><option value="anticipo">Anticipo</option>
              </select>
            </div>
            {/* Factura */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Factura</p>
              <p style={{margin:"0 0 1px",fontSize:13,fontWeight:500}}>${f.monto?.toLocaleString()}</p><p style={{margin:"0 0 1px",fontSize:11,color:"#9ca3af"}}>s/IVA</p>
              <p style={{margin:"0 0 1px",fontSize:12,color:"#185FA5"}}>IVA ${iva.toLocaleString()}</p>
              <p style={{margin:0,fontSize:13,fontWeight:500,color:"#185FA5"}}>${(f.monto+iva).toLocaleString()} c/IVA</p>
            </div>
            {/* Adjunto */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Adjunto</p>
              {f.facAdjunto&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:5}}><span style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10,padding:"2px 6px",borderRadius:5,fontWeight:500,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📎 {f.facAdjunto}</span><button onClick={()=>setVisorFile(f.facAdjunto)} style={{fontSize:10,background:"#E6F1FB",color:"#185FA5",border:"none",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontWeight:500}}>Ver</button></div>}
              {subFacId===f.id?<div><label style={{display:"block",border:"1px dashed #d1d5db",borderRadius:7,padding:"5px 8px",cursor:"pointer",background:"#f9fafb",textAlign:"center",marginBottom:4}}><input type="file" accept=".pdf,.xml" onChange={e=>setFacFile(e.target.files[0]?.name||"")} style={{display:"none"}}/>{facFile?<span style={{fontSize:10,color:"#1D9E75",fontWeight:500}}>✓ {facFile}</span>:<span style={{fontSize:10,color:"#6b7280"}}>Seleccionar</span>}</label><Btn c="p" sm onClick={()=>{if(!facFile)return;setFacts(p=>p.map(x=>x.id===f.id?{...x,facAdjunto:facFile}:x));setSubFacId(null);setFacFile("");toast_("Adjuntado");}}>OK</Btn><Btn sm onClick={()=>{setSubFacId(null);setFacFile("");}}>✕</Btn></div>:<Btn sm onClick={()=>{setSubFacId(f.id);setFacFile("");}}>{f.facAdjunto?"Cambiar":"Subir"}</Btn>}
              <div style={{display:"flex",gap:3,marginTop:4}}>{f.xmlNombre&&<span style={{background:"#E6F1FB",color:"#185FA5",fontSize:10,padding:"1px 5px",borderRadius:4,fontWeight:500}}>XML</span>}{f.pdfNombre&&<span style={{background:"#FCEBEB",color:"#A32D2D",fontSize:10,padding:"1px 5px",borderRadius:4,fontWeight:500}}>PDF</span>}</div>
            </div>
            {/* Pago */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Pago</p>
              <select value={f.estatusPago||"pendiente"} onChange={e=>{const v=e.target.value;setFacts(p=>p.map(x=>x.id===f.id?{...x,estatusPago:v,estatus:v==="pagado"?"pagada":x.estatus}:x));toast_(`Pago: ${v}`);}} style={{...SS,fontSize:12,padding:"4px 8px",color:f.estatusPago==="pagado"?"#0F6E56":"#BA7517",background:f.estatusPago==="pagado"?"#E1F5EE":"#FAEEDA",border:`0.5px solid ${f.estatusPago==="pagado"?"#1D9E75":"#BA7517"}`}}>
                <option value="pendiente">Pendiente</option><option value="pagado">Pagado</option>
              </select>
              {f.estatus==="en_revision"&&<div style={{marginTop:6}}><Btn c="s" sm onClick={()=>{setFacts(p=>p.map(x=>x.id===f.id?{...x,estatus:"aprobada"}:x));toast_("Aprobada");}}>Aprobar</Btn></div>}
            </div>
            {/* Comprobante */}
            <div>
              <p style={{margin:"0 0 5px",fontSize:11,color:"#6b7280",fontWeight:500,textTransform:"uppercase"}}>Comprobante</p>
              {f.pagoAdjunto&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:5}}><span style={{background:"#E1F5EE",color:"#0F6E56",fontSize:10,padding:"2px 6px",borderRadius:5,fontWeight:500,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📎 {f.pagoAdjunto}</span><button onClick={()=>setVisorFile(f.pagoAdjunto)} style={{fontSize:10,background:"#E6F1FB",color:"#185FA5",border:"none",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontWeight:500}}>Ver</button></div>}
              {subPagoId===f.id?<div><label style={{display:"block",border:"1px dashed #d1d5db",borderRadius:7,padding:"5px 8px",cursor:"pointer",background:"#f9fafb",textAlign:"center",marginBottom:4}}><input type="file" accept=".pdf,.jpg,.png" onChange={e=>setPagoFile(e.target.files[0]?.name||"")} style={{display:"none"}}/>{pagoFile?<span style={{fontSize:10,color:"#1D9E75",fontWeight:500}}>✓ {pagoFile}</span>:<span style={{fontSize:10,color:"#6b7280"}}>Seleccionar</span>}</label><Btn c="s" sm onClick={()=>{if(!pagoFile)return;setFacts(p=>p.map(x=>x.id===f.id?{...x,pagoAdjunto:pagoFile,estatusPago:"pagado",estatus:"pagada"}:x));setSubPagoId(null);setPagoFile("");toast_("Comprobante registrado");}}>OK</Btn><Btn sm onClick={()=>{setSubPagoId(null);setPagoFile("");}}>✕</Btn></div>:<Btn c="a" sm onClick={()=>{setSubPagoId(f.id);setPagoFile("");}}>{f.pagoAdjunto?"Cambiar":"Subir"}</Btn>}
            </div>
          </div>
        </Card>);
      })}
    </div>
  );
}

function Users() {
  return(
    <div>
      <p style={{fontWeight:500,marginBottom:12}}>Usuarios del sistema</p>
      {USERS.map(u=>(
        <Card key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:17,background:RC[u.rol]||"#888",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:600,fontSize:13,flexShrink:0}}>{u.nombre[0]}</div>
            <div><p style={{margin:0,fontWeight:500,fontSize:14}}>{u.nombre}</p><p style={{margin:0,fontSize:12,color:"#6b7280"}}>@{u.usuario} · {RN[u.rol]}</p></div>
          </div>
          <Bd s="activa"/>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(null);
  const [vista,setVista]=useState("");
  const [ocs,setOcs]=useState(OCS0);
  const [ants,setAnts]=useState(ANTS0);
  const [avances,setAvances]=useState(AVANCES0);
  const [vales,setVales]=useState(VALES0);
  const [facts,setFacts]=useState(FACTS0);
  const [toast,setToast]=useState("");
  const toast_=m=>{setToast(m);setTimeout(()=>setToast(""),2500);};
  const NAV={
    admin:[["ocs","Órdenes"],["ants","Anticipos"],["avances","Avances"],["vales","Vales"],["facts","Facturas"],["users","Usuarios"]],
    residente:[["avances","Avances"],["vales","Vales"]],
    director:[["vales","Vales"],["facts","Facturas"]],
    proveedor:[["ocs","Mis Órdenes"],["ants","Mis Anticipos"],["reportar","Reportar"],["vales","Mis Vales"],["facts","Facturar"]],
  };
  if(!user)return<Login onLogin={u=>{setUser(u);setVista(NAV[u.rol][0][0]);}}/>;
  const rc=RC[user.rol];
  return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
      {toast&&<div style={{position:"fixed",top:12,right:12,background:"#1D9E75",color:"white",padding:"8px 16px",borderRadius:10,fontSize:13,zIndex:999,fontWeight:500}}>{toast}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"0.5px solid #e5e7eb",paddingBottom:12,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:17,background:rc,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:600,fontSize:14,flexShrink:0}}>{user.nombre[0]}</div>
          <div><p style={{margin:0,fontSize:14,fontWeight:500}}>{user.nombre}</p><p style={{margin:0,fontSize:11,color:rc}}>{RN[user.rol]}</p></div>
        </div>
        <Btn onClick={()=>setUser(null)} sm>Cerrar sesión</Btn>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18,alignItems:"center"}}>
        {vista&&<button onClick={()=>setVista("")} style={{padding:"5px 11px",fontSize:13,borderRadius:8,cursor:"pointer",background:"transparent",color:"#6b7280",border:"0.5px solid #d1d5db",marginRight:2}}>← Menú</button>}
        {NAV[user.rol].map(([k,l])=>(
          <button key={k} onClick={()=>setVista(k)} style={{padding:"6px 13px",fontSize:13,borderRadius:8,cursor:"pointer",fontWeight:vista===k?500:400,background:vista===k?rc:"transparent",color:vista===k?"white":"#6b7280",border:`0.5px solid ${vista===k?rc:"#d1d5db"}`}}>{l}</button>
        ))}
      </div>
      {!vista&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8}}>
        {NAV[user.rol].map(([k,l])=>(
          <div key={k} onClick={()=>setVista(k)} style={{background:"white",border:"0.5px solid #e5e7eb",borderRadius:12,padding:"18px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:rc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
              {{"ocs":"📋","ants":"💰","avances":"📸","vales":"✅","facts":"🧾","users":"👥","reportar":"📤","mis_ocs":"📋","mis_vales":"✅"}[k]||"📄"}
            </div>
            <p style={{margin:0,fontWeight:500,fontSize:14}}>{l}</p>
          </div>
        ))}
      </div>}
      {vista==="ocs"&&<Ocs ocs={ocs} setOcs={setOcs} ants={ants} user={user} toast_={toast_}/>}
      {vista==="ants"&&<Ants ants={ants} setAnts={setAnts} ocs={ocs} user={user} toast_={toast_}/>}
      {vista==="avances"&&<Avances avances={avances} setAvances={setAvances} setVales={setVales} user={user} toast_={toast_}/>}
      {vista==="vales"&&<Vales vales={vales} setVales={setVales} user={user} toast_={toast_}/>}
      {vista==="reportar"&&<Reportar ocs={ocs} avances={avances} setAvances={setAvances} user={user} toast_={toast_}/>}
      {vista==="facts"&&<Facts facts={facts} setFacts={setFacts} vales={vales} ants={ants} user={user} toast_={toast_}/>}
      {vista==="users"&&<Users/>}
    </div>
  );
}