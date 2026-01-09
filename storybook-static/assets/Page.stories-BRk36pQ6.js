import{j as e,aV as T}from"./iframe-BMdLsbGP.js";import{H as C}from"./Hero-xdZu-oRP.js";import{L}from"./Layout-rZ8Lr3p7.js";import{P as s}from"./Page-DctUVMmV.js";import"./preload-helper-Dp1pzeXC.js";import"./useTheme-aNTPpZSv.js";import"./Box-Bec9n8JJ.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./useInsets-lhMo2_5W.js";import"./useGuiTheme-DsfZtNW8.js";import"./Box-BwiUMKqP.js";import"./TopBar-DU5s-YCC.js";import"./Link-CukGBAPN.js";import"./styled-CwHP-yMh.js";import"./memoTheme-CxLHk5CX.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-w5UW01c3.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-C6lLGBpX.js";import"./Menu-DAfm3p82.js";import"./useSlot-CpP0nEsY.js";import"./useForkRef-lLoxJEc_.js";import"./Grow-DEIb6Itz.js";import"./utils-Cyxu6Q28.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-Cm4pYcat.js";import"./index-BOMi0umn.js";import"./index-DrjS2C6K.js";import"./Portal-ZPo9y6ar.js";import"./List-DWSMUCG0.js";import"./Paper-C_boF1Ey.js";import"./Modal-kLXRYudQ.js";import"./useEventCallback-CqeiKF2X.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-Bcfx0BFC.js";import"./ButtonBase-KwaMi0-i.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-nuwg9M0T.js";import"./useGuiMediaQuery-DRR9kbtC.js";import"./getThemeProps-DXz12kgD.js";import"./Avatar-BPMcF5H7.js";import"./createSvgIcon-Dy37Ex8X.js";import"./Toolbar-C1FpRUxR.js";import"./Tooltip-B75ERNc6.js";import"./Tooltip-CUgbIPTA.js";import"./useControlled-B4babzVy.js";import"./Typography-C0bZqHwy.js";import"./Collapse-BUGpT36n.js";import"./IconButton-DtVcQN9l.js";import"./CircularProgress-CHRqGuZU.js";import"./Drawer-BlAGZfHN.js";import"./Avatar-B4McPrrE.js";import"./Toolbar-B5J37dUm.js";import"./Namespace-C7-sReZA.js";const Ie={title:"Molecules/Content/Page",component:s,tags:["autodocs"],parameters:{docs:{description:{component:`
**Page** is a layout container used to render content inside a layout or route.

---
## Features
- Acts as a flexible container for layout content.
- Supports padding, background color, and custom \`sx\` overrides.
- Centers and spaces content using responsive defaults.
- Works seamlessly inside \`Layout\` components.

---
## Props
- \`children\`: React nodes to render within the page.
- \`padding\`: Number or string for inner spacing.
- \`background\`: Background color or gradient.
- \`sx\`: MUI style overrides.
- \`insets\`: Optional positioning insets (top, right, bottom, left) for dynamic positioning.
        `}}}},r={args:{children:e.jsx("div",{style:{textAlign:"center",fontSize:"1.5rem",marginTop:"40vh"},children:"This is a default Page."})}},t={args:{padding:6,children:e.jsx("div",{style:{textAlign:"center",fontSize:"1.5rem"},children:"Page with custom padding (6)"})}},i={args:{background:"linear-gradient(135deg, #00bcd4, #006064)",children:e.jsx("div",{style:{color:"white",fontSize:"1.5rem",textAlign:"center",marginTop:"40vh"},children:"Page with gradient background"})}},o={args:{sx:{border:"2px dashed #29b6f6",borderRadius:"16px",backgroundColor:"#e3f2fd"},children:e.jsx("div",{style:{textAlign:"center",fontSize:"1.5rem",marginTop:"40vh"},children:"Page with custom sx styles"})}},n={render:j=>e.jsx(T,{children:e.jsx(s,{...j,children:e.jsx("div",{style:{textAlign:"center",fontSize:"1.5rem",marginTop:"40vh"},children:"Page with padding that adapts to layout insets."})})}),args:{background:"rgba(0, 188, 212, 0.15)",padding:24,insetsAware:!0}},a={render:()=>e.jsx(T,{children:e.jsx(L,{topBarConfig:{title:"Neuroverse Layout"},leftSidebarConfig:{initialView:"menu"},rightSidebarConfig:{initialView:"chat"},children:e.jsx(s,{background:"linear-gradient(135deg, #0a192f, #172a45)",padding:4,children:e.jsx(C,{backgroundSrc:"https://images.unsplash.com/photo-1522202195463-8f34a5fa1d15",backgroundType:"image",overlayColor:"rgba(10, 25, 47, 0.6)",blur:"light",children:e.jsx("div",{style:{color:"white",fontSize:"2rem",fontWeight:600,textAlign:"center",marginTop:"40vh"},children:"Layout with TopBar, LeftSidebar and a HeroSection inside Page"})})})})})};var d,p,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      textAlign: 'center',
      fontSize: '1.5rem',
      marginTop: '40vh'
    }}>
        This is a default Page.
      </div>
  }
}`,...(g=(p=r.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var c,m,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    padding: 6,
    children: <div style={{
      textAlign: 'center',
      fontSize: '1.5rem'
    }}>
        Page with custom padding (6)
      </div>
  }
}`,...(l=(m=t.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var u,h,f;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    background: 'linear-gradient(135deg, #00bcd4, #006064)',
    children: <div style={{
      color: 'white',
      fontSize: '1.5rem',
      textAlign: 'center',
      marginTop: '40vh'
    }}>
        Page with gradient background
      </div>
  }
}`,...(f=(h=i.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var x,v,b;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    sx: {
      border: '2px dashed #29b6f6',
      borderRadius: '16px',
      backgroundColor: '#e3f2fd'
    },
    children: <div style={{
      textAlign: 'center',
      fontSize: '1.5rem',
      marginTop: '40vh'
    }}>
        Page with custom sx styles
      </div>
  }
}`,...(b=(v=o.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var y,P,S;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <InsetsProvider>
      <Page {...args}>
        <div style={{
        textAlign: 'center',
        fontSize: '1.5rem',
        marginTop: '40vh'
      }}>
          Page with padding that adapts to layout insets.
        </div>
      </Page>
    </InsetsProvider>,
  args: {
    background: "rgba(0, 188, 212, 0.15)",
    padding: 24,
    insetsAware: true
  }
}`,...(S=(P=n.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var w,k,A;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <InsetsProvider>
      <Layout topBarConfig={{
      title: 'Neuroverse Layout'
    }} leftSidebarConfig={{
      initialView: 'menu'
    }} rightSidebarConfig={{
      initialView: 'chat'
    }}>
        <Page background="linear-gradient(135deg, #0a192f, #172a45)" padding={4}>
          <Hero backgroundSrc="https://images.unsplash.com/photo-1522202195463-8f34a5fa1d15" backgroundType="image" overlayColor="rgba(10, 25, 47, 0.6)" blur="light">
            <div style={{
            color: 'white',
            fontSize: '2rem',
            fontWeight: 600,
            textAlign: 'center',
            marginTop: '40vh'
          }}>
              Layout with TopBar, LeftSidebar and a HeroSection inside Page
            </div>
          </Hero>
        </Page>
      </Layout>
    </InsetsProvider>
}`,...(A=(k=a.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};const Be=["Default","WithPadding","WithBackground","CustomSx","InsetsAwarePage","LayoutWithPageAndHero"];export{o as CustomSx,r as Default,n as InsetsAwarePage,a as LayoutWithPageAndHero,i as WithBackground,t as WithPadding,Be as __namedExportsOrder,Ie as default};
