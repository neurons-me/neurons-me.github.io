import{j as e,r as b}from"./iframe-68GFPWps.js";import{M as E}from"./Menu-Cs3TNHaH.js";import{B as O}from"./Button-YZiYq-gc.js";import{M as p}from"./MenuItem-fwSAYHha.js";import"./preload-helper-Dp1pzeXC.js";import"./Menu-Bxm5Egam.js";import"./clsx-B-dksMZM.js";import"./styled-DoY_dyqs.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useSlot-YmyIgXM0.js";import"./useForkRef-BFMFwm22.js";import"./Grow-d-hf-sHY.js";import"./useTheme-TTmimgtM.js";import"./utils-C4cChdRs.js";import"./TransitionGroupContext-C-u9AC7d.js";import"./index-BACKKE6K.js";import"./index-C4J_Zf5O.js";import"./Portal-CGoG-CjS.js";import"./List-Befqb_iI.js";import"./Paper-DGyG4C8t.js";import"./memoTheme-CiN6LPoB.js";import"./Modal-D-L0DHUj.js";import"./useEventCallback-CZl20hUp.js";import"./mergeSlotProps-By6iUkp4.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-D3QPugqq.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DaFrkgtG.js";import"./listItemIconClasses-dE-O-Zks.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./dividerClasses-DS8BXQnN.js";const ae={title:"Atoms/Navigation/Menu",component:E,tags:["autodocs"],decorators:[r=>e.jsx("div",{style:{padding:16,minHeight:260},children:e.jsx(r,{})})],parameters:{docs:{description:{component:`
The **Menu** atom is a thin wrapper around MUI's \`MuiMenu\`. It supports **granular styling** via:
- \`sx\` — root popover/menu container
- \`paperSx\` — Paper slot
- \`listSx\` — MenuList slot

You can also pass \`PaperProps\` and \`MenuListProps\`; their \`sx\` are **merged** with \`paperSx\`/\`listSx\`.

---
## Basic usage
~~~jsx
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const open = Boolean(anchorEl);

<Button onClick={(e) => setAnchorEl(e.currentTarget)}>Open menu</Button>
<Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
  <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
  <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
</Menu>
~~~

## Granular styling
~~~jsx
<Menu
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}
  sx={{ mt: 1 }}
  paperSx={{ borderRadius: 10 }}
  listSx={{ py: 0.5 }}
  PaperProps={{ elevation: 3 }}
/>
~~~

## Declarative JSON / Resolver
~~~json
{
  "type": "Menu",
  "props": {
    "open": true,
    "sx": { "mt": 1 },
    "paperSx": { "borderRadius": 10 },
    "listSx": { "py": 0.5 },
    "PaperProps": { "elevation": 3 },
    "children": [
      { "type": "MenuItem", "props": { "children": "Profile" } },
      { "type": "MenuItem", "props": { "children": "Settings" } }
    ]
  }
}
~~~

*Note:* \`anchorEl\` is a runtime element reference and is typically provided by the renderer/context in declarative mode.
        `}},controls:{exclude:["anchorEl","PaperProps","MenuListProps"]}},argTypes:{open:{control:"boolean"},keepMounted:{control:"boolean"},variant:{control:{type:"radio"},options:["menu","selectedMenu"]},elevation:{control:{type:"number",min:0,max:24,step:1}},sx:{control:"object"}},args:{open:!1,keepMounted:!1,variant:"menu",elevation:1,sx:{},children:void 0}},i=r=>{const[l,c]=b.useState(null),f=!!l,C=k=>c(k.currentTarget),n=()=>c(null);return e.jsxs(e.Fragment,{children:[e.jsx(O,{variant:"outlined",onClick:C,"data-testid":"open-menu",children:"Open Menu"}),e.jsx(E,{...r,open:f,anchorEl:l,onClose:n,onClick:n,children:r.children??e.jsxs(e.Fragment,{children:[e.jsx(p,{onClick:n,children:"Profile"}),e.jsx(p,{onClick:n,children:"My account"}),e.jsx(p,{onClick:n,children:"Logout"})]})})]})},o={render:r=>e.jsx(i,{...r})},t={args:{sx:{mt:1}},render:r=>e.jsx(i,{...r,PaperProps:{elevation:2,sx:{borderRadius:2}},MenuListProps:{sx:{py:.5}}})},s={args:{keepMounted:!0},render:r=>e.jsx(i,{...r})},a={args:{sx:{mt:1},anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"}},render:r=>e.jsx(i,{...r})};var m,u,d;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => <DemoMenu {...args} />
}`,...(d=(u=o.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var h,x,g;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    sx: {
      mt: 1
    }
  },
  render: args => <DemoMenu {...args} PaperProps={{
    elevation: 2,
    sx: {
      borderRadius: 2
    }
  }} MenuListProps={{
    sx: {
      py: 0.5
    }
  }} />
}`,...(g=(x=t.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var M,P,v;s.parameters={...s.parameters,docs:{...(M=s.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    keepMounted: true
  },
  render: args => <DemoMenu {...args} />
}`,...(v=(P=s.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var S,j,y;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    sx: {
      mt: 1
    },
    // Showcase custom anchor/transform origins
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    }
  },
  render: args => <DemoMenu {...args} />
}`,...(y=(j=a.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};const ie=["Playground","WithPaperAndListSx","KeepMounted","CustomOrigins"];export{a as CustomOrigins,s as KeepMounted,o as Playground,t as WithPaperAndListSx,ie as __namedExportsOrder,ae as default};
