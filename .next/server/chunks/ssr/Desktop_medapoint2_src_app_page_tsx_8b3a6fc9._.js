module.exports=[68404,a=>{"use strict";var b=a.i(40702),c=a.i(40859),d=a.i(34801),e=a.i(936),f=a.i(76418);function g(){let{data:a,status:g}=(0,d.useSession)(),[h,i]=(0,c.useState)(!1),[j,k]=(0,c.useState)(!1),[l,m]=(0,c.useState)(""),[n,o]=(0,c.useState)("patient"),[p,q]=(0,c.useState)([]),[r,s]=(0,c.useState)(null);(0,c.useEffect)(()=>{fetch("/api/clinics").then(a=>a.json()).then(q)},[]),(0,c.useEffect)(()=>{let a=()=>i(window.scrollY>10);return window.addEventListener("scroll",a),()=>window.removeEventListener("scroll",a)},[]);let t=p.filter(a=>!l||a.clinicName.toLowerCase().includes(l.toLowerCase())||a.location.toLowerCase().includes(l.toLowerCase()));if("loading"===g)return null;if(a){let c=a.user.role;return(0,b.jsxs)("div",{className:"dash-layout",children:[(0,b.jsx)(f.Sidebar,{role:c}),(0,b.jsxs)("div",{className:"dash-content",children:[(0,b.jsxs)("div",{className:"dash-header",children:[(0,b.jsxs)("h1",{className:"dash-welcome",children:["Welcome back, ",a.user.name||"User","!"]}),(0,b.jsxs)("p",{className:"dash-subtitle",children:["ADMIN"===c&&"Manage your clinic, doctors, and appointments","DOCTOR"===c&&"View your appointments and manage your schedule","PATIENT"===c&&"Find clinics, book appointments, and manage your health"]})]}),"ADMIN"===c&&r&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Clinic Overview"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Monitor your clinic's performance and manage operations"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.totalPatients}),(0,b.jsx)("div",{className:"stat-label",children:"Total Patients"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.totalDoctors}),(0,b.jsx)("div",{className:"stat-label",children:"Doctors"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.pendingAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Pending Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.todayAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Today's Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsxs)("div",{className:"stat-value",children:["₱",r.totalRevenue]}),(0,b.jsx)("div",{className:"stat-label",children:"Total Revenue"})]})]})]}),"DOCTOR"===c&&r&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Your Practice"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Track your appointments and patient care"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.todayAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Today's Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Total Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.patients}),(0,b.jsx)("div",{className:"stat-label",children:"Patients"})]})]})]}),"PATIENT"===c&&r&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Your Health"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Manage your appointments and healthcare journey"})]}),(0,b.jsxs)("div",{className:"stats-grid",children:[(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.upcomingAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Upcoming Appointments"})]}),(0,b.jsxs)("div",{className:"stat-card",children:[(0,b.jsx)("div",{className:"stat-value",children:r.totalAppointments}),(0,b.jsx)("div",{className:"stat-label",children:"Total Appointments"})]})]})]}),(0,b.jsxs)("div",{style:{marginTop:"3rem"},children:[(0,b.jsxs)("div",{style:{marginBottom:"1.5rem"},children:[(0,b.jsx)("h2",{style:{fontSize:"1.4rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.5rem"},children:"Quick Actions"}),(0,b.jsx)("p",{style:{color:"#64748b",fontSize:"0.95rem"},children:"Access the most common tasks and features"})]}),(0,b.jsxs)("div",{className:"quick-links",children:["ADMIN"===c&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(e.default,{href:"/admin/users",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"👥"}),(0,b.jsx)("h3",{children:"Manage Users"}),(0,b.jsx)("p",{children:"View and manage clinic users"})]}),(0,b.jsxs)(e.default,{href:"/admin/doctors",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"🩺"}),(0,b.jsx)("h3",{children:"Manage Doctors"}),(0,b.jsx)("p",{children:"Add and manage doctors"})]}),(0,b.jsxs)(e.default,{href:"/admin/appointments",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"📅"}),(0,b.jsx)("h3",{children:"Appointments"}),(0,b.jsx)("p",{children:"View all appointments"})]})]}),"DOCTOR"===c&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(e.default,{href:"/doctor/appointments",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"📅"}),(0,b.jsx)("h3",{children:"My Appointments"}),(0,b.jsx)("p",{children:"View and manage appointments"})]}),(0,b.jsxs)(e.default,{href:"/doctor/schedules",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"🗓"}),(0,b.jsx)("h3",{children:"My Schedules"}),(0,b.jsx)("p",{children:"Manage availability"})]}),(0,b.jsxs)(e.default,{href:"/doctor/patients",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"👤"}),(0,b.jsx)("h3",{children:"My Patients"}),(0,b.jsx)("p",{children:"View patient records"})]})]}),"PATIENT"===c&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(e.default,{href:"/patient/find",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"🔍"}),(0,b.jsx)("h3",{children:"Find a Clinic"}),(0,b.jsx)("p",{children:"Search and book appointments"})]}),(0,b.jsxs)(e.default,{href:"/patient/appointments",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"📅"}),(0,b.jsx)("h3",{children:"My Appointments"}),(0,b.jsx)("p",{children:"View upcoming appointments"})]}),(0,b.jsxs)(e.default,{href:"/patient/payments",className:"quick-link",children:[(0,b.jsx)("div",{className:"icon",children:"💳"}),(0,b.jsx)("h3",{children:"Payments"}),(0,b.jsx)("p",{children:"View payment history"})]})]})]})]})]})]})}return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --black: #111111; --gray: #6b7280; --gray2: #9ca3af; --line: #e5e7eb; --bg: #ffffff; --blue: #2563eb; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--black); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 60px; background: white; border-bottom: 1px solid transparent; display: flex; align-items: center; padding: 0 5%; justify-content: space-between; transition: border-color 0.3s; }
        nav.scrolled { border-bottom-color: var(--line); }
        .logo { font-size: 1.05rem; font-weight: 600; color: var(--black); text-decoration: none; letter-spacing: -0.02em; }
        .logo span { color: var(--blue); }
        .nav-center { display: flex; gap: 2.5rem; list-style: none; position: absolute; left: 50%; transform: translateX(-50%); }
        .nav-center a { font-size: 0.875rem; font-weight: 400; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .nav-center a:hover { color: var(--black); }
        .nav-right { display: flex; gap: 0.75rem; align-items: center; }
        .nav-signin { font-size: 0.875rem; font-weight: 400; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .nav-signin:hover { color: var(--black); }
        .nav-join { font-size: 0.875rem; font-weight: 500; padding: 0.45rem 1.1rem; background: var(--black); color: white; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; transition: opacity 0.2s; }
        .nav-join:hover { opacity: 0.75; }
        .ham { display: none; flex-direction: column; gap: 4px; cursor: pointer; background: none; border: none; }
        .ham span { width: 20px; height: 1.5px; background: var(--black); display: block; }
        .mob-menu { position: fixed; top: 60px; left: 0; right: 0; z-index: 99; background: white; border-bottom: 1px solid var(--line); padding: 1.5rem 5%; display: flex; flex-direction: column; gap: 1rem; transform: translateY(-110%); transition: transform 0.28s ease; }
        .mob-menu.open { transform: translateY(0); }
        .mob-menu a { font-size: 0.95rem; color: var(--black); text-decoration: none; }

        .hero { padding: 140px 5% 80px; max-width: 860px; margin: 0 auto; text-align: center; }
        .hero-eyebrow { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.5rem; opacity: 0; animation: up 0.5s 0.1s ease forwards; }
        .hero h1 { font-size: clamp(2.6rem, 6vw, 4.5rem); font-weight: 300; line-height: 1.1; letter-spacing: -0.04em; color: var(--black); margin-bottom: 1.25rem; opacity: 0; animation: up 0.55s 0.18s ease forwards; }
        .hero h1 strong { font-weight: 600; }
        .hero h1 em { font-style: italic; font-weight: 300; color: var(--blue); }
        .hero p { font-size: 1rem; color: var(--gray); line-height: 1.7; max-width: 460px; margin: 0 auto 3rem; font-weight: 400; opacity: 0; animation: up 0.55s 0.26s ease forwards; }
        @keyframes up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .search-box { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 480px; margin: 0 auto 1rem; transition: border-color 0.2s, box-shadow 0.2s; opacity: 0; animation: up 0.55s 0.32s ease forwards; background: white; }
        .search-box:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .search-box input { flex: 1; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--black); padding: 0.85rem 1rem; background: transparent; }
        .search-box input::placeholder { color: var(--gray2); }
        .search-box button { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.65rem 1.2rem; margin: 0.25rem; background: var(--black); color: white; border: none; border-radius: 5px; cursor: pointer; transition: opacity 0.2s; }
        .search-box button:hover { opacity: 0.75; }
        .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; opacity: 0; animation: up 0.5s 0.38s ease forwards; margin-bottom: 5rem; }
        .tag { font-size: 0.78rem; font-weight: 400; color: var(--gray); border: 1px solid var(--line); border-radius: 100px; padding: 0.25rem 0.8rem; cursor: pointer; transition: all 0.18s; background: white; }
        .tag:hover { border-color: var(--blue); color: var(--blue); }

        .clinic-section { padding: 0 5% 6rem; }
        .section-label { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray2); margin-bottom: 1.25rem; text-align: center; }
        .clinic-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 860px; margin: 0 auto; }
        .clinic-item { padding: 1.5rem; background: white; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); transition: background 0.15s; cursor: pointer; }
        .clinic-item:nth-child(3n) { border-right: none; }
        .clinic-item:nth-last-child(-n+3) { border-bottom: none; }
        .clinic-item:hover { background: #fafafa; }
        .ci-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; }
        .ci-name { font-size: 0.9rem; font-weight: 500; line-height: 1.35; }
        .ci-rating { font-size: 0.75rem; color: var(--gray2); white-space: nowrap; margin-left: 0.5rem; }
        .ci-rating b { color: var(--black); font-weight: 600; }
        .ci-loc { font-size: 0.78rem; color: var(--gray2); margin-bottom: 0.65rem; }
        .ci-spec { font-size: 0.75rem; font-weight: 500; color: var(--blue); }
        .no-results { grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray); font-size: 0.875rem; }
        .view-all { display: block; text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--blue); text-decoration: none; font-weight: 500; }
        .view-all:hover { text-decoration: underline; }
        .features-section { padding: 5rem 5%; border-top: 1px solid var(--line); }
        .features-inner { max-width: 1200px; margin: 0 auto; text-align: center; }
        .features-section h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; margin-bottom: 3rem; line-height: 1.2; }
        .features-section h2 strong { font-weight: 600; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .feature-card { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 2rem; text-align: center; transition: all 0.2s; }
        .feature-card:hover { border-color: var(--blue); box-shadow: 0 4px 20px rgba(37,99,235,0.1); transform: translateY(-2px); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--black); }
        .feature-card p { font-size: 0.9rem; color: var(--gray); line-height: 1.6; }
        .how-header { margin-bottom: 3rem; }
        .how-header h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; line-height: 1.2; }
        .how-header h2 strong { font-weight: 600; }
        .steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; }
        .step-n { font-size: 0.72rem; font-weight: 500; color: var(--gray2); letter-spacing: 0.08em; margin-bottom: 1.25rem; }
        .step-title { font-size: 0.95rem; font-weight: 500; margin-bottom: 0.4rem; }
        .step-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.6; font-weight: 400; }

        .who { padding: 5rem 5%; border-top: 1px solid var(--line); }
        .who-inner { max-width: 860px; margin: 0 auto; }
        .who-header h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; line-height: 1.2; }
        .who-header h2 strong { font-weight: 600; }
        .who-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 3rem; }
        .who-tab { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 400; padding: 0.7rem 1.4rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--gray); transition: all 0.2s; margin-bottom: -1px; }
        .who-tab.active { color: var(--black); border-bottom-color: var(--black); font-weight: 500; }
        .who-body { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .who-points { display: flex; flex-direction: column; gap: 1.5rem; }
        .wp { display: flex; gap: 1rem; }
        .wp-num { font-size: 0.72rem; color: var(--gray2); font-weight: 500; padding-top: 0.15rem; flex-shrink: 0; width: 20px; }
        .wp-title { font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .wp-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.6; }
        .who-cta-wrap { display: flex; flex-direction: column; gap: 0.85rem; padding-top: 0.25rem; }
        .who-cta-wrap h3 { font-size: 1.3rem; font-weight: 300; letter-spacing: -0.02em; line-height: 1.35; }
        .who-cta-wrap h3 strong { font-weight: 600; }
        .who-cta-wrap p { font-size: 0.875rem; color: var(--gray); line-height: 1.7; }
        .btn-dark { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.6rem 1.4rem; background: var(--black); color: white; border-radius: 6px; text-decoration: none; transition: opacity 0.2s; width: fit-content; margin-top: 0.5rem; }
        .btn-dark:hover { opacity: 0.75; }

        .cta-section { padding: 6rem 5%; border-top: 1px solid var(--line); text-align: center; }
        .cta-section h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 300; letter-spacing: -0.04em; margin-bottom: 1rem; line-height: 1.1; }
        .cta-section h2 strong { font-weight: 600; }
        .cta-section h2 em { font-style: italic; color: var(--blue); }
        .cta-section p { font-size: 0.95rem; color: var(--gray); max-width: 380px; margin: 0 auto 2.25rem; line-height: 1.7; }
        .cta-btns { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
        .btn-blue { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.65rem 1.5rem; background: var(--blue); color: white; border-radius: 6px; text-decoration: none; transition: opacity 0.2s; }
        .btn-blue:hover { opacity: 0.85; }
        .btn-line { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 400; padding: 0.65rem 1.5rem; background: white; color: var(--black); border: 1px solid var(--line); border-radius: 6px; text-decoration: none; transition: border-color 0.2s; }
        .btn-line:hover { border-color: #9ca3af; }

        .role-row { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; max-width: 640px; margin: 3.5rem auto 0; }
        .role-item { padding: 1.5rem; background: white; border-right: 1px solid var(--line); text-align: left; }
        .role-item:last-child { border-right: none; }
        .role-emoji { font-size: 1.1rem; margin-bottom: 0.65rem; display: block; }
        .role-item h4 { font-size: 0.875rem; font-weight: 500; margin-bottom: 0.3rem; }
        .role-item p { font-size: 0.78rem; color: var(--gray); line-height: 1.55; margin-bottom: 0.65rem; }
        .role-link { font-size: 0.78rem; color: var(--blue); text-decoration: none; font-weight: 500; }
        .stats-section { padding: 4rem 5%; background: var(--blue-light); }
        .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
        .stat-item .stat-number { font-size: 2.5rem; font-weight: 700; color: var(--blue); margin-bottom: 0.5rem; }
        .stat-item .stat-label { font-size: 1rem; color: var(--gray); font-weight: 500; }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; text-align: center; }
        .testimonials-section h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 300; letter-spacing: -0.03em; margin-top: 0.5rem; margin-bottom: 3rem; line-height: 1.2; }
        .testimonials-section h2 strong { font-weight: 600; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .testimonial-card { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 2rem; text-align: left; }
        .testimonial-stars { color: #fbbf24; margin-bottom: 1rem; }
        .testimonial-card p { font-size: 0.95rem; color: var(--gray); line-height: 1.6; margin-bottom: 1.5rem; font-style: italic; }
        .testimonial-author { display: flex; justify-content: space-between; align-items: center; }
        .author-name { font-weight: 600; color: var(--black); }
        .author-role { font-size: 0.85rem; color: var(--gray); }
        .footer-brand { font-size: 0.9rem; font-weight: 600; color: var(--black); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { font-size: 0.78rem; color: var(--gray2); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--black); }
        .footer-copy { font-size: 0.75rem; color: var(--gray2); }

        @media(max-width:768px) {
          .nav-center, .nav-right { display: none; }
          .ham { display: flex; }
          .clinic-grid { grid-template-columns: 1fr 1fr; }
          .steps { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .who-body { grid-template-columns: 1fr; gap: 2rem; }
          .role-row { grid-template-columns: 1fr; }
          .role-item { border-right: none; border-bottom: 1px solid var(--line); }
          .role-item:last-child { border-bottom: none; }
          footer { flex-direction: column; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
        @media(max-width:480px) {
          .clinic-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; }
        }

        /* Dashboard Styles */
        .dash-layout { display: flex; min-height: 100vh; background: #f8fafc; }
        .sidebar { width: 280px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 1.5rem 0; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.1); }
        .sidebar-logo { font-size: 1.25rem; font-weight: 600; padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-logo span { color: #3b82f6; }
        .sidebar-nav { flex: 1; padding: 1rem 0; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; transition: all 0.2s; border-radius: 6px; margin: 0 0.5rem; }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: rgba(59,130,246,0.2); color: white; }
        .nav-icon { font-size: 1.1rem; }
        .sidebar-footer { padding: 1rem 0.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .dash-content { flex: 1; padding: 2rem; background: #f8fafc; }
        .dash-header { margin-bottom: 2rem; }
        .dash-welcome { font-size: 1.8rem; font-weight: 300; color: #1e293b; margin-bottom: 0.5rem; }
        .dash-subtitle { font-size: 0.95rem; color: #64748b; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .quick-link { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; transition: all 0.2s; text-decoration: none; color: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .quick-link:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .quick-link .icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .quick-link h3 { font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 600; color: #1e293b; }
        .quick-link p { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
      `}),(0,b.jsxs)("nav",{className:h?"scrolled":"",children:[(0,b.jsxs)(e.default,{href:"/",className:"logo",children:["Med",(0,b.jsx)("span",{children:"Appoint"})]}),(0,b.jsxs)("ul",{className:"nav-center",children:[(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#clinics",children:"Find Clinics"})}),(0,b.jsx)("li",{children:(0,b.jsx)("a",{href:"#who",children:"For You"})})]}),(0,b.jsxs)("div",{className:"nav-right",children:[(0,b.jsx)(e.default,{href:"/login",className:"nav-signin",children:"Sign in"}),(0,b.jsx)(e.default,{href:"/register",className:"nav-join",children:"Join free"})]}),(0,b.jsxs)("button",{className:"ham",onClick:()=>k(!j),children:[(0,b.jsx)("span",{}),(0,b.jsx)("span",{}),(0,b.jsx)("span",{})]})]}),(0,b.jsxs)("div",{className:`mob-menu${j?" open":""}`,children:[(0,b.jsx)("a",{href:"#clinics",onClick:()=>k(!1),children:"Find Clinics"}),(0,b.jsx)("a",{href:"#how",onClick:()=>k(!1),children:"How It Works"}),(0,b.jsx)("a",{href:"#who",onClick:()=>k(!1),children:"For You"}),(0,b.jsx)(e.default,{href:"/login",onClick:()=>k(!1),children:"Sign in"}),(0,b.jsx)(e.default,{href:"/register",className:"nav-join",style:{textAlign:"center"},onClick:()=>k(!1),children:"Join free"})]}),(0,b.jsxs)("section",{className:"hero",children:[(0,b.jsx)("div",{className:"hero-eyebrow",children:"Healthcare, simplified"}),(0,b.jsxs)("h1",{children:["Find your clinic.",(0,b.jsx)("br",{}),(0,b.jsx)("em",{children:"Book your doctor."})]}),(0,b.jsx)("p",{children:"Search hundreds of verified clinics across the Philippines. Choose, book, and manage your health — all in one place."}),(0,b.jsxs)("div",{className:"search-box",children:[(0,b.jsx)("input",{type:"text",placeholder:"Clinic, specialty, or location...",value:l,onChange:a=>m(a.target.value)}),(0,b.jsx)("button",{children:"Search"})]}),(0,b.jsx)("div",{className:"tags",children:["Cardiology","Pediatrics","OB-GYN","Makati","Quezon City","Orthopedics"].map(a=>(0,b.jsx)("span",{className:"tag",onClick:()=>m(a),children:a},a))})]}),(0,b.jsxs)("section",{className:"clinic-section",id:"clinics",children:[(0,b.jsx)("div",{className:"section-label",children:"Featured clinics"}),(0,b.jsx)("div",{className:"clinic-grid",children:t.length>0?t.map((c,d)=>(0,b.jsxs)(e.default,{href:a?"/patient/find":"/login",className:"clinic-item",style:{textDecoration:"none",color:"inherit"},children:[(0,b.jsx)("div",{className:"ci-top",children:(0,b.jsx)("div",{className:"ci-name",children:c.clinicName})}),(0,b.jsx)("div",{className:"ci-loc",children:c.location}),(0,b.jsx)("div",{className:"ci-spec",children:c.description||"Medical Clinic"})]},d)):(0,b.jsxs)("div",{className:"no-results",children:['No results for "',l,'".',"",(0,b.jsx)("span",{style:{color:"var(--blue)",cursor:"pointer"},onClick:()=>m(""),children:"Clear"})]})}),(0,b.jsx)(e.default,{href:"/register",className:"view-all",children:"View all clinics & book →"})]}),(0,b.jsx)("div",{className:"divider"}),(0,b.jsx)("section",{className:"features-section",children:(0,b.jsxs)("div",{className:"features-inner",children:[(0,b.jsx)("div",{className:"section-label",children:"Why choose MedaPoint"}),(0,b.jsxs)("h2",{children:["Everything you need for ",(0,b.jsx)("strong",{children:"better healthcare."})]}),(0,b.jsxs)("div",{className:"features-grid",children:[(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"🔍"}),(0,b.jsx)("h3",{children:"Smart Search"}),(0,b.jsx)("p",{children:"Find clinics by specialty, location, or doctor name with advanced filters."})]}),(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"📅"}),(0,b.jsx)("h3",{children:"Instant Booking"}),(0,b.jsx)("p",{children:"Book appointments 24/7 with real-time availability and instant confirmation."})]}),(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"💬"}),(0,b.jsx)("h3",{children:"Direct Communication"}),(0,b.jsx)("p",{children:"Message your doctor directly through our secure platform."})]}),(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"📊"}),(0,b.jsx)("h3",{children:"Health Records"}),(0,b.jsx)("p",{children:"Access your medical history, prescriptions, and test results anytime."})]}),(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"⭐"}),(0,b.jsx)("h3",{children:"Rated & Reviewed"}),(0,b.jsx)("p",{children:"Read reviews from real patients to choose the best healthcare providers."})]}),(0,b.jsxs)("div",{className:"feature-card",children:[(0,b.jsx)("div",{className:"feature-icon",children:"💳"}),(0,b.jsx)("h3",{children:"Secure Payments"}),(0,b.jsx)("p",{children:"Pay for appointments safely with multiple payment options."})]})]})]})}),(0,b.jsx)("section",{className:"who",id:"who",children:(0,b.jsxs)("div",{className:"who-inner",children:[(0,b.jsxs)("div",{className:"who-header",style:{marginBottom:"2.5rem"},children:[(0,b.jsx)("div",{className:"section-label",style:{textAlign:"left"},children:"Built for everyone"}),(0,b.jsxs)("h2",{children:["One platform,",(0,b.jsx)("br",{}),(0,b.jsx)("strong",{children:"three roles."})]})]}),(0,b.jsx)("div",{className:"who-tabs",children:["patient","clinic","doctor"].map(a=>(0,b.jsx)("button",{className:`who-tab${n===a?" active":""}`,onClick:()=>o(a),children:"patient"===a?"Patients":"clinic"===a?"Clinics":"Doctors"},a))}),"patient"===n&&(0,b.jsxs)("div",{className:"who-body",children:[(0,b.jsx)("div",{className:"who-points",children:[{title:"Search & compare clinics",desc:"Filter by specialty, location, ratings, and doctor availability in real time."},{title:"Book appointments 24/7",desc:"Pick your time slot and get instant confirmation — no phone calls needed."},{title:"Access your health records",desc:"View medical history, prescriptions, and lab results from any device."},{title:"Switch clinics anytime",desc:"You are not locked in. Change your clinic whenever you need to."}].map((a,c)=>(0,b.jsxs)("div",{className:"wp",children:[(0,b.jsxs)("div",{className:"wp-num",children:["0",c+1]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"wp-title",children:a.title}),(0,b.jsx)("div",{className:"wp-desc",children:a.desc})]})]},c))}),(0,b.jsxs)("div",{className:"who-cta-wrap",children:[(0,b.jsxs)("h3",{children:["Take control of your ",(0,b.jsx)("strong",{children:"healthcare journey."})]}),(0,b.jsx)("p",{children:"No more calling clinic after clinic. Find the right doctor, at the right clinic, at a time that works — all from your phone."}),(0,b.jsx)(e.default,{href:"/register",className:"btn-dark",children:"Create patient account"})]})]}),"clinic"===n&&(0,b.jsxs)("div",{className:"who-body",children:[(0,b.jsx)("div",{className:"who-points",children:[{title:"Register your clinic",desc:"List your clinic on MedaPoint and reach thousands of patients in your city."},{title:"Manage your team",desc:"Add doctors, assign schedules, and control access with role-based permissions."},{title:"Reduce no-shows",desc:"Automated reminders keep your calendar full and reliable."},{title:"Analytics dashboard",desc:"Track patient flow, revenue, and performance metrics in real time."}].map((a,c)=>(0,b.jsxs)("div",{className:"wp",children:[(0,b.jsxs)("div",{className:"wp-num",children:["0",c+1]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"wp-title",children:a.title}),(0,b.jsx)("div",{className:"wp-desc",children:a.desc})]})]},c))}),(0,b.jsxs)("div",{className:"who-cta-wrap",children:[(0,b.jsxs)("h3",{children:["Grow your clinic with ",(0,b.jsx)("strong",{children:"smart digital tools."})]}),(0,b.jsx)("p",{children:"Digitize operations, reduce admin work, and deliver a better experience for every patient that walks through your door."}),(0,b.jsx)(e.default,{href:"/login",className:"btn-dark",children:"Sign in as Admin"})]})]}),"doctor"===n&&(0,b.jsxs)("div",{className:"who-body",children:[(0,b.jsx)("div",{className:"who-points",children:[{title:"Manage your schedule",desc:"Set your availability and let patients book open slots automatically."},{title:"Digital consultations",desc:"Access full patient history, write prescriptions, and add notes digitally."},{title:"Smart queue management",desc:"Real-time patient queue with priority controls and alerts."},{title:"Performance insights",desc:"See consultation stats, patient feedback, and trends over time."}].map((a,c)=>(0,b.jsxs)("div",{className:"wp",children:[(0,b.jsxs)("div",{className:"wp-num",children:["0",c+1]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"wp-title",children:a.title}),(0,b.jsx)("div",{className:"wp-desc",children:a.desc})]})]},c))}),(0,b.jsxs)("div",{className:"who-cta-wrap",children:[(0,b.jsxs)("h3",{children:["Focus on patients, ",(0,b.jsx)("strong",{children:"not paperwork."})]}),(0,b.jsx)("p",{children:"A clean, fast dashboard that puts everything you need in one place — less admin, more care."}),(0,b.jsx)(e.default,{href:"/login",className:"btn-dark",children:"Go to doctor portal"})]})]})]})}),(0,b.jsxs)("section",{className:"cta-section",children:[(0,b.jsxs)("h2",{children:["Your health.",(0,b.jsx)("br",{}),(0,b.jsx)("em",{children:"Your choice."})]}),(0,b.jsx)("p",{children:"Whether you are a patient, a clinic, or a doctor — MedaPoint was built for you."}),(0,b.jsxs)("div",{className:"cta-btns",children:[(0,b.jsx)(e.default,{href:"/register",className:"btn-blue",children:"Create free account"}),(0,b.jsx)(e.default,{href:"/login",className:"btn-line",children:"Sign in"})]}),(0,b.jsx)("div",{className:"role-row",children:[{emoji:"👤",title:"For Patients",desc:"Free to use. Find and book clinics near you.",link:"/register"},{emoji:"🏥",title:"For Clinics",desc:"List your clinic and reach more patients.",link:"/login"},{emoji:"🩺",title:"For Doctors",desc:"Manage appointments and patient records.",link:"/login"}].map(a=>(0,b.jsxs)("div",{className:"role-item",children:[(0,b.jsx)("span",{className:"role-emoji",children:a.emoji}),(0,b.jsx)("h4",{children:a.title}),(0,b.jsx)("p",{children:a.desc}),(0,b.jsx)(e.default,{href:a.link,className:"role-link",children:"Get started →"})]},a.title))})]}),(0,b.jsxs)("footer",{children:[(0,b.jsx)("div",{className:"footer-brand",children:"MedaPoint"}),(0,b.jsxs)("div",{className:"footer-links",children:[(0,b.jsx)("a",{href:"#",children:"Privacy"}),(0,b.jsx)("a",{href:"#",children:"Terms"}),(0,b.jsx)("a",{href:"#",children:"For Clinics"}),(0,b.jsx)("a",{href:"#",children:"Contact"}),(0,b.jsx)("a",{href:"#",children:"Help"})]}),(0,b.jsx)("div",{className:"footer-copy",children:"© 2026 MedaPoint"})]})]})}a.s(["default",()=>g])}];

//# sourceMappingURL=Desktop_medapoint2_src_app_page_tsx_8b3a6fc9._.js.map