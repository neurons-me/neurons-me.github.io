import{j as u}from"./iframe-DUXF9Jp-.js";import{L as b}from"./Layout-C4uZ4SdB.js";import{T as y}from"./ToggleMode-D_Aeog0E.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Bp9HnVyY.js";import"./useGuiTheme-B_ynI0Ih.js";import"./useTheme-DomtA3N4.js";import"./Box-D7s7YD-o.js";import"./Box-DYqOmRwG.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-wopIUzD_.js";import"./Link-DmMYqI8m.js";import"./styled-BgGs4gTW.js";import"./memoTheme-Coyt0tdw.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-Ka12HhZ4.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-XmGZ3tnN.js";import"./Menu-CoZg3wF2.js";import"./useSlot-DSfMaVyg.js";import"./useForkRef-Qo-owmNe.js";import"./Grow-CMxSDbbK.js";import"./utils-VxfzK8Uv.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-D7jnMU1Z.js";import"./index-D62vm5Fu.js";import"./index-CVXptR2h.js";import"./Portal-Ca9KwZlN.js";import"./List-D_8dNgTB.js";import"./Paper-C1YcfGe8.js";import"./Modal-BCm0Gjnj.js";import"./useEventCallback-BuWfzL-t.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-DrITHoCr.js";import"./ButtonBase-yeogBKXm.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-KsQ7UbWF.js";import"./useGuiMediaQuery-BKequ5pz.js";import"./getThemeProps-BLhFTRsa.js";import"./Avatar-CMTmL7HY.js";import"./createSvgIcon-CKqWdLB9.js";import"./Toolbar-BfpsAv1U.js";import"./Tooltip-8AwNblfO.js";import"./Tooltip-CGOmHpOF.js";import"./useControlled-BFirqgI0.js";import"./Typography-BeYWX9sC.js";import"./Collapse-DLY_qWd1.js";import"./IconButton-CkLfRy4h.js";import"./CircularProgress-mMUxHAy7.js";import"./Drawer-ibSh4-IP.js";import"./Avatar-A4lMjRb4.js";import"./Toolbar-D68zAqh_.js";import"./Namespace-tP3lJ2wJ.js";import"./Switch-DFiGx__K.js";import"./Switch-D4F0RMW2.js";import"./useFormControl-C4k7Bndl.js";import"./IconButton-BeWqQStZ.js";const ko={title:"GUI/Layout/LeftSidebar",component:b,tags:["autodocs"],parameters:{docs:{description:{component:`The **LeftSidebar** component provides the navigation rail for ResponsiveUI layouts. It keeps content aligned with other structural elements (TopBar, RightSidebar) while offering a consistent spot for primary navigation and quick actions.
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
`}}}},r=g=>u.jsx(b,{...g}),o=r.bind({});o.args={topBarConfig:{title:"My Application",elementsRight:[{type:"link",props:{label:"Profile",icon:"account_circle"}},{type:"action",props:{element:u.jsx(y,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)"}}]},leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}]}};const e=r.bind({});e.args={leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}]}};const t=r.bind({});t.args={leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"link",props:{label:"Analytics",icon:"bar_chart",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-warning)",items:[{label:"Project A",icon:"work",iconColor:"var(--gui-success)"},{label:"Project B",icon:"assignment",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Logout",icon:"logout",iconColor:"var(--gui-error)",action:"handleLogout"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-primary)"}},{type:"action",props:{label:"Help",icon:"help",iconColor:"var(--gui-success)"}}]}};var i,a,n;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:"args => <Layout {...args} />",...(n=(a=o.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var s,l,p;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:"args => <Layout {...args} />",...(p=(l=e.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var c,m,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:"args => <Layout {...args} />",...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const xo=["Default","WithoutTopBar","WithFooter"];export{o as Default,t as WithFooter,e as WithoutTopBar,xo as __namedExportsOrder,ko as default};
