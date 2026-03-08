module.exports=[30896,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.HooksClientContext},17908,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.ServerInsertedHtml},56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},89493,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.AppRouterContext},11992,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored["react-ssr"].ReactServerDOMTurbopackClient},8492,a=>{"use strict";var b=a.i(40702),c=a.i(40859),d=a.i(34801),e=a.i(38687),f=a.i(936);function g(){let a=(0,e.useRouter)(),[g,h]=(0,c.useState)({username:"",password:""}),[i,j]=(0,c.useState)(""),[k,l]=(0,c.useState)(!1),m=async b=>{b.preventDefault(),l(!0),j("");let c=await (0,d.signIn)("credentials",{username:g.username,password:g.password,redirect:!1});c?.error?(j("Invalid username or password"),l(!1)):a.push("/")};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        .login-wrapper {
          display: flex;
          min-height: 100vh;
        }
        .login-image-panel {
          display: none;
          flex: 1;
          position: relative;
        }
        @media (min-width: 768px) {
          .login-image-panel {
            display: block;
          }
        }
        .login-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}),(0,b.jsx)("div",{className:"login-wrapper",children:(0,b.jsx)("div",{className:"auth-page login-form-panel",children:(0,b.jsxs)("div",{className:"auth-card",children:[(0,b.jsxs)("div",{className:"auth-logo",children:["Med",(0,b.jsx)("span",{children:"Appoint"})]}),(0,b.jsx)("h1",{className:"auth-title",children:"Welcome back"}),(0,b.jsx)("p",{className:"auth-sub",children:"Sign in to your account to continue"}),i&&(0,b.jsx)("div",{className:"auth-error",children:i}),(0,b.jsxs)("form",{onSubmit:m,children:[(0,b.jsxs)("div",{className:"form-group",children:[(0,b.jsx)("label",{className:"form-label",children:"Username"}),(0,b.jsx)("input",{className:"form-input",type:"text",placeholder:"Enter your username",value:g.username,onChange:a=>h(b=>({...b,username:a.target.value})),required:!0})]}),(0,b.jsxs)("div",{className:"form-group",children:[(0,b.jsx)("label",{className:"form-label",children:"Password"}),(0,b.jsx)("input",{className:"form-input",type:"password",placeholder:"Enter your password",value:g.password,onChange:a=>h(b=>({...b,password:a.target.value})),required:!0})]}),(0,b.jsx)("button",{type:"submit",className:"btn btn-primary",style:{width:"100%",justifyContent:"center",marginTop:"0.5rem"},disabled:k,children:k?"Signing in...":"Sign in"})]}),(0,b.jsxs)("div",{className:"auth-footer",children:["Don't have an account?"," ",(0,b.jsx)(f.default,{href:"/register",children:"Create patient account"})]})]})})})]})}a.s(["default",()=>g])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__41e45e22._.js.map