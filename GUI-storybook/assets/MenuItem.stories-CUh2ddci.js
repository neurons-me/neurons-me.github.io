import{j as e,r as b}from"./iframe-CQCl2_Xr.js";import{M as f}from"./MenuItem-C2-dXl7b.js";import{M as D}from"./Menu-D6B7_jtI.js";import{I as C}from"./Icon-TFLvQEA2.js";import{B as v}from"./Button-CG-mZWvs.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./styled-BC7qG5v0.js";import"./memoTheme-DZzxScqL.js";import"./List-DyDU1RXR.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useForkRef-CPfARPCl.js";import"./ButtonBase-DTqM5P7a.js";import"./TransitionGroupContext-CJMUlc1Z.js";import"./useEventCallback-BrK66JZi.js";import"./isFocusVisible-B8k4qzLc.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";import"./Menu-Cd6ntgU3.js";import"./useSlot-B4gvAOZK.js";import"./Grow-CziyXtdi.js";import"./useTheme-CFoWJ9xD.js";import"./utils-CwCYjrgE.js";import"./index-CCYaVLB3.js";import"./index-BLIdC6U6.js";import"./Portal-BZxycvIB.js";import"./Paper-Mp04ufoQ.js";import"./Modal-jxY61_8p.js";import"./mergeSlotProps-By6iUkp4.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./CircularProgress-BA5CoJKL.js";const t=f;t.displayName="Gui.MenuItem";const oe={title:"Atoms/Navigation/MenuItem",component:t,tags:["autodocs"],decorators:[n=>e.jsx("div",{style:{padding:16,minHeight:260},children:e.jsx(n,{})})],parameters:{docs:{description:{component:`
The **MenuItem** atom is a thin wrapper around MUI's \`MuiMenuItem\`.

In **declarative** mode (registry), the resolver supports:
- \`label\` / \`secondary\` → maps to \`<ListItemText primary/secondary />\`
- \`startIcon\` → token (e.g., \`"mui:Settings"\`, \`"lucide:mail"\`) or React node → renders inside \`<ListItemIcon />\`
- Granular styling via:
  - \`sx\` (root)
  - \`iconSx\` (ListItemIcon)
  - \`textSx\` (ListItemText)

---
## Declarative JSON / Resolver
~~~json
{
  "type": "MenuItem",
  "props": {
    "startIcon": "mui:Settings",
    "label": "Settings",
    "secondary": "Manage your preferences",
    "sx": { "py": 1 },
    "iconSx": { "minWidth": 36 },
    "textSx": { "my": 0 }
  }
}
~~~
        `}},controls:{exclude:["component"]}},argTypes:{dense:{control:"boolean"},divider:{control:"boolean"},disabled:{control:"boolean"},selected:{control:"boolean"},sx:{control:"object"}},args:{dense:!1,divider:!1,disabled:!1,selected:!1,sx:{},children:"Menu item"}},a=({children:n})=>{const[m,l]=b.useState(null),j=!!m,y=S=>l(S.currentTarget),r=()=>l(null);return e.jsxs(e.Fragment,{children:[e.jsx(v,{variant:"outlined",onClick:y,"data-testid":"open-menu",children:"Open Menu"}),e.jsx(D,{open:j,anchorEl:m,onClose:r,onClick:r,children:n??e.jsxs(e.Fragment,{children:[e.jsx(t,{onClick:r,children:"Profile"}),e.jsxs(t,{onClick:r,selected:!0,dense:!0,children:[e.jsx(C,{name:"settings",weight:400,fill:0,style:{marginRight:8}}),"Settings"]}),e.jsx(t,{onClick:r,disabled:!0,children:"Disabled"})]})})]})},s={render:n=>e.jsx(a,{children:e.jsx(t,{...n})})},o={render:()=>e.jsxs(a,{children:[e.jsx(t,{children:"Default"}),e.jsx(t,{selected:!0,children:"Selected"}),e.jsx(t,{disabled:!0,children:"Disabled"}),e.jsx(t,{dense:!0,children:"Dense"})]})},i={render:()=>e.jsxs(a,{children:[e.jsx(t,{children:e.jsx("strong",{children:"Custom node as children"})}),e.jsx(t,{children:e.jsx("span",{style:{opacity:.75},children:"With inline styling"})})]})};var d,c,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => <DemoMenu>
      <MenuItem {...args} />
    </DemoMenu>
}`,...(p=(c=s.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,x,h;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <DemoMenu>
      <MenuItem>Default</MenuItem>
      <MenuItem selected>Selected</MenuItem>
      <MenuItem disabled>Disabled</MenuItem>
      <MenuItem dense>Dense</MenuItem>
    </DemoMenu>
}`,...(h=(x=o.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var M,g,I;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <DemoMenu>
      <MenuItem>
        <strong>Custom node as children</strong>
      </MenuItem>
      <MenuItem>
        <span style={{
        opacity: 0.75
      }}>With inline styling</span>
      </MenuItem>
    </DemoMenu>
}`,...(I=(g=i.parameters)==null?void 0:g.docs)==null?void 0:I.source}}};const ie=["Playground","States","WithCustomChildren"];export{s as Playground,o as States,i as WithCustomChildren,ie as __namedExportsOrder,oe as default};
