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
      `}),(0,b.jsx)("aside",{className:"sidebar",children:(0,b.jsx)(p,{})}),(0,b.jsxs)("div",{className:"mobile-topbar",children:[(0,b.jsxs)("button",{className:"ham-btn",onClick:()=>m(!l),children:[(0,b.jsx)("span",{}),(0,b.jsx)("span",{}),(0,b.jsx)("span",{})]}),(0,b.jsxs)("div",{className:"topbar-logo",children:["Med",(0,b.jsx)("span",{children:"Appoint"})]}),(0,b.jsx)("div",{style:{width:30}})]}),l&&(0,b.jsx)("div",{className:"mobile-overlay",onClick:()=>m(!1)}),(0,b.jsx)("div",{className:`mobile-sidebar${l?" open":""}`,children:(0,b.jsx)(p,{})})]})}a.s(["Sidebar",()=>j])},88557,a=>{"use strict";var b=a.i(40702),c=a.i(40859),d=a.i(34801),e=a.i(76418),f=a.i(936);function g(){let{data:a,status:g}=(0,d.useSession)(),[h,i]=(0,c.useState)(!1),[j,k]=(0,c.useState)([]),[l,m]=(0,c.useState)(null);if((0,c.useEffect)(()=>{if(!a)return;let b=a.user.role;"ADMIN"===b?fetch("/api/admin/stats").then(a=>a.json()).then(m):"DOCTOR"===b?fetch("/api/doctors").then(a=>a.json()).then(b=>{let c=b.find(b=>b.doctorId===a.user.profileId);c&&fetch(`/api/appointments?doctorId=${c.doctorId}`).then(a=>a.json()).then(a=>{m({todayAppointments:a.filter(a=>new Date(a.date).toDateString()===new Date().toDateString()).length,totalAppointments:a.length,patients:Array.from(new Set(a.map(a=>a.patientId))).length})})}):"PATIENT"===b&&fetch("/api/appointments").then(a=>a.json()).then(b=>{let c=b.filter(b=>b.patientId===a.user.profileId);m({upcomingAppointments:c.filter(a=>new Date(a.date)>=new Date).length,totalAppointments:c.length})})},[a]),(0,c.useEffect)(()=>{fetch("/api/clinics").then(a=>a.json()).then(k)},[]),"loading"===g)return null;if(!a)return(0,b.jsx)("p",{children:"Loading..."});let n=a.user.role;return(0,b.jsxs)("div",{className:"dash-layout",children:[(0,b.jsx)(e.Sidebar,{role:n}),(0,b.jsxs)("div",{className:"dash-content",children:[(0,b.jsxs)("div",{className:"dash-header",children:[(0,b.jsxs)("h1",{className:"dash-welcome",children:["Welcome back, ",a.user.name||"User","!"]}),(0,b.jsxs)("p",{className:"dash-subtitle",children:["ADMIN"===n&&"Manage your clinic, doctors, and appointments","DOCTOR"===n&&"View your appointments and manage your schedule","PATIENT"===n&&"Find clinics, book appointments, and manage your health"]})]}),"ADMIN"===n&&l&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Clinic Overview"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Monitor your clinic's performance and manage operations"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.totalPatients}),(0,b.jsx)("div",{className:"stat-label",children:"Total Patients"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.totalDoctors}),(0,b.jsx)("div",{className:"stat-label",children:"Doctors"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.pendingAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Pending Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.todayAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Today's Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsxs)("div",{className:"stat-value",children:["₱",l.totalRevenue]}),(0,b.jsx)("div",{className:"stat-label",children:"Total Revenue"})]})]})]}),"DOCTOR"===n&&l&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Your Practice"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Track your appointments and patient care"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.todayAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Today's Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Total Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.patients}),(0,b.jsx)("div",{className:"stat-label",children:"Patients"})]})]})]}),"PATIENT"===n&&l&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Your Health"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Manage your appointments and healthcare journey"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.upcomingAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Upcoming Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:l.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Total Appointments"})]})]})]}),(0,b.jsxs)("div",{style:{marginTop:"3rem"},children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Quick Actions"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Access the most common tasks and features"})]}),(0,b.jsx)("div",{className:"quick-links",children:"ADMIN"===n&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(f.default,{href:"/admin/doctors",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"🩺"}),(0,b.jsx)("h3",{children:"Manage Doctors"}),(0,b.jsx)("p",{children:"Add and manage doctors"})]}),(0,b.jsxs)(f.default,{href:"/admin/appointments",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"📅"}),(0,b.jsx)("h3",{children:"Appointments"}),(0,b.jsx)("p",{children:"View all appointments"})]})]})})]})]})]})}a.s(["default",()=>g])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a4527677._.js.map