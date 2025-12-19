import{j as e}from"./iframe-KiNLNhLW.js";import{F as g,L as u}from"./Layout-CrndAoak.js";import{T as h}from"./ToggleMode-CkM2NdmI.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-DobJ5-u4.js";import"./useGuiTheme-_2BpWnIl.js";import"./useTheme-Bn7zDk7a.js";import"./Box-CB6b-zbZ.js";import"./Box-NAkW13Am.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-DS6KypFe.js";import"./Link-DI69n2GR.js";import"./styled-UVlhfdFb.js";import"./memoTheme-D-if7vmH.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-CA03AtaX.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-4evKuTNV.js";import"./Menu-BEoMGuCD.js";import"./useSlot-tUPdytIY.js";import"./useForkRef-BOoLjtmA.js";import"./Grow-DZ-Ocyt3.js";import"./utils-C4ueFs-M.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-BCls0bdy.js";import"./index-B6m42dsm.js";import"./index-CEGQiLnj.js";import"./Portal-ZSDT4S8w.js";import"./List-Bt6iOPKM.js";import"./Paper-B_cOjaB_.js";import"./Modal-CCf8SzOC.js";import"./useEventCallback-DqsRIWNq.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-BlZ7oZ2J.js";import"./ButtonBase-Da8SSYJ_.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-C7DxiAhw.js";import"./useGuiMediaQuery-UF8e-0c7.js";import"./getThemeProps-CufCVf0B.js";import"./Avatar-BG_1rtdu.js";import"./createSvgIcon-23mNPw71.js";import"./Toolbar-B1ODeRY3.js";import"./Tooltip-ByYPonUK.js";import"./Tooltip-BQIVULa0.js";import"./useControlled-8imjW3Rp.js";import"./Typography-Bdmf2Az5.js";import"./Collapse-DoXBNq_x.js";import"./IconButton-D_0LN41z.js";import"./CircularProgress-6CqXRv9O.js";import"./Drawer-AP0gVpI7.js";import"./Avatar-rL4I4hfr.js";import"./Toolbar-BLU6NU8-.js";import"./Namespace-CPtLEwXT.js";import"./Switch-fNSRCHUy.js";import"./Switch-B1jiIPBy.js";import"./useFormControl-CMmJCEZ9.js";import"./IconButton-Br9jIOQk.js";const xe={title:"GUI/Layout/Footer",component:g,tags:["autodocs"],parameters:{docs:{description:{component:`The **Footer** component serves as a foundational UI element that anchors actions and secondary navigation at the bottom of the viewport, while seamlessly integrating with responsive layouts and respecting insets caused by sidebars and other layout elements.

---
## Declarative Usage
You can declare the Footer directly in JSX by passing branding information and arrays of elements for the left, center, and right zones. Each element can be a link or an action, allowing flexible customization of navigation and controls.

---
## Responsive React Layout Integration
The Footer automatically adjusts its width and position based on the presence of left and right sidebars, ensuring it does not overlap with other UI components. It also adapts to different screen sizes by hiding labels on tablet and mobile views, showing only icons with tooltips for accessibility.

---
## Props Overview
- \`brandLabel\`: Text label representing the brand, used as fallback or alongside the logo.
- \`brandLogo\`: URL or path to the brand logo image.
- \`brandHref\`: Link URL for the brand element, typically the home page.
- \`leftElements\`, \`centerElements\`, \`rightElements\`: Arrays of elements defining the content for each segment of the footer. Each element is an object with a \`type\` ('link' or 'action') and \`props\` defining its properties such as label, icon, href, and event handlers.

---
## Features
- **Inset-aware:** Automatically offsets its width to accommodate left and right sidebars, avoiding overlap.
- **Responsive Design:** Collapses labels to icons only on smaller screens, maintaining usability and accessibility with tooltips.
- **Segmented Layout:** Divides the footer into three distinct zones (left, center, right) for organized content placement.
- **Flexible Positioning:** Supports \`static\`, \`fixed\`, and \`sticky\` positioning modes to suit various layout needs.
- **Customizable Styling:** Allows style overrides via \`sx\`, \`appBarSx\`, and \`sectionSx\` for fine-grained control.

---
## Layout Zones
- **Left Zone:** Typically contains branding and primary links.
- **Center Zone:** Ideal for documentation links, community resources, or other central navigation.
- **Right Zone:** Often used for actions such as theme toggles or contact buttons.

---
## Responsiveness
Below the \`md\` breakpoint, the Footer hides text labels and displays only icons, preserving space and clarity on smaller devices. Tooltips are provided to maintain accessibility despite the reduced label visibility.

---
## Integration Tips
- Combine the Footer with responsive layout shells that include TopBar and Sidebars to maintain consistent insets and layout harmony.
- Use the \`position="fixed"\` prop to create persistent footers that remain visible and update the global bottom inset dynamically.
- Leverage the segmented layout to organize navigation and actions intuitively.

---
## Example: Declarative Usage
~~~tsx
<Footer
  brandLabel="Neuroverse"
  brandLogo="/logo.svg"
  leftElements={[
    { type: 'link', props: { label: 'Changelog', icon: 'history', href: '/changelog' } },
  ]}
  centerElements={[
    { type: 'link', props: { label: 'Docs', icon: 'menu_book', href: '/docs' } },
    { type: 'link', props: { label: 'Community', icon: 'forum', href: '/community', external: true } },
  ]}
  rightElements={[
    { type: 'action', props: { label: 'Toggle Theme', icon: 'dark_mode', onClick: toggleMode } },
  ]}
/>
~~~

---
## Example: React Integration with Layout
~~~tsx
<Layout
  topBarConfig={{
    title: "Responsive Shell",
    elementsRight: [
      {
        type: "action",
        props: {
          element: <ThemeModeToggle variant="minimal" show="icons" iconSize="small" />,
        },
      },
    ],
  }}
  leftSidebarConfig={{
    elements: [
      { type: "link", props: { label: "Overview", icon: "dashboard", iconColor: "var(--gui-primary)" } },
      { type: "link", props: { label: "Reports", icon: "insights", iconColor: "var(--gui-secondary)" } },
    ],
  }}
  rightSidebarConfig={{
    elements: [
      { type: "link", props: { label: "Alerts", icon: "notifications", iconColor: "var(--gui-warning)" } },
      { type: "action", props: { label: "Export", icon: "download", iconColor: "var(--gui-success)" } },
    ],
  }}
  footerConfig={{
    title: "Neuroverse",
    logoSrc: "/logo.svg",
    links: [
      { name: "Docs", url: "/docs", icon: "menu_book" },
      { name: "API", url: "/api", icon: "code" },
    ],
    socialLinks: [
      { name: "GitHub", url: "https://github.com", icon: "code" },
      { name: "Community", url: "https://community.neuroverse.ai", icon: "forum" },
    ],
    position: "fixed",
  }} 
>
  {/* Main content goes here */}
</Layout>
~~~
`}}}},o={args:{brandLabel:"Neuroverse",brandLogo:"https://neurons.me/neurons.me.png",brandHref:"/",leftElements:[{type:"link",props:{label:"Status",icon:"monitor_heart",href:"/status",iconColor:"var(--gui-info)"}},{type:"link",props:{label:"Changelog",icon:"history",href:"/changelog",iconColor:"var(--gui-warning)"}}],centerElements:[{type:"link",props:{label:"Docs",icon:"menu_book",href:"/docs",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Community",icon:"forum",href:"https://community.neuroverse.ai",external:!0,iconColor:"var(--gui-secondary)"}}],rightElements:[{type:"action",props:{label:"Contact",icon:"support_agent",iconColor:"var(--gui-success)"}},{type:"action",props:{label:"Theme",icon:"dark_mode",iconColor:"var(--gui-primary)"}}],position:"static"}},t={args:{...o.args,position:"fixed"}},n={render:()=>e.jsx(u,{topBarConfig:{title:"Responsive Shell",elementsRight:[{type:"action",props:{element:e.jsx(h,{variant:"minimal",show:"icons",iconSize:"small"})}}]},leftSidebarConfig:{elements:[{type:"link",props:{label:"Overview",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Reports",icon:"insights",iconColor:"var(--gui-secondary)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Alerts",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"action",props:{label:"Export",icon:"download",iconColor:"var(--gui-success)"}}]},footerConfig:{title:"Neuroverse",logoSrc:"https://neurons.me/neurons.me.png",links:[{name:"Docs",url:"/docs",icon:"menu_book"},{name:"API",url:"/api",icon:"code"}],socialLinks:[{name:"GitHub",url:"https://github.com",icon:"code"},{name:"Community",url:"https://community.neuroverse.ai",icon:"forum"}],position:"fixed"},children:e.jsxs("div",{style:{minHeight:"120vh",padding:"72px 24px 120px"},children:[e.jsx("h2",{style:{marginBottom:16},children:"Dashboard Content"}),e.jsx("p",{children:"Resize the viewport to see how the TopBar, LeftSidebar, RightSidebar, and Footer coordinate their insets. The footer collapses labels below the medium breakpoint while keeping icons and tooltips."})]})})};var i,r,a;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    brandLabel: "Neuroverse",
    brandLogo: "https://neurons.me/neurons.me.png",
    brandHref: "/",
    leftElements: [{
      type: "link",
      props: {
        label: "Status",
        icon: "monitor_heart",
        href: "/status",
        iconColor: "var(--gui-info)"
      }
    }, {
      type: "link",
      props: {
        label: "Changelog",
        icon: "history",
        href: "/changelog",
        iconColor: "var(--gui-warning)"
      }
    }],
    centerElements: [{
      type: "link",
      props: {
        label: "Docs",
        icon: "menu_book",
        href: "/docs",
        iconColor: "var(--gui-primary)"
      }
    }, {
      type: "link",
      props: {
        label: "Community",
        icon: "forum",
        href: "https://community.neuroverse.ai",
        external: true,
        iconColor: "var(--gui-secondary)"
      }
    }],
    rightElements: [{
      type: "action",
      props: {
        label: "Contact",
        icon: "support_agent",
        iconColor: "var(--gui-success)"
      }
    }, {
      type: "action",
      props: {
        label: "Theme",
        icon: "dark_mode",
        iconColor: "var(--gui-primary)"
      }
    }],
    position: "static"
  }
}`,...(a=(r=o.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};var s,l,p;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    position: "fixed"
  }
}`,...(p=(l=t.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var c,m,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <Layout topBarConfig={{
    title: "Responsive Shell",
    elementsRight: [{
      type: "action",
      props: {
        element: <ThemeModeToggle variant="minimal" show="icons" iconSize="small" />
      }
    }]
  }} leftSidebarConfig={{
    elements: [{
      type: "link",
      props: {
        label: "Overview",
        icon: "dashboard",
        iconColor: "var(--gui-primary)"
      }
    }, {
      type: "link",
      props: {
        label: "Reports",
        icon: "insights",
        iconColor: "var(--gui-secondary)"
      }
    }]
  }} rightSidebarConfig={{
    elements: [{
      type: "link",
      props: {
        label: "Alerts",
        icon: "notifications",
        iconColor: "var(--gui-warning)"
      }
    }, {
      type: "action",
      props: {
        label: "Export",
        icon: "download",
        iconColor: "var(--gui-success)"
      }
    }]
  }} footerConfig={{
    title: "Neuroverse",
    logoSrc: "https://neurons.me/neurons.me.png",
    links: [{
      name: "Docs",
      url: "/docs",
      icon: "menu_book"
    }, {
      name: "API",
      url: "/api",
      icon: "code"
    }],
    socialLinks: [{
      name: "GitHub",
      url: "https://github.com",
      icon: "code"
    }, {
      name: "Community",
      url: "https://community.neuroverse.ai",
      icon: "forum"
    }],
    position: "fixed"
  } as any}>
      <div style={{
      minHeight: '120vh',
      padding: '72px 24px 120px'
    }}>
        <h2 style={{
        marginBottom: 16
      }}>Dashboard Content</h2>
        <p>
          Resize the viewport to see how the TopBar, LeftSidebar, RightSidebar, and Footer coordinate
          their insets. The footer collapses labels below the medium breakpoint while keeping icons and
          tooltips.
        </p>
      </div>
    </Layout>
}`,...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const we=["Default","FixedFooter","WithLayout"];export{o as Default,t as FixedFooter,n as WithLayout,we as __namedExportsOrder,xe as default};
