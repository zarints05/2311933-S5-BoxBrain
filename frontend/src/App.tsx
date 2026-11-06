// The frame around every page (top bar, footer), the colours, and which page shows for which URL.

import { App as AntApp, ConfigProvider, theme } from "antd"
import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import TopBar from "./components/TopBar"
import BoxPage from "./pages/BoxPage"
import HomePage from "./pages/HomePage"

export default function App() {
  // Dark mode is kept here and handed to the top bar, which has the switch
  const [darkMode, setDarkMode] = useState(false)

  // Colours for the Ant Design parts (buttons, the form, pop-ups).
  // Everything else is styled in styles.css.
  const antdTheme = {
    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: darkMode ? "#8b87ff" : "#4f46e5", // indigo, the one accent colour
      borderRadius: 12,
      fontFamily: "'Nunito', system-ui, sans-serif",
      colorBgContainer: darkMode ? "#221d2c" : "#ffffff",
      colorBgElevated: darkMode ? "#2a2436" : "#ffffff",
    },
  }

  return (
    <ConfigProvider theme={antdTheme}>
      {/* AntApp lets pages show the small pop-up messages (message.success / message.error) */}
      <AntApp>
        <BrowserRouter>
          <div className={darkMode ? "app dark" : "app"} style={{ minHeight: "100vh" }}>
            <TopBar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

            <main className="page">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/boxes/:id" element={<BoxPage />} />
                {/* Any other address goes back to the home page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <footer className="footer">BoxBrain · never open five boxes to find one thing</footer>
          </div>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}
