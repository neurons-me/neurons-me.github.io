import{j as e,r as p}from"./iframe-CQCl2_Xr.js";import{M as a}from"./Modal-gowycT4n.js";import"./preload-helper-Dp1pzeXC.js";import"./useGuiTheme-D8nhUVwr.js";import"./useTheme-CFoWJ9xD.js";import"./Box-jt3CMBRk.js";import"./Box-CDlRqcfV.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./clsx-B-dksMZM.js";import"./Typography-tm9RKfTb.js";import"./Typography-CfAGDUGj.js";import"./memoTheme-DZzxScqL.js";import"./styled-BC7qG5v0.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./IconButton-Dt8lMBpR.js";import"./IconButton-BEjmxKTj.js";import"./ButtonBase-DTqM5P7a.js";import"./TransitionGroupContext-CJMUlc1Z.js";import"./useForkRef-CPfARPCl.js";import"./useEventCallback-BrK66JZi.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BA5CoJKL.js";const S={title:"Molecules/Display/ModalBox",component:a,tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{height:"100vh",overflow:"hidden"},children:e.jsx(t,{})})],parameters:{docs:{description:{component:"\n**ModalBox** is a flexible, theme-aware modal container with optional background blur and 3D placement support via `xyz` props.\n\n---\n## Features\n- Supports background blur overlay for visual depth.\n- Centered responsive layout with dynamic width and height.\n- Declarative 3D placement via `xyz: [x, y, z]`.\n- Works with any child components (forms, dialogs, previews, etc.).\n- Compatible with GUI registry and schema resolvers.\n\n---\n## Props\n- `open`: Boolean that controls visibility.\n- `title`: Optional modal header title.\n- `onClose`: Function triggered when closing.\n- `width`, `height`: Custom modal dimensions.\n- `blurBackground`: Enables or disables background blur.\n- `xyz`: 3D position array for spatial positioning.\n- `children`: Modal content.\n        "}}}},o={render:t=>{const[r,l]=p.useState(!0);return console.log("ModalBox render",{open:r,args:t}),e.jsx("div",{style:{position:"relative",height:"100vh",background:"rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs(a,{...t,open:r,onClose:()=>l(!1),title:t.title||"Modal Title",children:[e.jsx("p",{style:{color:"#fff"},children:"This is an example modal content."}),e.jsx("p",{style:{color:"#ccc"},children:"If you see this text, the modal is visible."})]})})},args:{title:"Example Modal",blurBackground:!0,width:400,height:"auto"}};var n,i,s;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = useState(true); // force open for debugging
    console.log("ModalBox render", {
      open,
      args
    });
    return <div style={{
      position: "relative",
      height: "100vh",
      background: "rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
        <Modal {...args} open={open} onClose={() => setOpen(false)} title={args.title || "Modal Title"}>
          <p style={{
          color: "#fff"
        }}>This is an example modal content.</p>
          <p style={{
          color: "#ccc"
        }}>If you see this text, the modal is visible.</p>
        </Modal>
      </div>;
  },
  args: {
    title: "Example Modal",
    blurBackground: true,
    width: 400,
    height: "auto"
  }
}`,...(s=(i=o.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};const T=["Default"];export{o as Default,T as __namedExportsOrder,S as default};
