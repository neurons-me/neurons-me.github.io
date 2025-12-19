import{j as t}from"./iframe-iiwnc_b0.js";import{L as y}from"./Layout-Cx4ffrJV.js";import{T as r}from"./ToggleMode-754-jAwY.js";import"./preload-helper-Dp1pzeXC.js";import"./useInsets-DNZGECFo.js";import"./useGuiTheme-IlaYyKR_.js";import"./useTheme-82vFMpyT.js";import"./Box-BGrhzgmv.js";import"./Box-DtejdZ4-.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./TopBar-Bu6XvjGR.js";import"./Link-BmTR0suU.js";import"./styled-DlX4I15l.js";import"./memoTheme-B0DqKSrP.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Typography-B6hEBTBX.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-BGF-oEpj.js";import"./Menu-D5CuE4d5.js";import"./useSlot-BxCV4QU-.js";import"./useForkRef-DZCG1TVZ.js";import"./Grow-P2xsHhTI.js";import"./utils-CJx1Mhjr.js";import"./TransitionGroupContext-CnvyCsK3.js";import"./index-ChU3H_np.js";import"./index-DZAcp-XZ.js";import"./Portal-BoW-AdFV.js";import"./List-C0ueg9Tj.js";import"./Paper-DlJaJksR.js";import"./Modal-df95Y5RQ.js";import"./useEventCallback-haB0Py2x.js";import"./mergeSlotProps-By6iUkp4.js";import"./MenuItem-e8N_kz5e.js";import"./ButtonBase-BhXVLip_.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./index-LdaMAp2K.js";import"./useGuiMediaQuery-CXnuA76o.js";import"./getThemeProps-DpyMgnLr.js";import"./Avatar-DP6CKb1j.js";import"./createSvgIcon-CUb7f2wQ.js";import"./Toolbar-Dxx6mFfS.js";import"./Tooltip-9iY9lYPD.js";import"./Tooltip-BVrTMJ0P.js";import"./useControlled-Bi-OATNn.js";import"./Typography-DPqt6mxi.js";import"./Collapse-C7bWlLwT.js";import"./IconButton-N0NUkcus.js";import"./CircularProgress-DgB40FHs.js";import"./Drawer-Va94Z-bg.js";import"./Avatar-5DmEzV4O.js";import"./Toolbar-N_J613MP.js";import"./Namespace-D0x1HZKq.js";import"./Switch-C9dI3CUb.js";import"./Switch-CHcnM-eA.js";import"./useFormControl-Cuhp7ZB8.js";import"./IconButton-BgDj5M9F.js";const Ro={title:"GUI/Layout/RightSidebar",component:y,tags:["autodocs"],parameters:{docs:{description:{component:`The **RightSidebar** component mirrors the LeftSidebar experience on the opposite edge of the screen. Use it for complementary tools, contextual insights, and secondary actions without losing alignment with the primary content area.
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
