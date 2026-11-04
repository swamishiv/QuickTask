
import {
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  Typography,
  Button,
  Tag,
  List,
  Empty,
  Space,
} from "antd";

import {
  UnorderedListOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Dashboard({ tasks = [] }) {
  const navigate = useNavigate();

  const completed = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const pending = tasks.length - completed;

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completed / tasks.length) * 100);

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      note: "Tasks in your workspace",
      icon: <UnorderedListOutlined />,
      className: "qt-stat-blue",
    },
    {
      title: "Pending Tasks",
      value: pending,
      note: "Ready for your attention",
      icon: <ClockCircleOutlined />,
      className: "qt-stat-orange",
    },
    {
      title: "Completed",
      value: completed,
      note: "Tasks finished successfully",
      icon: <CheckCircleOutlined />,
      className: "qt-stat-green",
    },
    {
      title: "Completion Rate",
      value: completionRate,
      suffix: "%",
      note: "Your productivity score",
      icon: <TrophyOutlined />,
      className: "qt-stat-purple",
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Show up to five tasks from the current task list.
  const previewTasks = tasks.slice(0, 5);

  return (
    <div className="qt-dashboard-content">
      <div className="qt-dashboard-toolbar">
        <div>
          <Text type="secondary" >
            <CalendarOutlined /> {today}
          </Text>
          <Title level={3} style={{ margin: "6px 0 0" }}>
            Your overview
          </Title>
          <Text type="secondary">
            Track your progress and keep moving forward.
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/tasks/new")}
        >
          Add Task
        </Button>
      </div>

      <Row gutter={[16, 16]} className="qt-stats-grid">
        {stats.map((stat) => (
          <Col xs={24} sm={12} xl={6} key={stat.title}>
            <Card
              bordered={false}
              className={`qt-stat-card ${stat.className}`}
            >
              <div className="qt-stat-card-top">
                <Text type="secondary">{stat.title}</Text>
                <span className="qt-stat-icon">
                  {stat.icon}
                </span>
              </div>

              <Statistic
                value={stat.value}
                suffix={stat.suffix}
              />

              <Text type="secondary" className="qt-stat-note">
                {stat.note}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            className="qt-panel qt-productivity-panel"
          >
            <div className="qt-panel-heading">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Productivity
                </Title>
                <Text type="secondary">
                  Your completion summary
                </Text>
              </div>
              <span className="qt-productivity-icon">
                <TrophyOutlined />
              </span>
            </div>

            <div className="qt-productivity-score">
              <Title level={2} style={{ margin: 0 }}>
                {completionRate}%
              </Title>
              <Text type="secondary">completed</Text>
            </div>

            <Progress
              percent={completionRate}
              showInfo={false}
              strokeWidth={10}
              status={
                completionRate === 100 && tasks.length > 0
                  ? "success"
                  : "active"
              }
            />

            <div className="qt-productivity-footer">
              <span>
                <CheckCircleOutlined /> {completed} completed
              </span>
              <span>
                <ClockCircleOutlined /> {pending} pending
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            className="qt-panel qt-recent-panel"
            title={
              <div className="qt-recent-heading">
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Your Tasks
                  </Title>
                  <Text type="secondary">
                    A quick look at your task list
                  </Text>
                </div>

                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/tasks")}
                >
                  View all
                </Button>
              </div>
            }
          >
            {previewTasks.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No tasks yet. Start with your first task!"
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/tasks/new")}
                >
                  Create Task
                </Button>
              </Empty>
            ) : (
              <List
                dataSource={previewTasks}
                renderItem={(task) => (
                  <List.Item
                    key={task.id}
                    className="qt-recent-task"
                    actions={[
                      <Tag
                        key="status"
                        color={task.isCompleted ? "success" : "warning"}
                      >
                        {task.isCompleted ? "Completed" : "Pending"}
                      </Tag>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <span
                          className={
                            task.isCompleted
                              ? "qt-task-status-icon qt-task-done"
                              : "qt-task-status-icon qt-task-pending"
                          }
                        >
                          {task.isCompleted
                            ? <CheckCircleOutlined />
                            : <ClockCircleOutlined />}
                        </span>
                      }
                      title={
                        <Text
                          delete={task.isCompleted}
                          className="qt-recent-task-title"
                        >
                          {task.title}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
