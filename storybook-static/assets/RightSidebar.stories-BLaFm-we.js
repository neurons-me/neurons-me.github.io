import{j as t}from"./iframe-Bz6qbqcn.js";import{L as y}from"./Layout-aOtMs0E7.js";import{T as r}from"./ToggleMode-CJ2qNpDR.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-5tH0O-A9.js";import"./useGuiTheme-D-OZ20ts.js";import"./useTheme-DrhYSXVb.js";import"./Box-D4cXHuQv.js";import"./Box-FYVKJKNa.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-DCCBYH2j.js";import"./Link-Dmpp6dkQ.js";import"./styled-CAEmpYjD.js";import"./memoTheme-DJJYR_dr.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-IWzcL_9N.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-ZW5qLkPI.js";import"./Menu-Bqy9H2zD.js";import"./useSlot-Dwn8SPa8.js";import"./useForkRef-CmXmBmJ3.js";import"./Grow-C6dNtbMB.js";import"./utils-D1VEZs5m.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-SQTI9G-Y.js";import"./index-Bv9YzfcO.js";import"./index-BASnoCq0.js";import"./Portal-DlHz1GPh.js";import"./List-BGr-4Vip.js";import"./Paper-CNJ7mWPN.js";import"./Modal-DvbDZp3f.js";import"./useEventCallback-B5UFYm72.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-CbXjIjuD.js";import"./ButtonBase-BRa0l1HW.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-CxNVCHxZ.js";import"./useGuiMediaQuery-DQYl-qYI.js";import"./getThemeProps-CvC-AW8Y.js";import"./Avatar-D0e_G1kB.js";import"./createSvgIcon-BrjGhM9k.js";import"./Toolbar-DMtEt_1i.js";import"./Tooltip-wEXgCurB.js";import"./Tooltip-Csh10Ho5.js";import"./useControlled-ds2yT4Is.js";import"./Typography-DyXZB11X.js";import"./Collapse-DNtRaTsY.js";import"./IconButton-DexL0cps.js";import"./CircularProgress-7FGAifWS.js";import"./Drawer-CgM6gIJx.js";import"./Avatar-Cm6J6CJf.js";import"./Toolbar-DHxbFffF.js";import"./Namespace-CGdT183V.js";import"./Switch-CjzX34Xh.js";import"./Switch-eyLCOrsv.js";import"./useFormControl-BERcFMMy.js";import"./IconButton-BC6R5pFC.js";const xo={title:"GUI/Layout/RightSidebar",component:y,tags:["autodocs"],parameters:{docs:{description:{component:`The **RightSidebar** component mirrors the LeftSidebar experience on the opposite edge of the screen. Use it for complementary tools, contextual insights, and secondary actions without losing alignment with the primary content area.
---
## Features
- **Rail-first orientation:** Defaults to a compact 72px rail so charts or documents remain visible.
- **Expandable workspace:** Switch to a wide panel (264px) for verbose content, filters, or inspectors.
- **Mobile-friendly drawer:** On small screens it becomes a temporary drawer that slides over content from the right.
- **Footer actions:** Accepts \`footerElements\` so pinned tools (settings, help) stay reachable.
- **Inset synchronization:** Updates \`theme.layout.insets.right\` so TopBar and other surfaces adapt automatically.

---
## Layout Modes
- \`rail\`: icon-only column hugging the right edge.
- \`expanded\`: full-width tools panel with labels and nested menus.
- \`mobile\`: overlay drawer controlled by a floating button.
Modes can be toggled programmatically via \`useRightSidebar()\` or automatically through built-in breakpoints.

---
## Props
- \`elements?: RightSidebarElement[]\` — Declarative items (\`link\`, \`menu\`, \`action\`) rendered in order.
- \`footerElements?: RightSidebarElement[]\` — Optional sticky footer actions.
- \`initialView?: 'rail' | 'expanded' | 'mobile'\` — Starting mode (defaults to \`rail\`).
- \`className?\` and other DOM props are forwarded to the root \`aside\`.

---
## Declarative usage
~~~tsx
import RightSidebar from '@/gui/Layouts/ResponsiveUI/Sidebars/RightSidebar/RightSidebar';

<RightSidebar
  elements={[
    { type: 'link', props: { label: 'Notifications', icon: 'notifications' } },
    { type: 'link', props: { label: 'Activity', icon: 'history' } },
    {
      type: 'menu',
      props: {
        label: 'Views',
        icon: 'view_cozy',
        items: [
          { label: 'Timeline', icon: 'timeline' },
          { label: 'JSON', icon: 'code' },
        ],
      },
    },
  ]}
  footerElements={[
    { type: 'link', props: { label: 'Settings', icon: 'settings' } },
    { type: 'action', props: { label: 'Support', icon: 'help' } },
  ]}
/>;
~~~

---
## React usage
Combine the context provider and hook to manage the view explicitly:
~~~tsx
import { RightSidebarProvider } from '@/gui/contexts';
import { useRightSidebar } from '@/gui/hooks';
import RightSidebar from '@/gui/Layouts/ResponsiveUI/Sidebars/RightSidebar/RightSidebar';

const items = [{ type: 'link', props: { label: 'History', icon: 'history' } }];

function Inspector() {
  const { view, setView } = useRightSidebar();
  return (
    <>
      <button onClick={() => setView(view === 'expanded' ? 'rail' : 'expanded')}>
        Toggle inspector
      </button>
      <RightSidebar elements={items} />
    </>
  );
}

export function InspectorShell() {
  return (
    <RightSidebarProvider>
      <Inspector />
    </RightSidebarProvider>
  );
}
~~~

---
## Notes
- The floating toggle only appears in mobile mode; closing the drawer restores the underlying layout insets.
- Footer elements share the same declarative shape as main items, so you can reuse links or action buttons.
- Works seamlessly alongside \`LeftSidebar\` and \`TopBar\` when using the responsive Layout shell.
`}}}},a=h=>t.jsx(y,{...h}),o=a.bind({});o.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}]}};const i=a.bind({});i.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-secondary)"}},{type:"action",props:{label:"Support",icon:"help",iconColor:"var(--gui-success)"}}]}};const e=a.bind({});e.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-secondary)",items:[{label:"Project A",icon:"folder_open"},{label:"Project B",icon:"folder_open"}]}},{type:"action",props:{label:"Create",icon:"add_circle",iconColor:"var(--gui-success)"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-secondary)"}},{type:"action",props:{label:"Help",icon:"help_outline",iconColor:"var(--gui-info)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}]}};var n,s,l;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:"args => <Layout {...args} />",...(l=(s=o.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};var p,c,m;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:"args => <Layout {...args} />",...(m=(c=i.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var d,g,u;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:"args => <Layout {...args} />",...(u=(g=e.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const ko=["Default","WithFooter","WithBothSidebars"];export{o as Default,e as WithBothSidebars,i as WithFooter,ko as __namedExportsOrder,xo as default};
