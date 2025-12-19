import{j as t}from"./iframe-KiNLNhLW.js";import{T as o}from"./Tooltip-ByYPonUK.js";import{B as e}from"./Button-Bmbg00c2.js";import{T as B}from"./Typography-Bdmf2Az5.js";import"./preload-helper-Dp1pzeXC.js";import"./Tooltip-BQIVULa0.js";import"./clsx-B-dksMZM.js";import"./useTheme-Bn7zDk7a.js";import"./styled-UVlhfdFb.js";import"./memoTheme-D-if7vmH.js";import"./useSlot-tUPdytIY.js";import"./useForkRef-BOoLjtmA.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./TransitionGroupContext-BCls0bdy.js";import"./useControlled-8imjW3Rp.js";import"./useEventCallback-DqsRIWNq.js";import"./Portal-ZSDT4S8w.js";import"./index-B6m42dsm.js";import"./index-CEGQiLnj.js";import"./Grow-DZ-Ocyt3.js";import"./utils-C4ueFs-M.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./isFocusVisible-B8k4qzLc.js";import"./Icon-4evKuTNV.js";import"./Button-DGo2WLXl.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-Da8SSYJ_.js";import"./CircularProgress-6CqXRv9O.js";import"./Typography-CA03AtaX.js";const tt={title:"Atoms/Content/Tooltip",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"This Tooltip is a thin wrapper around MUI's Tooltip, supporting all MUI props and the `sx` prop for styling. Use it for helpful hover information, and configure it via JSON/config declaratively."}}}},r={args:{title:"Tooltip text",placement:"top",arrow:!1,size:"md",children:t.jsx(e,{variant:"contained",children:"Hover me"})},argTypes:{title:{control:"text"},placement:{control:"select",options:["top","bottom","left","right"]},arrow:{control:"boolean"},size:{control:"select",options:["sm","md","lg"]}},render:n=>t.jsx(o,{...n,size:n.size,children:n.children})},i={name:"Placement: right",render:()=>t.jsx(o,{title:"Right placed tooltip",placement:"right",children:t.jsx(e,{variant:"contained",children:"Hover right"})}),parameters:{docs:{description:{story:'Tooltip with `placement="right"` demonstrates MUI placement support.'}}}},a={name:"Arrow",render:()=>t.jsx(o,{title:"Tooltip with arrow",arrow:!0,children:t.jsx(e,{variant:"contained",children:"Hover arrow"})}),parameters:{docs:{description:{story:"Tooltip with `arrow={true}` prop shows the arrow, just like MUI."}}}},s={name:"Wrapped Typography",render:()=>t.jsx(o,{title:"Tooltip on text",children:t.jsx(B,{variant:"body1",sx:{cursor:"pointer",display:"inline-block"},children:"Hover this text"})}),parameters:{docs:{description:{story:"Tooltip wrapping a Typography element, showing flexibility and full MUI compatibility."}}}},p={name:"With Size",render:()=>t.jsxs("div",{style:{display:"flex",gap:24},children:[t.jsx(o,{title:"Small size tooltip",size:"sm",children:t.jsx(e,{variant:"contained",children:"Small (sm)"})}),t.jsx(o,{title:"Medium size tooltip",size:"md",children:t.jsx(e,{variant:"contained",children:"Medium (md)"})}),t.jsx(o,{title:"Large size tooltip",size:"lg",children:t.jsx(e,{variant:"contained",children:"Large (lg)"})})]}),parameters:{docs:{description:{story:"Demonstrates the Tooltip with different `size` props: small, medium, and large."}}}};var l,m,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: 'Tooltip text',
    placement: 'top',
    arrow: false,
    size: 'md',
    children: <Button variant="contained">Hover me</Button>
  },
  argTypes: {
    title: {
      control: 'text'
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right']
    },
    arrow: {
      control: 'boolean'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  },
  render: args => <Tooltip {...args} size={args.size}>{args.children}</Tooltip>
}`,...(c=(m=r.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var d,h,g;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: 'Placement: right',
  render: () => <Tooltip title="Right placed tooltip" placement="right">
      <Button variant="contained">Hover right</Button>
    </Tooltip>,
  parameters: {
    docs: {
      description: {
        story: 'Tooltip with \`placement="right"\` demonstrates MUI placement support.'
      }
    }
  }
}`,...(g=(h=i.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var u,T,y;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Arrow',
  render: () => <Tooltip title="Tooltip with arrow" arrow>
      <Button variant="contained">Hover arrow</Button>
    </Tooltip>,
  parameters: {
    docs: {
      description: {
        story: 'Tooltip with \`arrow={true}\` prop shows the arrow, just like MUI.'
      }
    }
  }
}`,...(y=(T=a.parameters)==null?void 0:T.docs)==null?void 0:y.source}}};var x,w,v;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Wrapped Typography',
  render: () => <Tooltip title="Tooltip on text">
      <Typography variant="body1" sx={{
      cursor: 'pointer',
      display: 'inline-block'
    }}>
        Hover this text
      </Typography>
    </Tooltip>,
  parameters: {
    docs: {
      description: {
        story: 'Tooltip wrapping a Typography element, showing flexibility and full MUI compatibility.'
      }
    }
  }
}`,...(v=(w=s.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var z,f,j;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'With Size',
  render: () => <div style={{
    display: 'flex',
    gap: 24
  }}>
      <Tooltip title="Small size tooltip" size="sm">
        <Button variant="contained">Small (sm)</Button>
      </Tooltip>
      <Tooltip title="Medium size tooltip" size="md">
        <Button variant="contained">Medium (md)</Button>
      </Tooltip>
      <Tooltip title="Large size tooltip" size="lg">
        <Button variant="contained">Large (lg)</Button>
      </Tooltip>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the Tooltip with different \`size\` props: small, medium, and large.'
      }
    }
  }
}`,...(j=(f=p.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};const ot=["Playground","PlacementRight","WithArrow","WithTypography","WithSize"];export{i as PlacementRight,r as Playground,a as WithArrow,p as WithSize,s as WithTypography,ot as __namedExportsOrder,tt as default};
