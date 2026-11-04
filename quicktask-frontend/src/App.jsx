
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Typography,
  Alert,
  Spin,
  Card,
} from "antd";

import MainLayout from "./components/MainLayout";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/taskService";

const { Title, Text } = Typography;

// Protect routes that require authentication
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("quicktask_token");

  return token ? children : <Navigate to="/login" replace />;
}

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("quicktask_token");
    localStorage.removeItem("quicktask_user");

    navigate("/login", { replace: true });
  };

  // Load tasks from the existing API
  const loadTasks = async () => {
    try {
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Unable to load tasks. Please check your API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = async (title) => {
    try {
      setError("");

      const newTask = await createTask({
        title,
        isCompleted: false,
      });

      setTasks((current) => [newTask, ...current]);

      // Navigate to My Tasks after successful creation
      navigate("/tasks");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Unable to add task. Please try again.");
      throw err;
    }
  };

  // Complete or reopen task
  const toggleTask = async (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    try {
      setError("");

      await updateTask(id, {
        title: task.title,
        isCompleted: !task.isCompleted,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                isCompleted: !item.isCompleted,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Unable to update task. Please try again.");
    }
  };

  // Delete task
  const removeTask = async (id) => {
    try {
      setError("");

      await deleteTask(id);

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Unable to delete task. Please try again.");
    }
  };

  // Logged-in user
  const user = JSON.parse(
    localStorage.getItem("quicktask_user") || "null"
  );

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Shared error message */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* DASHBOARD ROUTE */}
      {location.pathname === "/" && (
        <div className="qt-section">
          <div className="qt-welcome-banner">
            <div className="qt-welcome-copy">
              <span className="qt-eyebrow">
                YOUR DAILY WORKSPACE
              </span>

              <Title level={2}>
                Welcome back,{" "}
                {user?.fullName?.trim().split(/\s+/)[0] || "there"}! 👋
              </Title>

              <Text className="qt-welcome-description">
                Every small task completed is a step forward.
                Let's make today productive.
              </Text>
            </div>

            <div className="qt-welcome-art" aria-hidden="true">
              <div className="qt-art-circle">
                <span>✓</span>
                <span>✓</span>
                <span>○</span>
              </div>

              <span className="qt-art-sparkle">✦</span>
            </div>
          </div>

          {loading ? (
            <div className="qt-loading">
              <Spin size="large" />
              <Text type="secondary">
                Loading your dashboard...
              </Text>
            </div>
          ) : (
            <Dashboard tasks={tasks} />
          )}
        </div>
      )}

      {/* MY TASKS ROUTE */}
      {location.pathname === "/tasks" && (
        <div className="qt-section">
          <div className="qt-section-heading">
            <Title level={2}>My Tasks</Title>

            <Text type="secondary">
              View and manage all your tasks in one place.
            </Text>
          </div>

          <div style={{ marginTop: 24 }}>
            {loading ? (
              <div className="qt-loading">
                <Spin size="large" />
                <Text type="secondary">Loading tasks...</Text>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleTask={toggleTask}
                onDeleteTask={removeTask}
              />
            )}
          </div>
        </div>
      )}

      {/* ADD TASK ROUTE */}
      {location.pathname === "/tasks/new" && (
        <div className="qt-section">
          <div className="qt-section-heading">
            <Title level={2}>Add New Task</Title>

            <Text type="secondary">
              What would you like to accomplish?
            </Text>
          </div>

          <Card
            className="qt-panel"
            style={{
              marginTop: 24,
              maxWidth: 700,
            }}
          >
            <TaskForm onAddTask={addTask} />
          </Card>
        </div>
      )}
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            localStorage.getItem("quicktask_token") ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            localStorage.getItem("quicktask_token") ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* My Tasks */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Add Task */}
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
