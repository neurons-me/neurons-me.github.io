import{j as a}from"./iframe-KiNLNhLW.js";import{L as T}from"./Layout-CrndAoak.js";import{B as w}from"./Box-CB6b-zbZ.js";import{T as V}from"./Typography-Bdmf2Az5.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-DobJ5-u4.js";import"./useGuiTheme-_2BpWnIl.js";import"./useTheme-Bn7zDk7a.js";import"./TopBar-DS6KypFe.js";import"./Link-DI69n2GR.js";import"./clsx-B-dksMZM.js";import"./styled-UVlhfdFb.js";import"./memoTheme-D-if7vmH.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography-CA03AtaX.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-4evKuTNV.js";import"./Menu-BEoMGuCD.js";import"./useSlot-tUPdytIY.js";import"./useForkRef-BOoLjtmA.js";import"./Grow-DZ-Ocyt3.js";import"./utils-C4ueFs-M.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-BCls0bdy.js";import"./index-B6m42dsm.js";import"./index-CEGQiLnj.js";import"./Portal-ZSDT4S8w.js";import"./List-Bt6iOPKM.js";import"./Paper-B_cOjaB_.js";import"./Modal-CCf8SzOC.js";import"./useEventCallback-DqsRIWNq.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-BlZ7oZ2J.js";import"./ButtonBase-Da8SSYJ_.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-C7DxiAhw.js";import"./useGuiMediaQuery-UF8e-0c7.js";import"./getThemeProps-CufCVf0B.js";import"./Box-NAkW13Am.js";import"./Avatar-BG_1rtdu.js";import"./createSvgIcon-23mNPw71.js";import"./Toolbar-B1ODeRY3.js";import"./Tooltip-ByYPonUK.js";import"./Tooltip-BQIVULa0.js";import"./useControlled-8imjW3Rp.js";import"./Collapse-DoXBNq_x.js";import"./IconButton-D_0LN41z.js";import"./CircularProgress-6CqXRv9O.js";import"./Drawer-AP0gVpI7.js";import"./Avatar-rL4I4hfr.js";import"./Toolbar-BLU6NU8-.js";import"./Namespace-CPtLEwXT.js";const jr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: false,
    leftSidebarConfig: false,
    rightSidebarConfig: false,
    footerConfig: false
  }
}`,...(l=(m=e.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var d,f,g;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: {
      title: 'Top Bar Example'
    }
  }
}`,...(g=(f=i.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var c,u,b;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: Template,
  args: {
    leftSidebarConfig: {
      initialView: 'expanded'
    },
    rightSidebarConfig: {
      initialView: 'expanded'
    }
  }
}`,...(b=(u=t.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var C,h,S;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: {
      title: 'Top Bar Example'
    },
    leftSidebarConfig: {
      initialView: 'rail'
    },
    rightSidebarConfig: {
      initialView: 'expanded'
    }
  }
}`,...(S=(h=o.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var x,y,B;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: {
      title: 'Full Layout'
    },
    leftSidebarConfig: {
      initialView: 'rail'
    },
    rightSidebarConfig: {
      initialView: 'rail'
    },
    footerConfig: {
      brandLabel: 'neurons.me',
      position: 'static',
      leftElements: [{
        type: 'link',
        props: {
          label: 'Docs',
          href: '/docs'
        }
      }],
      rightElements: [{
        type: 'link',
        props: {
          label: 'GitHub',
          href: 'https://github.com/neurons-me'
        }
      }]
    }
  }
}`,...(B=(y=n.parameters)==null?void 0:y.docs)==null?void 0:B.source}}};const Wr=["OnlyContent","WithTopBar","WithSidebars","WithTopBarAndSidebars","FullLayout"];export{n as FullLayout,e as OnlyContent,t as WithSidebars,i as WithTopBar,o as WithTopBarAndSidebars,Wr as __namedExportsOrder,jr as default};
