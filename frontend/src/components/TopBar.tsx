// The bar at the top: the logo (which takes you back to your boxes) and the dark mode button.

import { MoonOutlined, SunOutlined } from "@ant-design/icons"
import { Link } from "react-router"

type TopBarProps = {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function TopBar({ darkMode, onToggleDarkMode }: TopBarProps) {
  return (
    <header className="top-bar">
      <Link to="/" className="logo">
        <span className="logo-box" />
        <span>BoxBrain</span>
      </Link>

      <button
        className="mode-button"
        onClick={onToggleDarkMode}
        aria-label="Toggle dark mode"
        title={darkMode ? "Light mode" : "Dark mode"}
      >
        {darkMode ? <SunOutlined /> : <MoonOutlined />}
      </button>
    </header>
  )
}
