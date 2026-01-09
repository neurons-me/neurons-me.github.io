import{j as a}from"./iframe-DYg1rQ4Q.js";import{L as T}from"./Layout-DUnlfIOl.js";import{B as w}from"./Box-BWJi6iN3.js";import{T as V}from"./Typography-Cnsa7CNv.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-B4oRqt-Y.js";import"./useGuiTheme-CfCP8aQY.js";import"./useTheme-uGiJCYWK.js";import"./TopBar-FCad8n0r.js";import"./Link-6yD4aiD4.js";import"./clsx-B-dksMZM.js";import"./styled-D2HIE3X-.js";import"./memoTheme-Dn5qYM88.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography--IExoRW5.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-BcPhAvAS.js";import"./Menu-C7ry7OR_.js";import"./useSlot-CApcqFJH.js";import"./useForkRef-Dnc2eIry.js";import"./Grow-C6RPZ2nn.js";import"./utils-DgjkEy9F.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-hI-7F88X.js";import"./index-yF-DDLOw.js";import"./index-DqHlrsWY.js";import"./Portal-YVeXqMIr.js";import"./List-BPyLRYrj.js";import"./Paper-ENDDir8V.js";import"./Modal-B6cXqqmN.js";import"./useEventCallback-DuNPYkL8.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-BeZabCF-.js";import"./ButtonBase-C2c_3tqD.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-DQtQT3Z5.js";import"./useGuiMediaQuery-BjH94xhF.js";import"./getThemeProps-BwVIhl89.js";import"./Box-Cqii9b-Z.js";import"./Avatar-CgzpXdoa.js";import"./createSvgIcon-qpCeIgUQ.js";import"./Toolbar-Cc3DPbH0.js";import"./Tooltip-v1f68mKI.js";import"./Tooltip-BL3G72JZ.js";import"./useControlled-BIYKLxAr.js";import"./Collapse-BP0NBXH6.js";import"./IconButton-CRoqQFT0.js";import"./CircularProgress-Cq7hBJIF.js";import"./Drawer-BcHIlwAg.js";import"./Avatar-mKX-FW5s.js";import"./Toolbar-B1bZ_qdu.js";import"./Namespace-gMCC1iiV.js";const jr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
