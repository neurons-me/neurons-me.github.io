import{j as e,r as p}from"./iframe-DUXF9Jp-.js";import{M as a}from"./Modal-CAbtbDnj.js";import"./preload-helper-Dp1pzeXC.js";import"./useGuiTheme-B_ynI0Ih.js";import"./useTheme-DomtA3N4.js";import"./Box-D7s7YD-o.js";import"./Box-DYqOmRwG.js";import"./generateUtilityClasses-CoM_PQv9.js";import"./clsx-B-dksMZM.js";import"./Typography-BeYWX9sC.js";import"./Typography-Ka12HhZ4.js";import"./memoTheme-Coyt0tdw.js";import"./styled-BgGs4gTW.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./IconButton-BeWqQStZ.js";import"./IconButton-CkLfRy4h.js";import"./ButtonBase-yeogBKXm.js";import"./TransitionGroupContext-D7jnMU1Z.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./useForkRef-Qo-owmNe.js";import"./useEventCallback-BuWfzL-t.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-mMUxHAy7.js";const T={title:"Molecules/Display/ModalBox",component:a,tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{height:"100vh",overflow:"hidden"},children:e.jsx(t,{})})],parameters:{docs:{description:{component:"\n**ModalBox** is a flexible, theme-aware modal container with optional background blur and 3D placement support via `xyz` props.\n\n---\n## Features\n- Supports background blur overlay for visual depth.\n- Centered responsive layout with dynamic width and height.\n- Declarative 3D placement via `xyz: [x, y, z]`.\n- Works with any child components (forms, dialogs, previews, etc.).\n- Compatible with GUI registry and schema resolvers.\n\n---\n## Props\n- `open`: Boolean that controls visibility.\n- `title`: Optional modal header title.\n- `onClose`: Function triggered when closing.\n- `width`, `height`: Custom modal dimensions.\n- `blurBackground`: Enables or disables background blur.\n- `xyz`: 3D position array for spatial positioning.\n- `children`: Modal content.\n        "}}}},o={render:t=>{const[r,l]=p.useState(!0);return console.log("ModalBox render",{open:r,args:t}),e.jsx("div",{style:{position:"relative",height:"100vh",background:"rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs(a,{...t,open:r,onClose:()=>l(!1),title:t.title||"Modal Title",children:[e.jsx("p",{style:{color:"#fff"},children:"This is an example modal content."}),e.jsx("p",{style:{color:"#ccc"},children:"If you see this text, the modal is visible."})]})})},args:{title:"Example Modal",blurBackground:!0,width:400,height:"auto"}};var n,i,s;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(s=(i=o.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};const F=["Default"];export{o as Default,F as __namedExportsOrder,T as default};
