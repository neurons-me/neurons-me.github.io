import{j as t}from"./iframe-DUXF9Jp-.js";import{L as y}from"./Layout-C4uZ4SdB.js";import{T as r}from"./ToggleMode-D_Aeog0E.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-Bp9HnVyY.js";import"./useGuiTheme-B_ynI0Ih.js";import"./useTheme-DomtA3N4.js";import"./Box-D7s7YD-o.js";import"./Box-DYqOmRwG.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./TopBar-wopIUzD_.js";import"./Link-DmMYqI8m.js";import"./styled-BgGs4gTW.js";import"./memoTheme-Coyt0tdw.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-Ka12HhZ4.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-XmGZ3tnN.js";import"./Menu-CoZg3wF2.js";import"./useSlot-DSfMaVyg.js";import"./useForkRef-Qo-owmNe.js";import"./Grow-CMxSDbbK.js";import"./utils-VxfzK8Uv.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./TransitionGroupContext-D7jnMU1Z.js";import"./index-D62vm5Fu.js";import"./index-CVXptR2h.js";import"./Portal-Ca9KwZlN.js";import"./List-D_8dNgTB.js";import"./Paper-C1YcfGe8.js";import"./Modal-BCm0Gjnj.js";import"./useEventCallback-BuWfzL-t.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-DrITHoCr.js";import"./ButtonBase-yeogBKXm.js";import"./listItemIconClasses-B8O87iOu.js";import"./listItemTextClasses-Bvxa1hv0.js";import"./dividerClasses-DWExi19l.js";import"./index-KsQ7UbWF.js";import"./useGuiMediaQuery-BKequ5pz.js";import"./getThemeProps-BLhFTRsa.js";import"./Avatar-CMTmL7HY.js";import"./createSvgIcon-CKqWdLB9.js";import"./Toolbar-BfpsAv1U.js";import"./Tooltip-8AwNblfO.js";import"./Tooltip-CGOmHpOF.js";import"./useControlled-BFirqgI0.js";import"./Typography-BeYWX9sC.js";import"./Collapse-DLY_qWd1.js";import"./IconButton-CkLfRy4h.js";import"./CircularProgress-mMUxHAy7.js";import"./Drawer-ibSh4-IP.js";import"./Avatar-A4lMjRb4.js";import"./Toolbar-D68zAqh_.js";import"./Namespace-tP3lJ2wJ.js";import"./Switch-DFiGx__K.js";import"./Switch-D4F0RMW2.js";import"./useFormControl-C4k7Bndl.js";import"./IconButton-BeWqQStZ.js";const xo={title:"GUI/Layout/RightSidebar",component:y,tags:["autodocs"],parameters:{docs:{description:{component:`The **RightSidebar** component mirrors the LeftSidebar experience on the opposite edge of the screen. Use it for complementary tools, contextual insights, and secondary actions without losing alignment with the primary content area.
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
