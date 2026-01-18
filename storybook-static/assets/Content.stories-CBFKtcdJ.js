import{j as a}from"./iframe-DUXF9Jp-.js";import{L as T}from"./Layout-C4uZ4SdB.js";import{B as w}from"./Box-D7s7YD-o.js";import{T as V}from"./Typography-BeYWX9sC.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Bp9HnVyY.js";import"./useGuiTheme-B_ynI0Ih.js";import"./useTheme-DomtA3N4.js";import"./TopBar-wopIUzD_.js";import"./Link-DmMYqI8m.js";import"./clsx-B-dksMZM.js";import"./styled-BgGs4gTW.js";import"./memoTheme-Coyt0tdw.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography-Ka12HhZ4.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-XmGZ3tnN.js";import"./Menu-CoZg3wF2.js";import"./useSlot-DSfMaVyg.js";import"./useForkRef-Qo-owmNe.js";import"./Grow-CMxSDbbK.js";import"./utils-VxfzK8Uv.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-D7jnMU1Z.js";import"./index-D62vm5Fu.js";import"./index-CVXptR2h.js";import"./Portal-Ca9KwZlN.js";import"./List-D_8dNgTB.js";import"./Paper-C1YcfGe8.js";import"./Modal-BCm0Gjnj.js";import"./useEventCallback-BuWfzL-t.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-DrITHoCr.js";import"./ButtonBase-yeogBKXm.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-KsQ7UbWF.js";import"./useGuiMediaQuery-BKequ5pz.js";import"./getThemeProps-BLhFTRsa.js";import"./Box-DYqOmRwG.js";import"./Avatar-CMTmL7HY.js";import"./createSvgIcon-CKqWdLB9.js";import"./Toolbar-BfpsAv1U.js";import"./Tooltip-8AwNblfO.js";import"./Tooltip-CGOmHpOF.js";import"./useControlled-BFirqgI0.js";import"./Collapse-DLY_qWd1.js";import"./IconButton-CkLfRy4h.js";import"./CircularProgress-mMUxHAy7.js";import"./Drawer-ibSh4-IP.js";import"./Avatar-A4lMjRb4.js";import"./Toolbar-D68zAqh_.js";import"./Namespace-tP3lJ2wJ.js";const jr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
