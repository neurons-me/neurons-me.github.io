import{j as e}from"./iframe-DUXF9Jp-.js";import{L as c}from"./Layout-C4uZ4SdB.js";import{P as W}from"./Page-BUMVOkZI.js";import{T as F}from"./ToggleMode-D_Aeog0E.js";import{B as r}from"./Box-D7s7YD-o.js";import{T as o}from"./Typography-BeYWX9sC.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Bp9HnVyY.js";import"./useGuiTheme-B_ynI0Ih.js";import"./useTheme-DomtA3N4.js";import"./TopBar-wopIUzD_.js";import"./Link-DmMYqI8m.js";import"./clsx-B-dksMZM.js";import"./styled-BgGs4gTW.js";import"./memoTheme-Coyt0tdw.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./Typography-Ka12HhZ4.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-XmGZ3tnN.js";import"./Menu-CoZg3wF2.js";import"./useSlot-DSfMaVyg.js";import"./useForkRef-Qo-owmNe.js";import"./Grow-CMxSDbbK.js";import"./utils-VxfzK8Uv.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-D7jnMU1Z.js";import"./index-D62vm5Fu.js";import"./index-CVXptR2h.js";import"./Portal-Ca9KwZlN.js";import"./List-D_8dNgTB.js";import"./Paper-C1YcfGe8.js";import"./Modal-BCm0Gjnj.js";import"./useEventCallback-BuWfzL-t.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-DrITHoCr.js";import"./ButtonBase-yeogBKXm.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-KsQ7UbWF.js";import"./useGuiMediaQuery-BKequ5pz.js";import"./getThemeProps-BLhFTRsa.js";import"./Box-DYqOmRwG.js";import"./Avatar-CMTmL7HY.js";import"./createSvgIcon-CKqWdLB9.js";import"./Toolbar-BfpsAv1U.js";import"./Tooltip-8AwNblfO.js";import"./Tooltip-CGOmHpOF.js";import"./useControlled-BFirqgI0.js";import"./Collapse-DLY_qWd1.js";import"./IconButton-CkLfRy4h.js";import"./CircularProgress-mMUxHAy7.js";import"./Drawer-ibSh4-IP.js";import"./Avatar-A4lMjRb4.js";import"./Toolbar-D68zAqh_.js";import"./Namespace-tP3lJ2wJ.js";import"./Switch-DFiGx__K.js";import"./Switch-D4F0RMW2.js";import"./useFormControl-C4k7Bndl.js";import"./IconButton-BeWqQStZ.js";const Me={title:"GUI/Layout",component:c,tags:["autodocs"],parameters:{docs:{description:{component:`
The **Layout** component wires the responsive shell used across This.GUI demos. It coordinates the TopBar, left/right sidebars, and Footer so their insets remain in sync while your application content renders inside.
---
## Features
- **Context wiring** – wraps children with the required providers (LeftSidebar, RightSidebar) so hooks and insets work automatically.
- **Composable regions** – optional \`TopBar\`, \`LeftSideBar\`, \`RightSideBar\`, and \`Footer\` let you enable only what you need.
- **Inset aware** – whenever a sidebar expands or collapses, the layout updates theme insets so the TopBar/Footer and main content stay aligned.
- **Story-friendly** – serves as an orchestration helper in Storybook; in production you can lift the same pattern to your app shell.

---
## Declarative usage
~~~json
{
  "type": "Layout",
  "props": {
    "TopBar": {
      "title": "Workspace",
      "elementsRight": [
        {
          "type": "action",
          "props": {
            "element": "ThemeModeToggle"
          }
        }
      ]
    },
    "LeftSideBar": {
      "elements": [
        {
          "type": "link",
          "props": {
            "label": "Dashboard",
            "icon": "dashboard"
          }
        },
        {
          "type": "menu",
          "props": {
            "label": "Projects",
            "icon": "folder",
            "items": [
              {
                "label": "Project A",
                "icon": "work"
              },
              {
                "label": "Project B",
                "icon": "assignment"
              }
            ]
          }
        }
      ]
    },
    "RightSideBar": { "elements": [] },
    "Footer": {
      "brandLabel": "Neuroverse",
      "centerElements": [
        {
          "type": "link",
          "props": {
            "label": "Docs",
            "href": "/docs",
            "icon": "menu_book"
          }
        }
      ]
    }
  },
  "Content": [
    {
      "children": [
        {
          "type": "Section",
          "props": {
            "title": "Overview"
          }
        },
        {
          "type": "Card",
          "props": {
            "title": "AI Metrics"
          }
        }
      ]
    }
  ]
}
~~~

---
## React usage
Use the layout as a shell around your routes or dashboard pages. Pass config objects when you need a region; use \`false\` to omit it.
~~~tsx
function DashboardPage() {
  return (
    <Layout
      TopBar={{
        title: "Analytics",
        elementsRight: [
          { type: "action", props: { element: <ThemeModeToggle variant="minimal" /> } },
        ],
      }}
      LeftSideBar={{
        elements: [
          { type: "link", props: { label: "Overview", icon: "home" } },
          { type: "link", props: { label: "Reports", icon: "insights" } },
        ],
      }}
      RightSideBar={{
        elements: [
          { type: "link", props: { label: "Alerts", icon: "notifications" } },
        ],
      }}
    >
      <Outlet />
    </Layout>
  );
}
~~~

---
## Notes
- Props objects mirror the props of the individual components (TopBar, LeftSidebar, RightSidebar, Footer). (Legacy \`*Config\` props are still supported.)
- Set a config to \`false\` (or omit it) to exclude that region entirely.
- Children render in document order beneath any enabled sidebars/top bar – for sticky layouts remember to add padding or section containers as shown below.
`}}},argTypes:{TopBar:{control:"object"},LeftSideBar:{control:"object"},RightSideBar:{control:"object"},Footer:{control:"object"}}},a=P=>e.jsx(c,{...P,children:e.jsxs(r,{sx:{minHeight:"120vh",p:3,display:"flex",flexDirection:"column",gap:2},children:[e.jsx(o,{variant:"h5",sx:{fontWeight:700},children:"Responsive Layout Demo"}),e.jsx(o,{variant:"body2",color:"text.secondary",sx:{maxWidth:720},children:"Resize the viewport or toggle sidebars to observe how insets are coordinated. This content is intentionally tall to show how fixed bars interact with scrolling."}),e.jsxs(r,{sx:{mt:1,display:"grid",gridTemplateColumns:{xs:"1fr",sm:"repeat(2, minmax(0, 1fr))",lg:"repeat(3, minmax(0, 1fr))"},gap:2},children:[e.jsxs(r,{sx:{p:2,borderRadius:2,border:"1px solid",borderColor:"divider",bgcolor:"background.paper"},children:[e.jsx(o,{variant:"subtitle2",sx:{fontWeight:700,mb:.5},children:"Insets-aware"}),e.jsx(o,{variant:"caption",color:"text.secondary",children:"This block uses theme tokens and lets Layout/Content handle spacing."})]}),e.jsxs(r,{sx:{p:2,borderRadius:2,border:"1px solid",borderColor:"divider",bgcolor:"background.paper"},children:[e.jsx(o,{variant:"subtitle2",sx:{fontWeight:700,mb:.5},children:"Sidebar coordination"}),e.jsx(o,{variant:"caption",color:"text.secondary",children:"Expand/collapse sidebars and confirm content stays aligned."})]}),e.jsxs(r,{sx:{p:2,borderRadius:2,border:"1px solid",borderColor:"divider",bgcolor:"background.paper"},children:[e.jsx(o,{variant:"subtitle2",sx:{fontWeight:700,mb:.5},children:"Scroll behavior"}),e.jsx(o,{variant:"caption",color:"text.secondary",children:"Layout keeps the main area scrollable without manual padding hacks."})]})]}),e.jsx(r,{sx:{mt:2},children:Array.from({length:18}).map((A,d)=>e.jsxs(o,{variant:"body2",color:"text.secondary",sx:{mb:1},children:["Row ",d+1," — filler content to demonstrate scrolling within the Layout content area."]},d))})]})}),t={render:a,args:{TopBar:{title:"Neuroverse",elementsRight:[{type:"action",props:{element:e.jsx(F,{variant:"minimal",show:"icons",iconSize:"small"})}}]},LeftSideBar:!1,RightSideBar:!1,Footer:!1}},n={render:a,args:{...t.args,LeftSideBar:{elements:[{type:"link",props:{label:"Overview",icon:"dashboard"}},{type:"menu",props:{label:"Projects",icon:"folder",items:[{label:"Project Alpha",icon:"work"},{label:"Project Beta",icon:"assignment"}]}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings"}}]}}},i={render:a,args:{...n.args,RightSideBar:{elements:[{type:"link",props:{label:"Activity",icon:"history"}},{type:"action",props:{label:"Export",icon:"download"}}]}}},s={render:a,args:{...i.args,Footer:{brandLabel:"Neuroverse",brandLogo:"https://neurons.me/neurons.me.png",centerElements:[{type:"link",props:{label:"Docs",href:"/docs",icon:"menu_book",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"API",href:"/api",icon:"code",iconColor:"var(--gui-secondary)"}}],rightElements:[{type:"link",props:{label:"Community",href:"https://community.neuroverse.ai",icon:"forum",iconColor:"var(--gui-info)",external:!0}},{type:"link",props:{label:"GitHub",href:"https://github.com",icon:"code",iconColor:"var(--gui-warning)",external:!0}}],position:"fixed"}}},p={render:a,args:{TopBar:!1,LeftSideBar:!1,RightSideBar:!1,Footer:!1}},l={render:()=>e.jsx(c,{TopBar:{title:"Neuroverse Workspace"},LeftSideBar:{elements:[{type:"link",props:{label:"Home",icon:"home"}},{type:"link",props:{label:"Analytics",icon:"insights"}}]},RightSideBar:{elements:[{type:"link",props:{label:"Chat",icon:"chat"}}]},Footer:{brandLabel:"Neuroverse",centerElements:[{type:"link",props:{label:"Docs",icon:"menu_book"}}]},children:e.jsxs(W,{padding:4,children:[e.jsx(o,{variant:"h5",sx:{fontWeight:700,mb:2},children:"Page inside Layout"}),e.jsx(o,{variant:"body2",color:"text.secondary",sx:{maxWidth:720},children:"This example shows how a Page component can be used inside the responsive Layout, automatically adapting to inset updates from the TopBar, sidebars, and Footer."})]})})};var m,h,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: Template,
  args: {
    TopBar: {
      title: "Neuroverse",
      elementsRight: [{
        type: "action",
        props: {
          element: <ThemeModeToggle variant="minimal" show="icons" iconSize="small" />
        }
      }]
    },
    LeftSideBar: false,
    RightSideBar: false,
    Footer: false
  }
}`,...(g=(h=t.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var u,b,y;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopOnly.args,
    LeftSideBar: {
      elements: [{
        type: "link",
        props: {
          label: "Overview",
          icon: "dashboard"
        }
      }, {
        type: "menu",
        props: {
          label: "Projects",
          icon: "folder",
          items: [{
            label: "Project Alpha",
            icon: "work"
          }, {
            label: "Project Beta",
            icon: "assignment"
          }]
        }
      }],
      footerElements: [{
        type: "link",
        props: {
          label: "Settings",
          icon: "settings"
        }
      }]
    }
  }
}`,...(y=(b=n.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var f,x,v;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopWithLeftSidebar.args,
    RightSideBar: {
      elements: [{
        type: "link",
        props: {
          label: "Activity",
          icon: "history"
        }
      }, {
        type: "action",
        props: {
          label: "Export",
          icon: "download"
        }
      }]
    }
  }
}`,...(v=(x=i.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var T,k,S;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopWithLeftAndRight.args,
    Footer: {
      brandLabel: "Neuroverse",
      brandLogo: "https://neurons.me/neurons.me.png",
      centerElements: [{
        type: "link",
        props: {
          label: "Docs",
          href: "/docs",
          icon: "menu_book",
          iconColor: "var(--gui-primary)"
        }
      }, {
        type: "link",
        props: {
          label: "API",
          href: "/api",
          icon: "code",
          iconColor: "var(--gui-secondary)"
        }
      }],
      rightElements: [{
        type: "link",
        props: {
          label: "Community",
          href: "https://community.neuroverse.ai",
          icon: "forum",
          iconColor: "var(--gui-info)",
          external: true
        }
      }, {
        type: "link",
        props: {
          label: "GitHub",
          href: "https://github.com",
          icon: "code",
          iconColor: "var(--gui-warning)",
          external: true
        }
      }],
      position: "fixed"
    }
  }
}`,...(S=(k=s.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};var L,B,j;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: Template,
  args: {
    TopBar: false,
    LeftSideBar: false,
    RightSideBar: false,
    Footer: false
  }
}`,...(j=(B=p.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var w,R,C;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Layout TopBar={{
    title: 'Neuroverse Workspace'
  }} LeftSideBar={{
    elements: [{
      type: 'link',
      props: {
        label: 'Home',
        icon: 'home'
      }
    }, {
      type: 'link',
      props: {
        label: 'Analytics',
        icon: 'insights'
      }
    }]
  }} RightSideBar={{
    elements: [{
      type: 'link',
      props: {
        label: 'Chat',
        icon: 'chat'
      }
    }]
  }} Footer={{
    brandLabel: 'Neuroverse',
    centerElements: [{
      type: 'link',
      props: {
        label: 'Docs',
        icon: 'menu_book'
      }
    }]
  }}>
      <Page padding={4}>
        <Typography variant="h5" sx={{
        fontWeight: 700,
        mb: 2
      }}>
          Page inside Layout
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
        maxWidth: 720
      }}>
          This example shows how a Page component can be used inside the responsive Layout,
          automatically adapting to inset updates from the TopBar, sidebars, and Footer.
        </Typography>
      </Page>
    </Layout>
}`,...(C=(R=l.parameters)==null?void 0:R.docs)==null?void 0:C.source}}};const Ge=["TopOnly","TopWithLeftSidebar","TopWithLeftAndRight","FullShellWithFooter","ContentOnly","LayoutWithPage"];export{p as ContentOnly,s as FullShellWithFooter,l as LayoutWithPage,t as TopOnly,i as TopWithLeftAndRight,n as TopWithLeftSidebar,Ge as __namedExportsOrder,Me as default};
