
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Button,
  Space,
  Grid,
} from "antd";

import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
  CheckSquareOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MainLayout.css";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function MainLayout({ children, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();

  const location = useLocation();
  const navigate = useNavigate();

  // Highlight the correct sidebar item for the current URL.
  const selectedKey =
    location.pathname === "/tasks"
      ? "/tasks"
      : location.pathname === "/tasks/new"
      ? "/tasks/new"
      : "/";

  const menuItems = [
    {
      key: "/",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
    },
    {
      key: "/tasks",
      icon: <UnorderedListOutlined />,
      label: "My Tasks",
    },
    {
      key: "/tasks/new",
      icon: <PlusCircleOutlined />,
      label: "Add Task",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);

    if (!screens.lg) {
      setCollapsed(true);
    }
  };

  return (
    <Layout className="qt-layout">
      <Sider
  breakpoint="lg"
  collapsed={collapsed}
  onCollapse={setCollapsed}
  collapsedWidth={screens.lg ? 80 : 0}
  width={238}
  trigger={null}
  className="qt-sider"
 styles={{
    content: {
      backgroundColor: "#243b63",
    },
  }}
>
        <div
          className="qt-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="qt-brand-icon">
            <CheckSquareOutlined />
          </div>

          {!collapsed && <span>QuickTask</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="qt-menu"
        />

        <div className="qt-sidebar-bottom">
          <div className="qt-sidebar-illustration">
            <CheckSquareOutlined />
          </div>

          {!collapsed && (
            <>
              <Text className="qt-sidebar-title">
                Stay focused.
                <br />
                Get things done.
              </Text>

              <Text className="qt-sidebar-description">
                Small steps every day lead to big results.
              </Text>
            </>
          )}
        </div>
      </Sider>

      <Layout className="qt-main">
        <Header className="qt-header">
          <Space size="middle">
            <Button
              type="text"
              className="qt-menu-toggle"
              aria-label="Toggle sidebar"
              icon={
                collapsed
                  ? <MenuUnfoldOutlined />
                  : <MenuFoldOutlined />
              }
              onClick={() => setCollapsed(!collapsed)}
            />

            <Text className="qt-header-caption">
              Your productivity workspace
            </Text>
          </Space>

          <Space size="middle">
            <Avatar
              className="qt-avatar"
              icon={<UserOutlined />}
            />

            <Text className="qt-user-name">
              {user?.fullName || "My Account"}
            </Text>

            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout}
              className="qt-logout"
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content className="qt-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
