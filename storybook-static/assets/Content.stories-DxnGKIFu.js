import{j as a}from"./iframe-Bz6qbqcn.js";import{L as T}from"./Layout-aOtMs0E7.js";import{B as w}from"./Box-D4cXHuQv.js";import{T as V}from"./Typography-DyXZB11X.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-5tH0O-A9.js";import"./useGuiTheme-D-OZ20ts.js";import"./useTheme-DrhYSXVb.js";import"./TopBar-DCCBYH2j.js";import"./Link-Dmpp6dkQ.js";import"./clsx-B-dksMZM.js";import"./styled-CAEmpYjD.js";import"./memoTheme-DJJYR_dr.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography-IWzcL_9N.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-ZW5qLkPI.js";import"./Menu-Bqy9H2zD.js";import"./useSlot-Dwn8SPa8.js";import"./useForkRef-CmXmBmJ3.js";import"./Grow-C6dNtbMB.js";import"./utils-D1VEZs5m.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-SQTI9G-Y.js";import"./index-Bv9YzfcO.js";import"./index-BASnoCq0.js";import"./Portal-DlHz1GPh.js";import"./List-BGr-4Vip.js";import"./Paper-CNJ7mWPN.js";import"./Modal-DvbDZp3f.js";import"./useEventCallback-B5UFYm72.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-CbXjIjuD.js";import"./ButtonBase-BRa0l1HW.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-CxNVCHxZ.js";import"./useGuiMediaQuery-DQYl-qYI.js";import"./getThemeProps-CvC-AW8Y.js";import"./Box-FYVKJKNa.js";import"./Avatar-D0e_G1kB.js";import"./createSvgIcon-BrjGhM9k.js";import"./Toolbar-DMtEt_1i.js";import"./Tooltip-wEXgCurB.js";import"./Tooltip-Csh10Ho5.js";import"./useControlled-ds2yT4Is.js";import"./Collapse-DNtRaTsY.js";import"./IconButton-DexL0cps.js";import"./CircularProgress-7FGAifWS.js";import"./Drawer-CgM6gIJx.js";import"./Avatar-Cm6J6CJf.js";import"./Toolbar-DHxbFffF.js";import"./Namespace-CGdT183V.js";const jr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
