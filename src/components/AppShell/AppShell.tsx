import { Button, Card, Divider, Flex, Layout, Space, Tag, Typography } from "antd";
import type { ReactNode } from "react";
import type { ShellSection, ThemeMode } from "../../types/app-shell";

const { Header, Sider, Content } = Layout;

type AppShellProps = {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  sections: ShellSection[];
  activeSectionKey: string;
  onSectionChange: (key: string) => void;
  children?: ReactNode;
};

function AppShell({
  themeMode,
  onThemeModeChange,
  sections,
  activeSectionKey,
  onSectionChange,
  children,
}: AppShellProps) {
  return (
    <Layout className="min-h-screen bg-transparent text-[color:var(--app-text-primary)]">
      <Header className="!h-auto !px-6 !py-4 !bg-transparent">
        <div className="app-shell-surface flex items-center justify-between gap-4 rounded-[var(--app-radius-lg)] px-5 py-4">
          <div className="min-w-0">
            <Space size={10} wrap>
              <Tag color="cyan" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
                APIMAN
              </Tag>
              <Tag className="!m-0 !rounded-full !border-0 !px-3 !py-1" color="default">
                Desktop Shell
              </Tag>
            </Space>
            <Typography.Title level={4} className="!mt-3 !mb-1 !text-[color:var(--app-text-primary)]">
              API 管理工具基础壳
            </Typography.Title>
            <Typography.Text className="!text-[color:var(--app-text-tertiary)]">
              先完成工程基础层，再逐步叠加路由、数据和业务模块。
            </Typography.Text>
          </div>

          <Space wrap>
            <Button
              className="!border-[color:var(--app-border-strong)]"
              onClick={() => onThemeModeChange(themeMode === "dark" ? "light" : "dark")}
            >
              切换到{themeMode === "dark" ? "白天" : "夜间"}模式
            </Button>
          </Space>
        </div>
      </Header>

      <Layout className="px-6 pb-6">
        <Sider
          width={280}
          className="!mr-6 !overflow-hidden !bg-transparent"
          theme="light"
        >
          <div className="app-shell-surface flex h-full flex-col rounded-[var(--app-radius-lg)] p-4">
            <div className="mb-4">
              <Typography.Text className="text-xs uppercase tracking-[0.24em] text-[color:var(--app-text-tertiary)]">
                Workspace
              </Typography.Text>
              <Typography.Title level={5} className="!mt-2 !mb-0 !text-[color:var(--app-text-primary)]">
                模块导航
              </Typography.Title>
            </div>

            <div className="space-y-2">
              {sections.map((section) => {
                const active = section.key === activeSectionKey;

                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => onSectionChange(section.key)}
                    className={[
                      "w-full rounded-[var(--app-radius-md)] border px-4 py-3 text-left transition",
                      active
                        ? "border-[color:var(--app-accent-strong)] bg-[color:var(--app-accent-soft)]"
                        : "border-transparent bg-transparent hover:border-[color:var(--app-border-subtle)] hover:bg-[color:var(--app-bg-muted)]",
                    ].join(" ")}
                  >
                    <Flex justify="space-between" align="center" gap={12}>
                      <div className="min-w-0">
                        <div className="font-medium text-[color:var(--app-text-primary)]">
                          {section.label}
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--app-text-tertiary)]">
                          {section.description}
                        </div>
                      </div>
                      {section.badge ? (
                        <Tag color="blue" className="!m-0 !rounded-full !border-0">
                          {section.badge}
                        </Tag>
                      ) : null}
                    </Flex>
                  </button>
                );
              })}
            </div>

            <Divider className="!my-5 !border-[color:var(--app-border-subtle)]" />

            <Card
              className="app-shell-muted !border-0"
              styles={{ body: { padding: "16px" } }}
            >
              <Typography.Text className="block text-xs uppercase tracking-[0.2em] text-[color:var(--app-text-tertiary)]">
                Next
              </Typography.Text>
              <Typography.Paragraph className="!mb-0 !mt-2 !text-sm !text-[color:var(--app-text-secondary)]">
                路由、项目列表和详情页会在后续子模块里逐步接入。
              </Typography.Paragraph>
            </Card>
          </div>
        </Sider>

        <Content className="min-w-0">
          <div className="app-shell-elevated flex min-h-[calc(100vh-136px)] flex-col rounded-[var(--app-radius-lg)] p-6">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppShell;
