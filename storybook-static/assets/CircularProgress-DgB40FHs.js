import{r as R,u as j,j as d,c as n,aD as P,aC as S}from"./iframe-iiwnc_b0.js";import{c as w}from"./clsx-B-dksMZM.js";import{m as $}from"./memoTheme-B0DqKSrP.js";import{c as N}from"./createSimplePaletteValueFilter-bm0fmN_7.js";import{g as U,a as E}from"./generateUtilityClasses-DGi4yQgU.js";import{s as v,c as F}from"./styled-DlX4I15l.js";function I(e){return U("MuiCircularProgress",e)}E("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const t=44,g=S`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,h=S`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,z=typeof g!="string"?P`
        animation: ${g} 1.4s linear infinite;
      `:null,A=typeof h!="string"?P`
        animation: ${h} 1.4s ease-in-out infinite;
      `:null,K=e=>{const{classes:r,variant:s,color:a,disableShrink:c}=e,l={root:["root",s,`color${n(a)}`],svg:["svg"],circle:["circle",`circle${n(s)}`,c&&"circleDisableShrink"]};return F(l,I,r)},V=v("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:s}=e;return[r.root,r[s.variant],r[`color${n(s.color)}`]]}})($(({theme:e})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("transform")}},{props:{variant:"indeterminate"},style:z||{animation:`${g} 1.4s linear infinite`}},...Object.entries(e.palette).filter(N()).map(([r])=>({props:{color:r},style:{color:(e.vars||e).palette[r].main}}))]}))),B=v("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,r)=>r.svg})({display:"block"}),G=v("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,r)=>{const{ownerState:s}=e;return[r.circle,r[`circle${n(s.variant)}`],s.disableShrink&&r.circleDisableShrink]}})($(({theme:e})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink,style:A||{animation:`${h} 1.4s ease-in-out infinite`}}]}))),J=R.forwardRef(function(r,s){const a=j({props:r,name:"MuiCircularProgress"}),{className:c,color:l="primary",disableShrink:b=!1,size:m=40,style:D,thickness:o=3.6,value:p=0,variant:y="indeterminate",...M}=a,i={...a,color:l,disableShrink:b,size:m,thickness:o,value:p,variant:y},u=K(i),f={},k={},x={};if(y==="determinate"){const C=2*Math.PI*((t-o)/2);f.strokeDasharray=C.toFixed(3),x["aria-valuenow"]=Math.round(p),f.strokeDashoffset=`${((100-p)/100*C).toFixed(3)}px`,k.transform="rotate(-90deg)"}return d.jsx(V,{className:w(u.root,c),style:{width:m,height:m,...k,...D},ownerState:i,ref:s,role:"progressbar",...x,...M,children:d.jsx(B,{className:u.svg,ownerState:i,viewBox:`${t/2} ${t/2} ${t} ${t}`,children:d.jsx(G,{className:u.circle,style:f,ownerState:i,cx:t,cy:t,r:(t-o)/2,fill:"none",strokeWidth:o})})})});export{J as C};
