
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
  MailOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  CheckSquareFilled,
  RiseOutlined,
  ClockCircleFilled,
  TrophyFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css";

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    setError("");

    try {
      await authService.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      navigate("/login", {
        state: { message: "Registration successful. Please log in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qt-register-page">
      {/* Left Branding Section */}
      <section className="qt-register-hero">
        <div className="qt-register-hero-content">
          <div className="qt-register-logo">
            <span className="qt-register-logo-icon">
              <CheckSquareFilled />
            </span>
            <span>QuickTask</span>
          </div>

          <div className="qt-register-intro">
            <Text className="qt-register-eyebrow">
              YOUR PRODUCTIVITY PARTNER
            </Text>

            <Title className="qt-register-main-heading">
              Start your journey.
              <br />
              <span>Get things done.</span>
            </Title>

            <Text className="qt-register-description">
              Create your account and bring all your tasks, goals,
              and daily work together in one simple workspace.
            </Text>
          </div>

          <div className="qt-register-benefits">
            <div className="qt-register-benefit">
              <span className="qt-register-benefit-icon">
                <CheckCircleFilled />
              </span>
              <div>
                <Text strong>Organize your tasks</Text>
                <Text>Keep everything in one place.</Text>
              </div>
            </div>

            <div className="qt-register-benefit">
              <span className="qt-register-benefit-icon">
                <RiseOutlined />
              </span>
              <div>
                <Text strong>Improve productivity</Text>
                <Text>Focus on what matters most.</Text>
              </div>
            </div>

            <div className="qt-register-benefit">
              <span className="qt-register-benefit-icon">
                <TrophyFilled />
              </span>
              <div>
                <Text strong>Achieve your goals</Text>
                <Text>Track progress and celebrate wins.</Text>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="qt-register-preview">
            <div className="qt-register-preview-top">
              <div>
                <Text strong>My Workspace</Text>
                <Text> Your productivity overview</Text>
              </div>
              <span className="qt-register-preview-status">
                <span /> Active
              </span>
            </div>

            <div className="qt-register-preview-stats">
              <div>
                <Text>Total Tasks</Text>
                <Title level={3}>24</Title>
              </div>
              <div>
                <Text>Completed</Text>
                <Title level={3}>18</Title>
              </div>
              <div>
                <Text>In Progress</Text>
                <Title level={3}>06</Title>
              </div>
            </div>

            <div className="qt-register-progress">
              <div>
                <Text>Weekly progress</Text>
                <Text strong>75%</Text>
              </div>
              <div className="qt-register-progress-track">
                <span />
              </div>
            </div>
          </div>

          <div className="qt-register-bottom-message">
            <ClockCircleFilled />
            <Text>Make every day more productive with QuickTask.</Text>
          </div>
        </div>
      </section>

      {/* Right Registration Section */}
      <section className="qt-register-form-section">
        <Card className="qt-register-card" variant="borderless">
          <div className="qt-register-mobile-logo">
            <CheckSquareFilled />
            <span>QuickTask</span>
          </div>

          <div className="qt-register-heading">
            <div className="qt-register-heading-icon">
              <UserAddOutlined />
            </div>

            <Title level={2}>Create Account</Title>
            <Text>Get started with your free QuickTask account.</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          <Form
            layout="vertical"
            onFinish={handleRegister}
            requiredMark={false}
            className="qt-register-form"
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Enter your full name." },
                {
                  min: 2,
                  message: "Name must have at least 2 characters.",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                maxLength={100}
                placeholder="Enter your full name"
              />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Enter your email." },
                { type: "email", message: "Enter a valid email." },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                maxLength={255}
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Enter a password." },
                { min: 8, message: "Use at least 8 characters." },
                { max: 128, message: "Password is too long." },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="At least 8 characters"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Confirm your password.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("password") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match.")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Re-enter your password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="qt-register-submit"
              icon={<UserAddOutlined />}
            >
              Create Account
            </Button>
          </Form>

          <div className="qt-register-login-link">
            <Text>Already have an account?</Text>
            <Link to="/login">Sign in</Link>
          </div>

          <div className="qt-register-security">
            <SafetyCertificateOutlined />
            <Text>Secure • Reliable • Built for You</Text>
          </div>
        </Card>
      </section>
    </div>
  );
}
