import{j as a}from"./iframe-CQCl2_Xr.js";import{L as T}from"./Layout-Co-dQafu.js";import{B as w}from"./Box-jt3CMBRk.js";import{T as V}from"./Typography-tm9RKfTb.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-D235S9JT.js";import"./useGuiTheme-D8nhUVwr.js";import"./useTheme-CFoWJ9xD.js";import"./TopBar-BnmNpycV.js";import"./Link-m1WKLHx7.js";import"./clsx-B-dksMZM.js";import"./styled-BC7qG5v0.js";import"./memoTheme-DZzxScqL.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Typography-CfAGDUGj.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-TFLvQEA2.js";import"./Menu-Cd6ntgU3.js";import"./useSlot-B4gvAOZK.js";import"./useForkRef-CPfARPCl.js";import"./Grow-CziyXtdi.js";import"./utils-CwCYjrgE.js";import"./TransitionGroupContext-CJMUlc1Z.js";import"./index-CCYaVLB3.js";import"./index-BLIdC6U6.js";import"./Portal-BZxycvIB.js";import"./List-DyDU1RXR.js";import"./Paper-Mp04ufoQ.js";import"./Modal-jxY61_8p.js";import"./useEventCallback-BrK66JZi.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-C2-dXl7b.js";import"./ButtonBase-DTqM5P7a.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-9mP1_5yW.js";import"./useGuiMediaQuery-DgT9kqZ3.js";import"./getThemeProps-DsaQ4QQ3.js";import"./Box-CDlRqcfV.js";import"./Avatar-wtx1bst6.js";import"./createSvgIcon-C7YzlW23.js";import"./Toolbar-CplQJ3GM.js";import"./Tooltip-0q30Zaok.js";import"./Tooltip-BLI9qYMt.js";import"./useControlled-D_Z70eZ9.js";import"./Collapse-CNLluuv2.js";import"./IconButton-BEjmxKTj.js";import"./CircularProgress-BA5CoJKL.js";import"./Drawer-DWqwyIrj.js";import"./Avatar-BQHPf1qn.js";import"./Toolbar-Di9Q66ut.js";import"./Namespace-C8c-2trX.js";const Lr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(B=(y=n.parameters)==null?void 0:y.docs)==null?void 0:B.source}}};const jr=["OnlyContent","WithTopBar","WithSidebars","WithTopBarAndSidebars","FullLayout"];export{n as FullLayout,e as OnlyContent,t as WithSidebars,i as WithTopBar,o as WithTopBarAndSidebars,jr as __namedExportsOrder,Lr as default};
