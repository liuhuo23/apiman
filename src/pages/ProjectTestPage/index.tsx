import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";

function ProjectTestPage() {
  return (
    <Space direction="vertical" size={20} className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Tag color="green" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
            测试页
          </Tag>
          <Typography.Title level={3} className="!mb-1 !mt-3 !text-[color:var(--app-text-primary)]">
            接口测试占位页
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
            后续这里会接入请求参数、响应结果和执行状态展示。当前只预留布局骨架。
          </Typography.Paragraph>
        </div>

        <Button type="primary" icon={<PlayCircleOutlined />}>
          预留执行动作
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="app-shell-surface border-0" styles={{ body: { padding: 20 } }}>
            <Typography.Title level={5} className="!mb-2 !mt-0 !text-[color:var(--app-text-primary)]">
              请求配置
            </Typography.Title>
            <div className="rounded-[var(--app-radius-md)] border border-dashed border-[color:var(--app-border-strong)] bg-[color:var(--app-bg-muted)] px-4 py-10 text-center text-[color:var(--app-text-tertiary)]">
              请求参数预留区
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="app-shell-surface border-0" styles={{ body: { padding: 20 } }}>
            <Typography.Title level={5} className="!mb-2 !mt-0 !text-[color:var(--app-text-primary)]">
              响应结果
            </Typography.Title>
            <div className="rounded-[var(--app-radius-md)] border border-dashed border-[color:var(--app-border-strong)] bg-[color:var(--app-bg-muted)] px-4 py-10 text-center text-[color:var(--app-text-tertiary)]">
              响应展示预留区
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export default ProjectTestPage;
