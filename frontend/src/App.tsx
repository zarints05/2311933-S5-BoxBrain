// Routes and the Ant Design theme; every page renders inside AppLayout.
import { App as AntApp, ConfigProvider, theme } from "antd"
import { BrowserRouter, Route, Routes } from "react-router"
import { useTheme } from "./context/ThemeContext"
import { AppLayout } from "./layouts/AppLayout"
import { AboutPage } from "./pages/AboutPage"
import { BoxDetailsPage } from "./pages/BoxDetailsPage"
import { HomePage } from "./pages/HomePage"

// BoxBrain's look: a warm cardboard-orange primary colour and rounder corners.
const brand = {
  colorPrimary: "#d4691e",
  colorInfo: "#d4691e",
  borderRadius: 12,
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
}

function App() {
  const { darkMode } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { ...brand, colorBgLayout: darkMode ? "#141110" : "#f7f2ea" },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="boxes/:boxId" element={<BoxDetailsPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
