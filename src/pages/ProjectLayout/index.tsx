import { DatabaseOutlined, FileTextOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Card, Divider, Space, Tag, Typography } from "antd";
import { NavLink, Outlet, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { projectDocsPath, projectTestPath } from "../../router/paths";

function ProjectLayout() {
  const { projectId = "sample-project" } = useParams();

  const tabs = [
    {
      key: "docs",
      label: "文档",
      icon: FileTextOutlined,
      to: projectDocsPath(projectId),
      description: "接口说明与 OpenAPI 入口",
    },
    {
      key: "test",
      label: "测试",
      icon: PlayCircleOutlined,
      to: projectTestPath(projectId),
      description: "请求执行与响应查看",
    },
  ];

  return (
    <main className="page-screen p-6">
      <Space direction="vertical" size={20} className="w-full">
        <PageHeader
          title={`项目详情 · ${projectId}`}
          description="左侧用于项目内导航占位，后续会接入 API 树。"
        />

        <div className="grid min-h-0 gap-6 xl:grid-cols-[320px_1fr]">
          <Card className="app-surface border-0" styles={{ body: { padding: 20 } }}>
            <Space direction="vertical" size={16} className="w-full">
              <div>
                <Tag color="blue" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
                  项目详情
                </Tag>
                <Typography.Title level={4} className="!mb-2 !mt-3 !text-[color:var(--app-text-primary)]">
                  {projectId}
                </Typography.Title>
                <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
                  左侧用于项目内导航占位，后续会接入 API 树。
                </Typography.Paragraph>
              </div>

              <div className="rounded-[var(--app-radius-md)] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-bg-muted)] p-4">
                <div className="flex items-center gap-2 text-sm text-[color:var(--app-text-tertiary)]">
                  <DatabaseOutlined />
                  当前项目
                </div>
                <div className="mt-2 text-base font-medium text-[color:var(--app-text-primary)]">
                  {projectId}
                </div>
              </div>

              <Divider className="!my-0 !border-[color:var(--app-border-subtle)]" />

              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <NavLink
                      key={tab.key}
                      to={tab.to}
                      className={({ isActive }) =>
                        [
                          "block rounded-[var(--app-radius-md)] border px-4 py-3 transition",
                          isActive
                            ? "border-[color:var(--app-accent-strong)] bg-[color:var(--app-accent-soft)]"
                            : "border-transparent hover:border-[color:var(--app-border-subtle)] hover:bg-[color:var(--app-bg-muted)]",
                        ].join(" ")
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-[color:var(--app-accent)]">
                          <Icon />
                        </span>
                        <div>
                          <div className="font-medium text-[color:var(--app-text-primary)]">{tab.label}</div>
                          <div className="mt-1 text-sm text-[color:var(--app-text-tertiary)]">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </Space>
          </Card>

          <Card className="app-surface min-w-0 border-0" styles={{ body: { padding: 20 } }}>
            <Outlet />
          </Card>
        </div>
      </Space>
    </main>
  );
}

export default ProjectLayout;
