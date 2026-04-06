import { FileTextOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Space, Tag, Typography } from "antd";

function ProjectDocsPage() {
  return (
    <Space direction="vertical" size={20} className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Tag color="cyan" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
            文档页
          </Tag>
          <Typography.Title level={3} className="!mb-1 !mt-3 !text-[color:var(--app-text-primary)]">
            接口文档占位页
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
            后续这里会接入手动编辑和 OpenAPI 解析。当前先保留结构和视觉分区。
          </Typography.Paragraph>
        </div>

        <Button icon={<FileTextOutlined />}>预留文档动作</Button>
      </div>

      <Card className="app-shell-muted border-0" styles={{ body: { padding: 20 } }}>
        <Typography.Title level={5} className="!mb-2 !mt-0 !text-[color:var(--app-text-primary)]">
          文档结构
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
          当前仅提供文档内容容器、标题区和操作入口占位，不执行任何解析或保存。
        </Typography.Paragraph>
      </Card>

      <Divider className="!my-0 !border-[color:var(--app-border-subtle)]" />

      <Card className="app-shell-surface border-0" styles={{ body: { padding: 20 } }}>
        <Typography.Title level={5} className="!mb-3 !mt-0 !text-[color:var(--app-text-primary)]">
          文档内容区域
        </Typography.Title>
        <div className="rounded-[var(--app-radius-md)] border border-dashed border-[color:var(--app-border-strong)] bg-[color:var(--app-bg-muted)] px-4 py-10 text-center text-[color:var(--app-text-tertiary)]">
          文档内容预留区
        </div>
      </Card>
    </Space>
  );
}

export default ProjectDocsPage;
