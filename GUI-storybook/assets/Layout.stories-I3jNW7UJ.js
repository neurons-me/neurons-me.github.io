import{j as e}from"./iframe-68GFPWps.js";import{L as p}from"./Layout-D0wI3bda.js";import{P}from"./Page-CgMnsHZ2.js";import{T as B}from"./ToggleMode-DeuHvYTl.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Dx0mSt9x.js";import"./useGuiTheme-C0f6G4Y5.js";import"./useTheme-TTmimgtM.js";import"./Box-BxR03A4C.js";import"./Box-etGJtOmA.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./TopBar-BhxNi72-.js";import"./Link-Dh7wzCHZ.js";import"./styled-DoY_dyqs.js";import"./memoTheme-CiN6LPoB.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-CJJ14mRN.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-3O68z034.js";import"./Menu-Bxm5Egam.js";import"./useSlot-YmyIgXM0.js";import"./useForkRef-BFMFwm22.js";import"./Grow-d-hf-sHY.js";import"./utils-C4cChdRs.js";import"./TransitionGroupContext-C-u9AC7d.js";import"./index-BACKKE6K.js";import"./index-C4J_Zf5O.js";import"./Portal-CGoG-CjS.js";import"./List-Befqb_iI.js";import"./Paper-DGyG4C8t.js";import"./Modal-D-L0DHUj.js";import"./useEventCallback-CZl20hUp.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-fwSAYHha.js";import"./ButtonBase-D3QPugqq.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-C7677sQk.js";import"./useGuiMediaQuery-D61YwA29.js";import"./getThemeProps-5OSG2Lwr.js";import"./Avatar-BOKW-Th_.js";import"./createSvgIcon-BIKOTpdT.js";import"./Toolbar-DqAvjkJX.js";import"./Tooltip-BIoV7W4Q.js";import"./Tooltip-DyFZHJen.js";import"./useControlled-DAs6Mhkm.js";import"./Typography-ByVkYVok.js";import"./Collapse-DI3wRZbB.js";import"./IconButton-NLnCmtdk.js";import"./CircularProgress-DaFrkgtG.js";import"./Drawer-DZCGOd3z.js";import"./Avatar-Cspf3jJ3.js";import"./Toolbar-CBDLjL78.js";import"./Namespace-CZuqnw-M.js";import"./Switch-BzpfAagS.js";import"./Switch-Cuo-C4DR.js";import"./useFormControl-BZ8mndMR.js";import"./IconButton-B-JxKrqj.js";const Fe={title:"GUI/Layout",component:p,tags:["autodocs"],parameters:{docs:{description:{component:`
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
}`,...(L=(T=s.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};const Ne=["TopOnly","TopWithLeftSidebar","TopWithLeftAndRight","FullShellWithFooter","ContentOnly","LayoutWithPage"];export{a as ContentOnly,i as FullShellWithFooter,s as LayoutWithPage,o as TopOnly,t as TopWithLeftAndRight,n as TopWithLeftSidebar,Ne as __namedExportsOrder,Fe as default};
