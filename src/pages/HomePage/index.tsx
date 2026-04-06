import { ArrowRightOutlined, AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Flex, List, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { projectDocsPath } from "../../router/paths";

const demoProjects = [
  {
    id: "sample-project",
    name: "Sample Project",
    description: "项目详情页与子路由布局示例",
    environmentCount: 2,
  },
  {
    id: "gateway-service",
    name: "Gateway Service",
    description: "多环境配置与接口测试入口示例",
    environmentCount: 3,
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size={20} className="w-full">
      <div>
        <Tag color="cyan" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
          主页
        </Tag>
        <Typography.Title level={2} className="!mb-2 !mt-3 !text-[color:var(--app-text-primary)]">
          API 项目入口
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 !max-w-3xl !text-base !text-[color:var(--app-text-secondary)]">
          当前页面只负责项目入口和跳转，占位内容会在后续子模块中替换为真实项目列表。
        </Typography.Paragraph>
      </div>

      <Card className="app-shell-surface border-0" styles={{ body: { padding: 24 } }}>
        <Flex justify="space-between" align="center" gap={16} wrap>
          <div>
            <Typography.Title level={4} className="!mb-1 !mt-0 !text-[color:var(--app-text-primary)]">
              可进入的项目
            </Typography.Title>
            <Typography.Text className="!text-[color:var(--app-text-tertiary)]">
              先保留项目入口，后续替换为本地文件读取结果。
            </Typography.Text>
          </div>

          <Space wrap>
            <Button icon={<AppstoreOutlined />}>刷新占位列表</Button>
            <Button icon={<SettingOutlined />} onClick={() => navigate("/settings")}>
              进入项目设置
            </Button>
          </Space>
        </Flex>

        <Divider className="!my-6 !border-[color:var(--app-border-subtle)]" />

        <List
          dataSource={demoProjects}
          renderItem={(project) => (
            <List.Item className="!px-0">
              <div className="flex w-full items-center justify-between gap-4 rounded-[var(--app-radius-md)] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-bg-muted)] px-4 py-4">
                <div>
                  <Typography.Title level={5} className="!mb-1 !mt-0 !text-[color:var(--app-text-primary)]">
                    {project.name}
                  </Typography.Title>
                  <Typography.Paragraph className="!mb-2 !text-[color:var(--app-text-secondary)]">
                    {project.description}
                  </Typography.Paragraph>
                  <Tag color="blue" className="!m-0 !rounded-full !border-0">
                    {project.environmentCount} environments
                  </Tag>
                </div>

                <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate(projectDocsPath(project.id))}>
                  进入详情
                </Button>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}

export default HomePage;
