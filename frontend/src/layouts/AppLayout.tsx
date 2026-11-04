// Page frame: light header with the logo, navigation and the theme toggle, the current page through <Outlet />, and a footer.
import { InboxOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons"
import { Button, Flex, Layout, Menu, Tooltip, Typography, theme } from "antd"
import { Link, Outlet, useLocation } from "react-router"
import { useTheme } from "../context/ThemeContext"

export function AppLayout() {
  const { pathname } = useLocation()
  const { darkMode, toggleDark } = useTheme()
  const { token } = theme.useToken()

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: "0 24px",
        }}
      >
        <Link to="/">
          <Flex align="center" gap={10}>
            <Flex
              align="center"
              justify="center"
              style={{ width: 34, height: 34, borderRadius: 10, background: token.colorPrimary, color: "#fff", fontSize: 18 }}
            >
              <InboxOutlined />
            </Flex>
            <Typography.Text strong style={{ fontSize: 19 }}>
              BoxBrain
            </Typography.Text>
          </Flex>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname === "/about" ? "about" : "home"]}
          style={{ flex: 1, minWidth: 0, borderBottom: "none", background: "transparent" }}
          items={[
            { key: "home", label: <Link to="/">My boxes</Link> },
            { key: "about", label: <Link to="/about">About</Link> },
          ]}
        />
        <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
          <Button shape="circle" icon={darkMode ? <SunOutlined /> : <MoonOutlined />} onClick={toggleDark} aria-label="Toggle dark mode" />
        </Tooltip>
      </Layout.Header>
      <Layout.Content style={{ maxWidth: 1040, width: "100%", margin: "0 auto", padding: "28px 16px" }}>
        <Outlet />
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center", background: "transparent" }}>
        <Typography.Text type="secondary">BoxBrain · never open five boxes to find one thing</Typography.Text>
      </Layout.Footer>
    </Layout>
  )
}
