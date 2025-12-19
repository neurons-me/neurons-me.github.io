import{j as a}from"./iframe-7B37vsqa.js";import{L as T}from"./Layout-D9bJVAcj.js";import{B as w}from"./Box-Cx2nVrBY.js";import{T as V}from"./Typography-5hCjUBC4.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Ji-WMsiF.js";import"./useGuiTheme-CnoUoe0L.js";import"./useTheme-Dabq8C6I.js";import"./TopBar-2AE7DuYL.js";import"./Link-Ce-Vub9O.js";import"./clsx-B-dksMZM.js";import"./styled-Bm_bgYTj.js";import"./memoTheme-DpXS4z9e.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography-BANQwG0w.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-vaytWYdh.js";import"./Menu-CADPjcjn.js";import"./useSlot-ITaHBN1Z.js";import"./useForkRef-BPxJYKG8.js";import"./Grow-DeEgrSUo.js";import"./utils-CYyV5NnJ.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-O8O4CYl-.js";import"./index-TLpVo6Ak.js";import"./index-COHDOsnG.js";import"./Portal-CgwEJAAR.js";import"./List-B9OzDv_j.js";import"./Paper-Dn7Wq73-.js";import"./Modal-CsRvsOrN.js";import"./useEventCallback-gaTKqCJs.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-Bus7NXgE.js";import"./ButtonBase-0Txlb-kr.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-B_yCgzYD.js";import"./useGuiMediaQuery-DE9GiEIk.js";import"./getThemeProps-Cw-Hr2SS.js";import"./Box-Cd5-1R21.js";import"./Avatar-BUCbvs0S.js";import"./createSvgIcon-U7WfFJc1.js";import"./Toolbar-CtxaIAJu.js";import"./Tooltip-BHHmPBna.js";import"./Tooltip-DAl3t8fA.js";import"./useControlled-D3puueHQ.js";import"./Collapse-DiLJprdE.js";import"./IconButton-BKzD3mgX.js";import"./CircularProgress-mFYinH2x.js";import"./Drawer-CTyjQytm.js";import"./Avatar-QyHOfWdC.js";import"./Toolbar-DafCwo5m.js";import"./Namespace-BkEY89-c.js";const jr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
