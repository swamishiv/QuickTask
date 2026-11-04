
import {
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  const columns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isCompleted ? "success" : "processing"}>
          {record.isCompleted ? "Completed" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type={record.isCompleted ? "default" : "primary"}
            onClick={() => onToggleTask(record.id)}
             style={{
                background: record.isCompleted
                    ? "#ffffff"
                    : "linear-gradient(135deg, #4f46e5, #9333ea)",
                color: record.isCompleted ? "#4f46e5" : "#ffffff",
                border: record.isCompleted
                    ? "1px solid #4f46e5"
                    : "none",
                }}
          >
            {record.isCompleted ? "Undo" : "Complete"}
          </Button>

          <Popconfirm
            title="Delete this task?"
            onConfirm={() => onDeleteTask(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="My Tasks"
      size="small"
      style={{ marginTop: 16 }}
      styles={{ body: { padding: 12 } }}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tasks}
        size="small"
        pagination={false}
        scroll={{ y: 200, x: 500 }}
        locale={{
          emptyText: "No tasks yet. Add your first task!",
        }}
      />
    </Card>
  );
}

export default TaskList;
