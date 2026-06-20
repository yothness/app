import "./index.scss";

const userButtton = document.querySelector("[menu-user]");
const LogoApp = document.querySelector("[logo-app]");


export default function Header({
  page: id, children
}: {
  page: string, children: any
}) {
  return (
    <div role="banner" id="header">
      <div ref={a => { if (LogoApp && a) { a.appendChild(LogoApp); LogoApp.removeAttribute("hidden") } }} />
      {children ?<div style={ { flex: 1 }}>
        {children}
      </div>:
      <div role="list" className="center">
        <a role="listitem" className="endpoint" aria-selected={id === "home"} href="/"><span className="text">Home</span> <span className="msr-icon">search</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "apps_services"} href="/apps/services"><span className="text">Apps & Services</span> <span className="msr-icon">apps</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "news_update"} href="/news_update"><span className="text">News & Updates</span> <span className="msr-icon">news</span></a>
        <a role="listitem" className="endpoint" aria-selected={id === "about"} href="/about"><span className="text">About</span> <span className="msr-icon">info</span></a>
      </div>
      }
      <div className="flex" ref={a => { if (userButtton && a) { a.appendChild(userButtton); userButtton.removeAttribute("hidden") } }}>
        <a role="listitem" className="endpoint" aria-selected={id === "preferences"} href="/preferences"><span className="text">Settings</span> <span className="msr-icon">settings</span></a>
      </div>
    </div>
  )
}