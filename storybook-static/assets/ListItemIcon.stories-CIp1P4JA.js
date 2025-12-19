import{j as e,G as v}from"./iframe-iiwnc_b0.js";import{L as a,a as f}from"./ListItemText-BpgQ5YYM.js";import{L as i}from"./ListItemIcon-CAXodSmM.js";import{I as m}from"./Icon-BGF-oEpj.js";import{L as D}from"./List-C0ueg9Tj.js";import"./preload-helper-Dp1pzeXC.js";import"./clsx-B-dksMZM.js";import"./memoTheme-B0DqKSrP.js";import"./styled-DlX4I15l.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./isMuiElement-CyJ0S-CO.js";import"./useForkRef-DZCG1TVZ.js";import"./ListItemText-DOdn4Uxm.js";import"./listItemTextClasses-zE8R1Kcp.js";import"./useSlot-BxCV4QU-.js";import"./Typography-B6hEBTBX.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./listItemIconClasses-dE-O-Zks.js";const J={title:"Atoms/Organization/ListItemIcon",component:i,tags:["autodocs"],decorators:[t=>e.jsx(v,{children:e.jsx("div",{style:{padding:16,minHeight:260,maxWidth:520},children:e.jsx(t,{})})})],parameters:{docs:{description:{component:`
The **ListItemIcon** atom is a thin wrapper around MUI's \`MuiListItemIcon\` and remains faithful to its API.

In **declarative** mode, the resolver adds sugar to render icons by **token** via the registry:
- \`icon\`: string token (e.g., \`"lucide:mail"\`, \`"mui:settings"\`) or React node
- \`iconProps\`: forwarded to the registry \`<Icon />\` when \`icon\` is a token
- \`iconColor\`: convenience color for the registry icon
- \`size\`: icon size (default 20)

Tokens are **normalized** (lowercased & trimmed) to avoid missing icons due to casing.

---
## React usage
~~~jsx
<List>
  <ListItem>
    <ListItemIcon sx={{ minWidth: 36 }}>
      <Icon name="lucide:mail" size={20} />
    </ListItemIcon>
    <ListItemText primary="Inbox" />
  </ListItem>
</List>
~~~

## Declarative JSON / Resolver
~~~json
{
  "type": "ListItemIcon",
  "props": {
    "icon": "lucide:mail",
    "sx": { "minWidth": 36 },
    "iconProps": { "strokeWidth": 1.5 }
  }
}
~~~
        `}},controls:{exclude:["children"]}},argTypes:{sx:{control:"object",table:{category:"Style"}},className:{control:"text"}},args:{sx:{},children:void 0}},c=({children:t})=>e.jsx(D,{dense:!0,children:e.jsx(f,{children:t})}),s={render:t=>e.jsxs(c,{children:[e.jsx(i,{...t,children:e.jsx(m,{name:"lucide:mail"})}),e.jsx(a,{primary:"Item with icon slot"})]})},r={name:"Declarative token (doc example)",render:()=>e.jsxs(c,{children:[e.jsx(i,{sx:{minWidth:36},children:e.jsx(m,{name:"mail",fontSize:20})}),e.jsx(a,{primary:"Inbox (token)"})]})},o={render:()=>e.jsxs(c,{children:[e.jsx(i,{sx:{minWidth:40},children:e.jsx(m,{name:"mui:settings"})}),e.jsx(a,{primary:"Settings (React child)"})]})},n={render:()=>e.jsxs(c,{children:[e.jsx(i,{sx:{minWidth:48},children:e.jsx(m,{name:"lucide:user"})}),e.jsx(a,{primary:"Custom minWidth via sx"})]})};var d,l,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => <DemoList>
      <ListItemIcon {...args}>
        <Icon name="lucide:mail" />
      </ListItemIcon>
      <ListItemText primary="Item with icon slot" />
    </DemoList>
}`,...(p=(l=s.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var x,I,h;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Declarative token (doc example)',
  render: () => <DemoList>
      {/* Emula el resultado del resolver al usar icon="lucide:mail" */}
      <ListItemIcon sx={{
      minWidth: 36
    }}>
        <Icon name="mail" fontSize={20} />
      </ListItemIcon>
      <ListItemText primary="Inbox (token)" />
    </DemoList>
}`,...(h=(I=r.parameters)==null?void 0:I.docs)==null?void 0:h.source}}};var u,L,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <DemoList>
      <ListItemIcon sx={{
      minWidth: 40
    }}>
        <Icon name="mui:settings" />
      </ListItemIcon>
      <ListItemText primary="Settings (React child)" />
    </DemoList>
}`,...(g=(L=o.parameters)==null?void 0:L.docs)==null?void 0:g.source}}};var j,y,W;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <DemoList>
      <ListItemIcon sx={{
      minWidth: 48
    }}>
        <Icon name="lucide:user" />
      </ListItemIcon>
      <ListItemText primary="Custom minWidth via sx" />
    </DemoList>
}`,...(W=(y=n.parameters)==null?void 0:y.docs)==null?void 0:W.source}}};const U=["Playground","WithTokenViaResolverExample","WithReactChild","WithSx"];export{s as Playground,o as WithReactChild,n as WithSx,r as WithTokenViaResolverExample,U as __namedExportsOrder,J as default};
