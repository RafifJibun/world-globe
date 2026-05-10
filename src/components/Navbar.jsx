import { useNavigate, useLocation } from "react-router-dom"

function Navbar({ dark, setDark }) {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: "Globe", path: "/" },
    { label: "Semua Negara", path: "/list" },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        World Globe
      </div>
      <div className="navbar-links">
        {links.map((link, i) => (
          <button
            key={i}
            className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  )
}

export default Navbar