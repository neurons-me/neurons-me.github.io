import{j as u}from"./iframe-BMdLsbGP.js";import{L as b}from"./Layout-rZ8Lr3p7.js";import{T as y}from"./ToggleMode-DOiJ7wW4.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-lhMo2_5W.js";import"./useGuiTheme-DsfZtNW8.js";import"./useTheme-aNTPpZSv.js";import"./Box-BwiUMKqP.js";import"./Box-Bec9n8JJ.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-DU5s-YCC.js";import"./Link-CukGBAPN.js";import"./styled-CwHP-yMh.js";import"./memoTheme-CxLHk5CX.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-w5UW01c3.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-C6lLGBpX.js";import"./Menu-DAfm3p82.js";import"./useSlot-CpP0nEsY.js";import"./useForkRef-lLoxJEc_.js";import"./Grow-DEIb6Itz.js";import"./utils-Cyxu6Q28.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-Cm4pYcat.js";import"./index-BOMi0umn.js";import"./index-DrjS2C6K.js";import"./Portal-ZPo9y6ar.js";import"./List-DWSMUCG0.js";import"./Paper-C_boF1Ey.js";import"./Modal-kLXRYudQ.js";import"./useEventCallback-CqeiKF2X.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-Bcfx0BFC.js";import"./ButtonBase-KwaMi0-i.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-nuwg9M0T.js";import"./useGuiMediaQuery-DRR9kbtC.js";import"./getThemeProps-DXz12kgD.js";import"./Avatar-BPMcF5H7.js";import"./createSvgIcon-Dy37Ex8X.js";import"./Toolbar-C1FpRUxR.js";import"./Tooltip-B75ERNc6.js";import"./Tooltip-CUgbIPTA.js";import"./useControlled-B4babzVy.js";import"./Typography-C0bZqHwy.js";import"./Collapse-BUGpT36n.js";import"./IconButton-DtVcQN9l.js";import"./CircularProgress-CHRqGuZU.js";import"./Drawer-BlAGZfHN.js";import"./Avatar-B4McPrrE.js";import"./Toolbar-B5J37dUm.js";import"./Namespace-C7-sReZA.js";import"./Switch-DhiqRVYb.js";import"./Switch-C02EfcMk.js";import"./useFormControl-DDogkB0G.js";import"./IconButton-CNzjXMcO.js";const ko={title:"GUI/Layout/LeftSidebar",component:b,tags:["autodocs"],parameters:{docs:{description:{component:`The **LeftSidebar** component provides the navigation rail for ResponsiveUI layouts. It keeps content aligned with other structural elements (TopBar, RightSidebar) while offering a consistent spot for primary navigation and quick actions.
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
