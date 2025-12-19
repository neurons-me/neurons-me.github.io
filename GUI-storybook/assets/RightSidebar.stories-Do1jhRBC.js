import{j as t}from"./iframe-CQCl2_Xr.js";import{L as y}from"./Layout-Co-dQafu.js";import{T as r}from"./ToggleMode-DygP7wDi.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-D235S9JT.js";import"./useGuiTheme-D8nhUVwr.js";import"./useTheme-CFoWJ9xD.js";import"./Box-jt3CMBRk.js";import"./Box-CDlRqcfV.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./TopBar-BnmNpycV.js";import"./Link-m1WKLHx7.js";import"./styled-BC7qG5v0.js";import"./memoTheme-DZzxScqL.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-CfAGDUGj.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-TFLvQEA2.js";import"./Menu-Cd6ntgU3.js";import"./useSlot-B4gvAOZK.js";import"./useForkRef-CPfARPCl.js";import"./Grow-CziyXtdi.js";import"./utils-CwCYjrgE.js";import"./TransitionGroupContext-CJMUlc1Z.js";import"./index-CCYaVLB3.js";import"./index-BLIdC6U6.js";import"./Portal-BZxycvIB.js";import"./List-DyDU1RXR.js";import"./Paper-Mp04ufoQ.js";import"./Modal-jxY61_8p.js";import"./useEventCallback-BrK66JZi.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-C2-dXl7b.js";import"./ButtonBase-DTqM5P7a.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-9mP1_5yW.js";import"./useGuiMediaQuery-DgT9kqZ3.js";import"./getThemeProps-DsaQ4QQ3.js";import"./Avatar-wtx1bst6.js";import"./createSvgIcon-C7YzlW23.js";import"./Toolbar-CplQJ3GM.js";import"./Tooltip-0q30Zaok.js";import"./Tooltip-BLI9qYMt.js";import"./useControlled-D_Z70eZ9.js";import"./Typography-tm9RKfTb.js";import"./Collapse-CNLluuv2.js";import"./IconButton-BEjmxKTj.js";import"./CircularProgress-BA5CoJKL.js";import"./Drawer-DWqwyIrj.js";import"./Avatar-BQHPf1qn.js";import"./Toolbar-Di9Q66ut.js";import"./Namespace-C8c-2trX.js";import"./Switch-D-6_Uorw.js";import"./Switch-mCT1ioiA.js";import"./useFormControl-BgEx7nJH.js";import"./IconButton-Dt8lMBpR.js";const Ro={title:"GUI/Layout/RightSidebar",component:y,tags:["autodocs"],parameters:{docs:{description:{component:`The **RightSidebar** component mirrors the LeftSidebar experience on the opposite edge of the screen. Use it for complementary tools, contextual insights, and secondary actions without losing alignment with the primary content area.
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
`}}}},a=h=>t.jsx(y,{...h}),o=a.bind({});o.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}]}};const i=a.bind({});i.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-secondary)"}},{type:"action",props:{label:"Support",icon:"help",iconColor:"var(--gui-success)"}}]}};const e=a.bind({});e.args={topBarConfig:{title:"Analytics",elementsRight:[{type:"action",props:{element:t.jsx(r,{variant:"minimal",show:"icons",iconSize:"small"})}},{type:"action",props:{label:"Share",icon:"ios_share",iconColor:"var(--gui-primary)"}}]},leftSidebarConfig:{elements:[{type:"link",props:{label:"Dashboard",icon:"dashboard",iconColor:"var(--gui-primary)"}},{type:"menu",props:{label:"Projects",icon:"folder",iconColor:"var(--gui-secondary)",items:[{label:"Project A",icon:"folder_open"},{label:"Project B",icon:"folder_open"}]}},{type:"action",props:{label:"Create",icon:"add_circle",iconColor:"var(--gui-success)"}}],footerElements:[{type:"link",props:{label:"Settings",icon:"settings",iconColor:"var(--gui-secondary)"}},{type:"action",props:{label:"Help",icon:"help_outline",iconColor:"var(--gui-info)"}}]},rightSidebarConfig:{elements:[{type:"link",props:{label:"Notifications",icon:"notifications",iconColor:"var(--gui-warning)"}},{type:"link",props:{label:"Activity",icon:"history",iconColor:"var(--gui-secondary)"}},{type:"menu",props:{label:"Views",icon:"view_cozy",iconColor:"var(--gui-primary)",items:[{label:"Timeline",icon:"timeline",iconColor:"var(--gui-success)"},{label:"JSON",icon:"code",iconColor:"var(--gui-info)"}]}},{type:"action",props:{label:"Download",icon:"download",iconColor:"var(--gui-primary)"}}]}};var n,s,l;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:"args => <Layout {...args} />",...(l=(s=o.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};var p,c,m;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:"args => <Layout {...args} />",...(m=(c=i.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var d,g,u;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:"args => <Layout {...args} />",...(u=(g=e.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const xo=["Default","WithFooter","WithBothSidebars"];export{o as Default,e as WithBothSidebars,i as WithFooter,xo as __namedExportsOrder,Ro as default};
