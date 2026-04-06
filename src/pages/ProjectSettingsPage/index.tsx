import { SettingOutlined } from "@ant-design/icons";
import { Card, Divider, Space, Tag, Typography } from "antd";

function ProjectSettingsPage() {
  return (
    <Space direction="vertical" size={20} className="w-full">
      <div>
        <Tag color="gold" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
          项目设置
        </Tag>
        <Typography.Title level={3} className="!mb-1 !mt-3 !text-[color:var(--app-text-primary)]">
          全局参数与环境配置
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
          当前只保留设置页结构，后续再按环境、请求和通用参数拆分表单区域。
        </Typography.Paragraph>
      </div>

      <Card className="app-shell-surface border-0" styles={{ body: { padding: 20 } }}>
        <div className="flex items-center gap-2 text-[color:var(--app-text-primary)]">
          <SettingOutlined />
          <Typography.Text className="!text-[color:var(--app-text-primary)]">
            设置页容器
          </Typography.Text>
        </div>
        <Divider className="!my-4 !border-[color:var(--app-border-subtle)]" />
        <div className="rounded-[var(--app-radius-md)] border border-dashed border-[color:var(--app-border-strong)] bg-[color:var(--app-bg-muted)] px-4 py-10 text-center text-[color:var(--app-text-tertiary)]">
          项目设置预留区
        </div>
      </Card>
    </Space>
  );
}

export default ProjectSettingsPage;
