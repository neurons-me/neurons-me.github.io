import{j as e}from"./iframe-BMdLsbGP.js";import{L as p}from"./Layout-rZ8Lr3p7.js";import{P}from"./Page-DctUVMmV.js";import{T as B}from"./ToggleMode-DOiJ7wW4.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-lhMo2_5W.js";import"./useGuiTheme-DsfZtNW8.js";import"./useTheme-aNTPpZSv.js";import"./Box-BwiUMKqP.js";import"./Box-Bec9n8JJ.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-DU5s-YCC.js";import"./Link-CukGBAPN.js";import"./styled-CwHP-yMh.js";import"./memoTheme-CxLHk5CX.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-w5UW01c3.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-C6lLGBpX.js";import"./Menu-DAfm3p82.js";import"./useSlot-CpP0nEsY.js";import"./useForkRef-lLoxJEc_.js";import"./Grow-DEIb6Itz.js";import"./utils-Cyxu6Q28.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-Cm4pYcat.js";import"./index-BOMi0umn.js";import"./index-DrjS2C6K.js";import"./Portal-ZPo9y6ar.js";import"./List-DWSMUCG0.js";import"./Paper-C_boF1Ey.js";import"./Modal-kLXRYudQ.js";import"./useEventCallback-CqeiKF2X.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-Bcfx0BFC.js";import"./ButtonBase-KwaMi0-i.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-nuwg9M0T.js";import"./useGuiMediaQuery-DRR9kbtC.js";import"./getThemeProps-DXz12kgD.js";import"./Avatar-BPMcF5H7.js";import"./createSvgIcon-Dy37Ex8X.js";import"./Toolbar-C1FpRUxR.js";import"./Tooltip-B75ERNc6.js";import"./Tooltip-CUgbIPTA.js";import"./useControlled-B4babzVy.js";import"./Typography-C0bZqHwy.js";import"./Collapse-BUGpT36n.js";import"./IconButton-DtVcQN9l.js";import"./CircularProgress-CHRqGuZU.js";import"./Drawer-BlAGZfHN.js";import"./Avatar-B4McPrrE.js";import"./Toolbar-B5J37dUm.js";import"./Namespace-C7-sReZA.js";import"./Switch-DhiqRVYb.js";import"./Switch-C02EfcMk.js";import"./useFormControl-DDogkB0G.js";import"./IconButton-CNzjXMcO.js";const Ne={title:"GUI/Layout",component:p,tags:["autodocs"],parameters:{docs:{description:{component:`
The **Layout** component wires the responsive shell used across This.GUI demos. It coordinates the TopBar, left/right sidebars, and Footer so their insets remain in sync while your application content renders inside.
---
## Features
- **Context wiring** – wraps children with the required providers (LeftSidebar, RightSidebar) so hooks and insets work automatically.
- **Composable regions** – optional \`topBarConfig\`, \`leftSidebarConfig\`, \`rightSidebarConfig\`, and \`footerConfig\` let you enable only what you need.
- **Inset aware** – whenever a sidebar expands or collapses, the layout updates theme insets so the TopBar/Footer and main content stay aligned.
- **Story-friendly** – serves as an orchestration helper in Storybook; in production you can lift the same pattern to your app shell.

---
## Declarative usage
~~~json
{
  "type": "Layout",
  "props": {
    "topBarConfig": {
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
    "leftSidebarConfig": {
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
    "footerConfig": {
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
      topBarConfig={{
        title: "Analytics",
        elementsRight: [
          { type: "action", props: { element: <ThemeModeToggle variant="minimal" /> } },
        ],
      }}
      leftSidebarConfig={{
        elements: [
          { type: "link", props: { label: "Overview", icon: "home" } },
          { type: "link", props: { label: "Reports", icon: "insights" } },
        ],
      }}
      rightSidebarConfig={{
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
- Config objects mirror the props of the individual components (TopBar, LeftSidebar, RightSidebar, Footer). Anything you can pass there can be forwarded through the layout.
- Set a config to \`false\` (or omit it) to exclude that region entirely.
- Children render in document order beneath any enabled sidebars/top bar – for sticky layouts remember to add padding or section containers as shown below.
`}}}},r=j=>e.jsx(p,{...j,children:e.jsxs("div",{style:{minHeight:"120vh",padding:"72px 24px 120px",display:"flex",flexDirection:"column",gap:16},children:[e.jsx("h2",{children:"Responsive Layout Demo"}),e.jsx("p",{children:"Resize the viewport or toggle sidebars to observe how insets are coordinated. The content block is intentionally tall to show how fixed bars interact with scrolling."})]})}),o={render:r,args:{topBarConfig:{title:"Neuroverse",elementsRight:[{type:"action",props:{element:e.jsx(B,{variant:"minimal",show:"icons",iconSize:"small"})}}]},leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},n={render:r,args:{...o.args,leftSidebarConfig:{elements:[{type:"link",props:{label:"Overview",icon:"dashboard"}},{type:"menu",props:{label:"Projects",icon:"folder",items:[{label:"Project Alpha",icon:"work"},{label:"Project Beta",icon:"assignment"}]}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings"}}]}}},t={render:r,args:{...n.args,rightSidebarConfig:{elements:[{type:"link",props:{label:"Activity",icon:"history"}},{type:"action",props:{label:"Export",icon:"download"}}]}}},i={render:r,args:{...t.args,footerConfig:{brandLabel:"Neuroverse",brandLogo:"https://neurons.me/neurons.me.png",centerElements:[{type:"link",props:{label:"Docs",href:"/docs",icon:"menu_book",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"API",href:"/api",icon:"code",iconColor:"var(--gui-secondary)"}}],rightElements:[{type:"link",props:{label:"Community",href:"https://community.neuroverse.ai",icon:"forum",iconColor:"var(--gui-info)",external:!0}},{type:"link",props:{label:"GitHub",href:"https://github.com",icon:"code",iconColor:"var(--gui-warning)",external:!0}}],position:"fixed"}}},a={render:r,args:{topBarConfig:!1,leftSidebarConfig:!1,rightSidebarConfig:!1,footerConfig:!1}},s={render:()=>e.jsx(p,{topBarConfig:{title:"Neuroverse Workspace"},leftSidebarConfig:{elements:[{type:"link",props:{label:"Home",icon:"home"}},{type:"link",props:{label:"Analytics",icon:"insights"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Chat",icon:"chat"}}]},footerConfig:{brandLabel:"Neuroverse",centerElements:[{type:"link",props:{label:"Docs",icon:"menu_book"}}]},children:e.jsxs(P,{background:"linear-gradient(135deg, #0a192f, #172a45)",padding:4,children:[e.jsx("h2",{style:{color:"white",marginBottom:16},children:"Page inside Layout"}),e.jsx("p",{style:{color:"white",maxWidth:600},children:"This example shows how a Page component can be used inside the responsive Layout, automatically adapting to inset updates from the TopBar, sidebars, and Footer."})]})})};var l,m,c;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: {
      title: "Neuroverse",
      elementsRight: [{
        type: "action",
        props: {
          element: <ThemeModeToggle variant="minimal" show="icons" iconSize="small" />
        }
      }]
    },
    leftSidebarConfig: false,
    rightSidebarConfig: false,
    footerConfig: false
  }
}`,...(c=(m=o.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var d,g,h;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopOnly.args,
    leftSidebarConfig: {
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
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,u,b;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopWithLeftSidebar.args,
    rightSidebarConfig: {
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
}`,...(b=(u=t.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var y,C,k;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: Template,
  args: {
    ...TopWithLeftAndRight.args,
    footerConfig: {
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
}`,...(k=(C=i.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var v,S,w;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: Template,
  args: {
    topBarConfig: false,
    leftSidebarConfig: false,
    rightSidebarConfig: false,
    footerConfig: false
  }
}`,...(w=(S=a.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var x,T,L;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Layout topBarConfig={{
    title: 'Neuroverse Workspace'
  }} leftSidebarConfig={{
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
  }} rightSidebarConfig={{
    elements: [{
      type: 'link',
      props: {
        label: 'Chat',
        icon: 'chat'
      }
    }]
  }} footerConfig={{
    brandLabel: 'Neuroverse',
    centerElements: [{
      type: 'link',
      props: {
        label: 'Docs',
        icon: 'menu_book'
      }
    }]
  }}>
      <Page background="linear-gradient(135deg, #0a192f, #172a45)" padding={4}>
        <h2 style={{
        color: 'white',
        marginBottom: 16
      }}>Page inside Layout</h2>
        <p style={{
        color: 'white',
        maxWidth: 600
      }}>
          This example shows how a Page component can be used inside the responsive Layout,
          automatically adapting to inset updates from the TopBar, sidebars, and Footer.
        </p>
      </Page>
    </Layout>
}`,...(L=(T=s.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};const Ie=["TopOnly","TopWithLeftSidebar","TopWithLeftAndRight","FullShellWithFooter","ContentOnly","LayoutWithPage"];export{a as ContentOnly,i as FullShellWithFooter,s as LayoutWithPage,o as TopOnly,t as TopWithLeftAndRight,n as TopWithLeftSidebar,Ie as __namedExportsOrder,Ne as default};
