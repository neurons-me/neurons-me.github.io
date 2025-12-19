import{j as u}from"./iframe-CQCl2_Xr.js";import{L as b}from"./Layout-Co-dQafu.js";import{T as y}from"./ToggleMode-DygP7wDi.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-D235S9JT.js";import"./useGuiTheme-D8nhUVwr.js";import"./useTheme-CFoWJ9xD.js";import"./Box-jt3CMBRk.js";import"./Box-CDlRqcfV.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./TopBar-BnmNpycV.js";import"./Link-m1WKLHx7.js";import"./styled-BC7qG5v0.js";import"./memoTheme-DZzxScqL.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-CfAGDUGj.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-TFLvQEA2.js";import"./Menu-Cd6ntgU3.js";import"./useSlot-B4gvAOZK.js";import"./useForkRef-CPfARPCl.js";import"./Grow-CziyXtdi.js";import"./utils-CwCYjrgE.js";import"./TransitionGroupContext-CJMUlc1Z.js";import"./index-CCYaVLB3.js";import"./index-BLIdC6U6.js";import"./Portal-BZxycvIB.js";import"./List-DyDU1RXR.js";import"./Paper-Mp04ufoQ.js";import"./Modal-jxY61_8p.js";import"./useEventCallback-BrK66JZi.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-C2-dXl7b.js";import"./ButtonBase-DTqM5P7a.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-9mP1_5yW.js";import"./useGuiMediaQuery-DgT9kqZ3.js";import"./getThemeProps-DsaQ4QQ3.js";import"./Avatar-wtx1bst6.js";import"./createSvgIcon-C7YzlW23.js";import"./Toolbar-CplQJ3GM.js";import"./Tooltip-0q30Zaok.js";import"./Tooltip-BLI9qYMt.js";import"./useControlled-D_Z70eZ9.js";import"./Typography-tm9RKfTb.js";import"./Collapse-CNLluuv2.js";import"./IconButton-BEjmxKTj.js";import"./CircularProgress-BA5CoJKL.js";import"./Drawer-DWqwyIrj.js";import"./Avatar-BQHPf1qn.js";import"./Toolbar-Di9Q66ut.js";import"./Namespace-C8c-2trX.js";import"./Switch-D-6_Uorw.js";import"./Switch-mCT1ioiA.js";import"./useFormControl-BgEx7nJH.js";import"./IconButton-Dt8lMBpR.js";const Co={title:"GUI/Layout/LeftSidebar",component:b,tags:["autodocs"],parameters:{docs:{description:{component:`The **LeftSidebar** component provides the navigation rail for ResponsiveUI layouts. It keeps content aligned with other structural elements (TopBar, RightSidebar) while offering a consistent spot for primary navigation and quick actions.
---
## Features
- **Rail-first layout:** Starts in rail view by default to maximize canvas space while keeping icons reachable.
- **Expanded navigation:** Users can switch to an expanded width for descriptive labels and nested menus.
- **Mobile overlay:** On compact viewports it becomes a temporary drawer that overlays content and releases the left inset.
- **Footer actions:** Optional \`footerElements\` allow secondary actions (e.g. settings, help) that stay pinned to the bottom.
- **Inset sync:** Updates \`theme.layout.insets.left\` so surrounding layouts and the TopBar shift automatically.

---
## Layout Variants
- \`rail\`: 72px icon rail, best for dense productivity layouts.
- \`expanded\`: 264px panel with labels and nested menu support.
- \`mobile\`: Drawer that covers the screen content and is controlled by a floating toggle button.
The sidebar transitions between these modes automatically based on breakpoints, but you can also set them manually via \`useLeftSidebar()\`.

---
## Props
- \`elements: LeftSidebarElement[]\` — Main navigation items. Supports \`link\`, \`menu\`, and \`action\` types.
- \`footerElements?: LeftSidebarElement[]\` — Optional persistent actions rendered in the footer.
- \`initialView?: 'rail' | 'expanded' | 'mobile'\` — Starting layout; defaults to \`rail\`.
- \`className?, ...rest\` — Standard layout props forwarded to the root container.

---
## Declarative usage
~~~tsx
import LeftSidebar from '@/gui/Layouts/ResponsiveUI/Sidebars/LeftSidebar/LeftSidebar';

<LeftSidebar
  initialView="rail"
  elements={[
    { type: 'link', props: { label: 'Dashboard', icon: 'dashboard' } },
    { type: 'link', props: { label: 'Analytics', icon: 'bar_chart' } },
    {
      type: 'menu',
      props: {
        label: 'Projects',
        icon: 'folder',
        items: [
          { label: 'Active', icon: 'task' },
          { label: 'Archive', icon: 'inventory_2' },
        ],
      },
    },
  ]}
  footerElements={[
    { type: 'link', props: { label: 'Settings', icon: 'settings' } },
    { type: 'action', props: { label: 'Sign out', icon: 'logout' } },
  ]}
/>;
~~~

---
## React usage
Wrap your layout with \`LeftSidebarProvider\` and consume \`useLeftSidebar()\` to control the view programmatically:
~~~tsx
import { LeftSidebarProvider } from '@/gui/contexts';
import LeftSidebar from '@/gui/Layouts/ResponsiveUI/Sidebars/LeftSidebar/LeftSidebar';
import { useLeftSidebar } from '@/gui/hooks';

const navItems = [
  { type: 'link', props: { label: 'Dashboard', icon: 'dashboard' } },
  { type: 'link', props: { label: 'Billing', icon: 'receipt_long' } },
];

function Shell() {
  const { view, setView } = useLeftSidebar();
  return (
    <>
      <button onClick={() => setView(view === 'expanded' ? 'rail' : 'expanded')}>
        Toggle mode
      </button>
      <LeftSidebar elements={navItems} />
    </>
  );
}

export function AppShell() {
  return (
    <LeftSidebarProvider>
      <Shell />
    </LeftSidebarProvider>
  );
}
~~~

---
## Notes
- Mobile mode is triggered automatically below the \`sm\` breakpoint; the floating toggle re-opens the drawer.
- The sidebar updates the global inset each time the view changes, keeping the TopBar and page content aligned.
- Combine with the \`TopBar\` story to see how the two components cooperate in responsive layouts.
`}}}},r=g=>u.jsx(b,{...g}),o=r.bind({});o.args={topBarConfig:{title:"My Application",elementsRight:[{type:"link",props:{label:"Profile",icon:"account_circle"}},{type:"action",props:{element:u.jsx(y,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)"}}]},leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}]}};const e=r.bind({});e.args={leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}]}};const t=r.bind({});t.args={leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-primary)"}},{type:"action",props:{label:"Help",icon:"help",iconColor:"var(--gui-success)"}}]}};var i,a,n;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:"args => <Layout {...args} />",...(n=(a=o.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var s,l,p;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:"args => <Layout {...args} />",...(p=(l=e.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var c,m,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:"args => <Layout {...args} />",...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const ko=["Default","WithoutTopBar","WithFooter"];export{o as Default,t as WithFooter,e as WithoutTopBar,ko as __namedExportsOrder,Co as default};
