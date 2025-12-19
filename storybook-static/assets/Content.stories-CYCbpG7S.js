import{j as a}from"./iframe-iiwnc_b0.js";import{L as T}from"./Layout-Cx4ffrJV.js";import{B as w}from"./Box-BGrhzgmv.js";import{T as V}from"./Typography-DPqt6mxi.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-DNZGECFo.js";import"./useGuiTheme-IlaYyKR_.js";import"./useTheme-82vFMpyT.js";import"./TopBar-Bu6XvjGR.js";import"./Link-BmTR0suU.js";import"./clsx-B-dksMZM.js";import"./styled-DlX4I15l.js";import"./memoTheme-B0DqKSrP.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Typography-B6hEBTBX.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-BGF-oEpj.js";import"./Menu-D5CuE4d5.js";import"./useSlot-BxCV4QU-.js";import"./useForkRef-DZCG1TVZ.js";import"./Grow-P2xsHhTI.js";import"./utils-CJx1Mhjr.js";import"./TransitionGroupContext-CnvyCsK3.js";import"./index-ChU3H_np.js";import"./index-DZAcp-XZ.js";import"./Portal-BoW-AdFV.js";import"./List-C0ueg9Tj.js";import"./Paper-DlJaJksR.js";import"./Modal-df95Y5RQ.js";import"./useEventCallback-haB0Py2x.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-e8N_kz5e.js";import"./ButtonBase-BhXVLip_.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-LdaMAp2K.js";import"./useGuiMediaQuery-CXnuA76o.js";import"./getThemeProps-DpyMgnLr.js";import"./Box-DtejdZ4-.js";import"./Avatar-DP6CKb1j.js";import"./createSvgIcon-CUb7f2wQ.js";import"./Toolbar-Dxx6mFfS.js";import"./Tooltip-9iY9lYPD.js";import"./Tooltip-BVrTMJ0P.js";import"./useControlled-Bi-OATNn.js";import"./Collapse-C7bWlLwT.js";import"./IconButton-N0NUkcus.js";import"./CircularProgress-DgB40FHs.js";import"./Drawer-Va94Z-bg.js";import"./Avatar-5DmEzV4O.js";import"./Toolbar-N_J613MP.js";import"./Namespace-D0x1HZKq.js";const Lr={title:"GUI/Layout/Content",component:T,parameters:{layout:"fullscreen"}},E=({text:p})=>a.jsx(w,{sx:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",bgcolor:"background.default",color:"text.primary"},children:a.jsx(V,{variant:"h4",children:p})}),r=p=>a.jsx(T,{...p,children:a.jsx(E,{text:"This is the Content area"})}),e={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},i={render:r,args:{topBarConfig:{title:"Top Bar Example"}}},t={render:r,args:{leftSidebarConfig:{initialView:"expanded"},rightSidebarConfig:{initialView:"expanded"}}},o={render:r,args:{topBarConfig:{title:"Top Bar Example"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"expanded"}}},n={render:r,args:{topBarConfig:{title:"Full Layout"},leftSidebarConfig:{initialView:"rail"},rightSidebarConfig:{initialView:"rail"},footerConfig:{brandLabel:"neurons.me",position:"static",leftElements:[{type:"link",props:{label:"Docs",href:"/docs"}}],rightElements:[{type:"link",props:{label:"GitHub",href:"https://github.com/neurons-me"}}]}}};var s,m,l;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
