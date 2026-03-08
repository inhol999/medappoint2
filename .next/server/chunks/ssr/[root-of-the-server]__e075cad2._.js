module.exports=[30896,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.HooksClientContext},17908,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.ServerInsertedHtml},56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},89493,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored.contexts.AppRouterContext},11992,(a,b,c)=>{"use strict";b.exports=a.r(70422).vendored["react-ssr"].ReactServerDOMTurbopackClient},76418,a=>{"use strict";var b=a.i(40702),c=a.i(936),d=a.i(38687),e=a.i(34801),f=a.i(40859);let g=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/admin/clinics",icon:"🏥",label:"Clinics"},{href:"/admin/users",icon:"👥",label:"Users"},{href:"/admin/doctors",icon:"🩺",label:"Doctors"},{href:"/admin/appointments",icon:"📅",label:"Appointments"},{href:"/?home=1",icon:"🏠",label:"Home"}],h=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/doctor/appointments",icon:"📅",label:"Appointments"},{href:"/doctor/schedules",icon:"🗓",label:"My Schedules"},{href:"/doctor/patients",icon:"👤",label:"My Patients"},{href:"/doctor/messages",icon:"💬",label:"Messages"},{href:"/doctor/profile",icon:"⚙️",label:"Profile"},{href:"/?home=1",icon:"🏠",label:"Home"}],i=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/patient/find",icon:"🔍",label:"Find a Clinic"},{href:"/patient/appointments",icon:"📅",label:"Appointments"},{href:"/patient/payments",icon:"💳",label:"Payments"},{href:"/patient/messages",icon:"💬",label:"Messages"},{href:"/patient/profile",icon:"⚙️",label:"Profile"},{href:"/?home=1",icon:"🏠",label:"Home"}];function j({role:a}){let j=(0,d.usePathname)(),{data:k}=(0,e.useSession)(),[l,m]=(0,f.useState)(!1),n="ADMIN"===a?g:"DOCTOR"===a?h:i,o="ADMIN"===a?"Admin Panel":"DOCTOR"===a?"Doctor Portal":"Patient Portal",p=()=>(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"sidebar-logo",children:["Med",(0,b.jsx)("span",{children:"Appoint"})]}),(0,b.jsx)("div",{style:{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:o}),(0,b.jsx)("nav",{className:"sidebar-nav",children:n.map(a=>(0,b.jsxs)(c.default,{href:a.href,className:`nav-item ${j===a.href?"active":""}`,onClick:()=>m(!1),children:[(0,b.jsx)("span",{className:"nav-icon",children:a.icon}),a.label]},a.href))}),(0,b.jsx)("div",{className:"sidebar-footer",children:(0,b.jsxs)("button",{onClick:()=>(0,e.signOut)({callbackUrl:"/login"}),className:"nav-item",style:{color:"rgba(255,255,255,0.5)",width:"100%",borderRadius:"6px"},children:[(0,b.jsx)("span",{className:"nav-icon",children:"↩"})," Sign out"]})})]});return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        .sidebar {
          width: 260px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          min-height: 100vh;
        }
        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #1e293b;
          align-items: center;
          padding: 0 1rem;
          z-index: 200;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .mobile-topbar .topbar-logo {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          flex: 1;
          text-align: center;
        }
        .mobile-topbar .topbar-logo span { color: #3b82f6; }
        .ham-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 4px;
        }
        .ham-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: white;
          border-radius: 2px;
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 300;
        }
        .mobile-sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 260px;
          height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          z-index: 400;
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          box-shadow: 4px 0 20px rgba(0,0,0,0.3);
        }
        .mobile-sidebar.open {
          transform: translateX(0);
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-topbar { display: flex; }
          .dash-content { padding-top: 72px !important; }
        }
      `}),(0,b.jsx)("aside",{className:"sidebar",children:(0,b.jsx)(p,{})}),(0,b.jsxs)("div",{className:"mobile-topbar",children:[(0,b.jsxs)("button",{className:"ham-btn",onClick:()=>m(!l),children:[(0,b.jsx)("span",{}),(0,b.jsx)("span",{}),(0,b.jsx)("span",{})]}),(0,b.jsxs)("div",{className:"topbar-logo",children:["Med",(0,b.jsx)("span",{children:"Appoint"})]}),(0,b.jsx)("div",{style:{width:30}})]}),l&&(0,b.jsx)("div",{className:"mobile-overlay",onClick:()=>m(!1)}),(0,b.jsx)("div",{className:`mobile-sidebar${l?" open":""}`,children:(0,b.jsx)(p,{})})]})}a.s(["Sidebar",()=>j])},4397,a=>{"use strict";var b=a.i(40702),c=a.i(34801),d=a.i(38687),e=a.i(40859),f=a.i(76418);function g({children:a}){let{data:g,status:h}=(0,c.useSession)(),i=(0,d.useRouter)();return((0,e.useEffect)(()=>{if("loading"!==h){if(!g)return void i.push("/login");"ADMIN"!==g.user.role&&i.push("/login")}},[g,h,i]),"loading"===h)?(0,b.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"var(--gray)"},children:"Loading..."}):g?(0,b.jsxs)("div",{className:"dash-layout",children:[(0,b.jsx)(f.Sidebar,{role:"ADMIN"}),(0,b.jsx)("div",{className:"dash-content",children:a})]}):null}a.s(["default",()=>g])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__e075cad2._.js.map