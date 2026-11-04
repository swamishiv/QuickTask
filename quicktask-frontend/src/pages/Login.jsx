
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  RiseOutlined,
  ClockCircleFilled,
  TrophyFilled,
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  CheckSquareFilled,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleLogin = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });

      localStorage.setItem("quicktask_token", response.token);
      localStorage.setItem(
        "quicktask_user",
        JSON.stringify(response.user)
      );

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qt-auth-page">

      {/* Left Marketing Section */}
      <section className="qt-auth-hero">

        <div className="qt-auth-brand">
          <div className="qt-auth-logo">
            <CheckSquareFilled />
          </div>

          <div>
            <h1>QuickTask</h1>
            <p>Plan · Organize · Achieve</p>
          </div>
        </div>

        <div className="qt-auth-hero-content">
          <span className="qt-auth-eyebrow">
            YOUR PRODUCTIVITY PARTNER
          </span>

          <Title className="qt-auth-main-heading">
            Manage your work.
            <br />
            <span>Achieve more.</span>
          </Title>

          <Text className="qt-auth-description">
            QuickTask helps you stay organized, track progress
            and reach your goals – all in one place.
          </Text>

          {/* Features */}
          <div className="qt-auth-features">

            <div className="qt-feature">
              <CheckCircleFilled />
              <span>Task<br />Tracking</span>
            </div>

            <div className="qt-feature">
              <RiseOutlined />
              <span>Boost<br />Productivity</span>
            </div>

            <div className="qt-feature">
              <ClockCircleFilled />
              <span>Save<br />Time</span>
            </div>

            <div className="qt-feature">
              <TrophyFilled />
              <span>Achieve<br />Goals</span>
            </div>

          </div>

          {/* Dashboard Preview */}
          <div className="qt-preview-wrapper">
            <div className="qt-dashboard-preview">

              <div className="qt-preview-topbar">
                <div className="qt-window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>QuickTask Workspace</span>
              </div>

              <div className="qt-preview-body">

                <div className="qt-preview-sidebar">
                  <strong>☑ QuickTask</strong>
                  <span className="active">▦ Dashboard</span>
                  <span>☷ My Tasks</span>
                  <span>⊕ Add Task</span>
                  <span>▥ Reports</span>
                </div>

                <div className="qt-preview-main">
                  <h3>Your Dashboard</h3>

                  <div className="qt-preview-stats">
                    <div>
                      <small>Total Tasks</small>
                      <strong>24</strong>
                    </div>
                    <div>
                      <small>Completed</small>
                      <strong className="completed">18</strong>
                    </div>
                    <div>
                      <small>Pending</small>
                      <strong className="pending">6</strong>
                    </div>
                  </div>

                  <div className="qt-preview-progress">
                    <div>
                      <span>Your Progress</span>
                      <strong>75%</strong>
                    </div>
                    <div className="qt-progress-track">
                      <div></div>
                    </div>
                  </div>

                  <div className="qt-preview-message">
                    <CheckCircleFilled />
                    You're making great progress!
                  </div>

                </div>
              </div>
            </div>

            <div className="qt-floating-note">
              <TrophyFilled />
              <span>
                Stay Focused.
                <br />
                Be Productive.
              </span>
            </div>
          </div>

          <div className="qt-auth-bottom-message">
            <span>🚀</span>
            Small steps. Big results.
          </div>

        </div>
      </section>

      {/* Right Login Section */}
      <section className="qt-auth-form-section">

        <div className="qt-auth-top-message">
          Your Productivity Partner <span>♥</span>
        </div>

        <Card className="qt-login-card" bordered={false}>

          <div className="qt-login-brand">
            <div className="qt-auth-logo">
              <CheckSquareFilled />
            </div>
            <h2>Quick<span>Task</span></h2>
          </div>

          <div className="qt-login-heading">
            <Title level={2}>Welcome Back!</Title>
            <Text>
              Sign in to continue to your workspace
            </Text>
          </div>

          {successMessage && (
            <Alert
              message={successMessage}
              type="success"
              showIcon
              closable
              className="qt-login-alert"
            />
          )}

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
              className="qt-login-alert"
            />
          )}

          <Form
            layout="vertical"
            onFinish={handleLogin}
            requiredMark={false}
            className="qt-login-form"
          >

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address.",
                },
                {
                  type: "email",
                  message: "Please enter a valid email.",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password.",
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              className="qt-login-button"
            >
              Sign In
            </Button>

          </Form>

          <div className="qt-login-register">
            <Text>Don't have an account?</Text>
            <Link to="/register">
              Create Account <span>→</span>
            </Link>
          </div>

        </Card>

        <div className="qt-login-security">
          <SafetyCertificateOutlined />
          <span>Secure</span>
          <i>•</i>
          <span>Reliable</span>
          <i>•</i>
          <span>Built for You</span>
        </div>

      </section>
    </div>
  );
}
