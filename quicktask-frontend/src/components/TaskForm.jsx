
import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Space,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const taskTitle = title.trim();

    if (!taskTitle) {
      message.warning("Please enter a task title.");
      return;
    }

    setSaving(true);

    try {
      await onAddTask(taskTitle);
      setTitle("");
      message.success("Task added successfully!");
    } catch (error) {
      message.error("Failed to add task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      size="small"
      title="Add a New Task"
      style={{ marginTop: 24 }}
    >
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="What do you need to do?"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleSubmit}
          disabled={saving}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleSubmit}
          loading={saving}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            border: "none",
            color: "#fff",
          }}
        >
          Add
        </Button>
      </Space.Compact>
    </Card>
  );
}

export default TaskForm;
