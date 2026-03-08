(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,63070,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},52557,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return s},searchParamsToUrlQuery:function(){return i},urlQueryToSearchParams:function(){return l}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});function i(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function a(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function l(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,a(e));else t.set(r,a(n));return t}function s(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},34258,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return l},formatWithValidation:function(){return u},urlObjectKeys:function(){return s}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=e.r(70739)._(e.r(52557)),a=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:r}=e,n=e.protocol||"",o=e.pathname||"",l=e.hash||"",s=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),s&&"object"==typeof s&&(s=String(i.urlQueryToSearchParams(s)));let c=e.search||s&&`?${s}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||a.test(n))&&!1!==u?(u="//"+(u||""),o&&"/"!==o[0]&&(o="/"+o)):u||(u=""),l&&"#"!==l[0]&&(l="#"+l),c&&"?"!==c[0]&&(c="?"+c),o=o.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${n}${u}${o}${c}${l}`}let s=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return l(e)}},97051,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return o}});let n=e.r(61070);function o(e,t){let r=(0,n.useRef)(null),o=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(r.current=i(e,n)),t&&(o.current=i(t,n))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},45802,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return g},MiddlewareNotFoundError:function(){return j},MissingStaticPage:function(){return v},NormalizeError:function(){return y},PageNotFoundError:function(){return x},SP:function(){return b},ST:function(){return m},WEB_VITALS:function(){return i},execOnce:function(){return a},getDisplayName:function(){return d},getLocationOrigin:function(){return u},getURL:function(){return c},isAbsoluteUrl:function(){return s},isResSent:function(){return f},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return P}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=["CLS","FCP","FID","INP","LCP","TTFB"];function a(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let l=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,s=e=>l.test(e);function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function c(){let{href:e}=window.location,t=u();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function f(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&f(r))return n;if(!n)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return n}let b="u">typeof performance,m=b&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class g extends Error{}class y extends Error{}class x extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class j extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function P(e){return JSON.stringify({message:e.message,stack:e.stack})}},47434,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return i}});let n=e.r(45802),o=e.r(37481);function i(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,o.hasBasePath)(r.pathname)}catch(e){return!1}}},57180,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},231,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return g},useLinkStatus:function(){return x}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let i=e.r(70739),a=e.r(59730),l=i._(e.r(61070)),s=e.r(34258),u=e.r(96174),c=e.r(97051),d=e.r(45802),f=e.r(85683);e.r(63070);let p=e.r(8667),h=e.r(47434),b=e.r(21039);function m(e){return"string"==typeof e?e:(0,s.formatUrl)(e)}function g(t){var r;let n,o,i,[s,g]=(0,l.useOptimistic)(p.IDLE_LINK_STATUS),x=(0,l.useRef)(null),{href:v,as:j,children:P,prefetch:O=null,passHref:_,replace:C,shallow:N,scroll:E,onClick:S,onMouseEnter:w,onTouchStart:T,legacyBehavior:R=!1,onNavigate:M,ref:k,unstable_dynamicOnHover:A,...L}=t;n=P,R&&("string"==typeof n||"number"==typeof n)&&(n=(0,a.jsx)("a",{children:n}));let D=l.default.useContext(u.AppRouterContext),U=!1!==O,I=!1!==O?null===(r=O)||"auto"===r?b.FetchStrategy.PPR:b.FetchStrategy.Full:b.FetchStrategy.PPR,{href:$,as:F}=l.default.useMemo(()=>{let e=m(v);return{href:e,as:j?m(j):e}},[v,j]);if(R){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=l.default.Children.only(n)}let z=R?o&&"object"==typeof o&&o.ref:k,B=l.default.useCallback(e=>(null!==D&&(x.current=(0,p.mountLinkInstance)(e,$,D,I,U,g)),()=>{x.current&&((0,p.unmountLinkForCurrentNavigation)(x.current),x.current=null),(0,p.unmountPrefetchableInstance)(e)}),[U,$,D,I,g]),K={ref:(0,c.useMergedRef)(B,z),onClick(t){R||"function"!=typeof S||S(t),R&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!D||t.defaultPrevented||function(t,r,n,o,i,a,s){if("u">typeof window){let u,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((u=t.currentTarget.getAttribute("target"))&&"_self"!==u||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(55771);l.default.startTransition(()=>{d(n||r,i?"replace":"push",a??!0,o.current)})}}(t,$,F,x,C,E,M)},onMouseEnter(e){R||"function"!=typeof w||w(e),R&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),D&&U&&(0,p.onNavigationIntent)(e.currentTarget,!0===A)},onTouchStart:function(e){R||"function"!=typeof T||T(e),R&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),D&&U&&(0,p.onNavigationIntent)(e.currentTarget,!0===A)}};return(0,d.isAbsoluteUrl)(F)?K.href=F:R&&!_&&("a"!==o.type||"href"in o.props)||(K.href=(0,f.addBasePath)(F)),i=R?l.default.cloneElement(o,K):(0,a.jsx)("a",{...L,...K,children:n}),(0,a.jsx)(y.Provider,{value:s,children:i})}e.r(57180);let y=(0,l.createContext)(p.IDLE_LINK_STATUS),x=()=>(0,l.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},64174,(e,t,r)=>{t.exports=e.r(41968)},58998,e=>{"use strict";var t=e.i(59730),r=e.i(231),n=e.i(64174),o=e.i(87001),i=e.i(61070);let a=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/admin/clinics",icon:"🏥",label:"Clinics"},{href:"/admin/users",icon:"👥",label:"Users"},{href:"/admin/doctors",icon:"🩺",label:"Doctors"},{href:"/admin/appointments",icon:"📅",label:"Appointments"},{href:"/?home=1",icon:"🏠",label:"Home"}],l=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/doctor/appointments",icon:"📅",label:"Appointments"},{href:"/doctor/schedules",icon:"🗓",label:"My Schedules"},{href:"/doctor/patients",icon:"👤",label:"My Patients"},{href:"/doctor/messages",icon:"💬",label:"Messages"},{href:"/doctor/profile",icon:"⚙️",label:"Profile"},{href:"/?home=1",icon:"🏠",label:"Home"}],s=[{href:"/dashboard",icon:"⊞",label:"Dashboard"},{href:"/patient/find",icon:"🔍",label:"Find a Clinic"},{href:"/patient/appointments",icon:"📅",label:"Appointments"},{href:"/patient/payments",icon:"💳",label:"Payments"},{href:"/patient/messages",icon:"💬",label:"Messages"},{href:"/patient/profile",icon:"⚙️",label:"Profile"},{href:"/?home=1",icon:"🏠",label:"Home"}];function u({role:e}){let u=(0,n.usePathname)(),{data:c}=(0,o.useSession)(),[d,f]=(0,i.useState)(!1),p="ADMIN"===e?a:"DOCTOR"===e?l:s,h="ADMIN"===e?"Admin Panel":"DOCTOR"===e?"Doctor Portal":"Patient Portal",b=()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"sidebar-logo",children:["Med",(0,t.jsx)("span",{children:"Appoint"})]}),(0,t.jsx)("div",{style:{padding:"0.75rem 1rem",fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:h}),(0,t.jsx)("nav",{className:"sidebar-nav",children:p.map(e=>(0,t.jsxs)(r.default,{href:e.href,className:`nav-item ${u===e.href?"active":""}`,onClick:()=>f(!1),children:[(0,t.jsx)("span",{className:"nav-icon",children:e.icon}),e.label]},e.href))}),(0,t.jsx)("div",{className:"sidebar-footer",children:(0,t.jsxs)("button",{onClick:()=>(0,o.signOut)({callbackUrl:"/login"}),className:"nav-item",style:{color:"rgba(255,255,255,0.5)",width:"100%",borderRadius:"6px"},children:[(0,t.jsx)("span",{className:"nav-icon",children:"↩"})," Sign out"]})})]});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
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
      `}),(0,t.jsx)("aside",{className:"sidebar",children:(0,t.jsx)(b,{})}),(0,t.jsxs)("div",{className:"mobile-topbar",children:[(0,t.jsxs)("button",{className:"ham-btn",onClick:()=>f(!d),children:[(0,t.jsx)("span",{}),(0,t.jsx)("span",{}),(0,t.jsx)("span",{})]}),(0,t.jsxs)("div",{className:"topbar-logo",children:["Med",(0,t.jsx)("span",{children:"Appoint"})]}),(0,t.jsx)("div",{style:{width:30}})]}),d&&(0,t.jsx)("div",{className:"mobile-overlay",onClick:()=>f(!1)}),(0,t.jsx)("div",{className:`mobile-sidebar${d?" open":""}`,children:(0,t.jsx)(b,{})})]})}e.s(["Sidebar",()=>u])},34599,e=>{"use strict";var t=e.i(59730),r=e.i(87001),n=e.i(64174),o=e.i(61070),i=e.i(58998);function a({children:e}){let{data:a,status:l}=(0,r.useSession)(),s=(0,n.useRouter)();return((0,o.useEffect)(()=>{if("loading"!==l){if(!a)return void s.push("/login");"DOCTOR"!==a.user.role&&s.push("/login")}},[a,l,s]),"loading"===l)?(0,t.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"var(--gray)"},children:"Loading..."}):a?(0,t.jsxs)("div",{className:"dash-layout",children:[(0,t.jsx)(i.Sidebar,{role:"DOCTOR"}),(0,t.jsx)("div",{className:"dash-content",children:e})]}):null}e.s(["default",()=>a])}]);