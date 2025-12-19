import{j as e,aU as T}from"./iframe-68GFPWps.js";import{H as C}from"./Hero-0YPp0mqr.js";import{L}from"./Layout-D0wI3bda.js";import{P as s}from"./Page-CgMnsHZ2.js";import"./preload-helper-Dp1pzeXC.js";import"./useTheme-TTmimgtM.js";import"./Box-etGJtOmA.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./useInsets-Dx0mSt9x.js";import"./useGuiTheme-C0f6G4Y5.js";import"./Box-BxR03A4C.js";import"./TopBar-BhxNi72-.js";import"./Link-Dh7wzCHZ.js";import"./styled-DoY_dyqs.js";import"./memoTheme-CiN6LPoB.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-CJJ14mRN.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-3O68z034.js";import"./Menu-Bxm5Egam.js";import"./useSlot-YmyIgXM0.js";import"./useForkRef-BFMFwm22.js";import"./Grow-d-hf-sHY.js";import"./utils-C4cChdRs.js";import"./TransitionGroupContext-C-u9AC7d.js";import"./index-BACKKE6K.js";import"./index-C4J_Zf5O.js";import"./Portal-CGoG-CjS.js";import"./List-Befqb_iI.js";import"./Paper-DGyG4C8t.js";import"./Modal-D-L0DHUj.js";import"./useEventCallback-CZl20hUp.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-fwSAYHha.js";import"./ButtonBase-D3QPugqq.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-C7677sQk.js";import"./useGuiMediaQuery-D61YwA29.js";import"./getThemeProps-5OSG2Lwr.js";import"./Avatar-BOKW-Th_.js";import"./createSvgIcon-BIKOTpdT.js";import"./Toolbar-DqAvjkJX.js";import"./Tooltip-BIoV7W4Q.js";import"./Tooltip-DyFZHJen.js";import"./useControlled-DAs6Mhkm.js";import"./Typography-ByVkYVok.js";import"./Collapse-DI3wRZbB.js";import"./IconButton-NLnCmtdk.js";import"./CircularProgress-DaFrkgtG.js";import"./Drawer-DZCGOd3z.js";import"./Avatar-Cspf3jJ3.js";import"./Toolbar-CBDLjL78.js";import"./Namespace-CZuqnw-M.js";const He={title:"Molecules/Content/Page",component:s,tags:["autodocs"],parameters:{docs:{description:{component:`
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
}`,...(A=(k=a.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};const Ie=["Default","WithPadding","WithBackground","CustomSx","InsetsAwarePage","LayoutWithPageAndHero"];export{o as CustomSx,r as Default,n as InsetsAwarePage,a as LayoutWithPageAndHero,i as WithBackground,t as WithPadding,Ie as __namedExportsOrder,He as default};
