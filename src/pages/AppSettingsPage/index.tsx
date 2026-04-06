import { CloudSyncOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Radio, Row, Space, Tag, Typography, message } from "antd";
import { useAppPreferences } from "../../stores/appPreferences";
import type { CommandMode, ThemeMode } from "../../types/app-settings";
import { applyAppPreferences } from "../../utils/preferences";

function AppSettingsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { themeMode, commandMode, setThemeMode, setCommandMode } = useAppPreferences();

  const handleThemeChange = (nextTheme: ThemeMode) => {
    setThemeMode(nextTheme);
    messageApi.success(`主题已切换为${nextTheme === "dark" ? "夜间" : "白天"}模式`);
  };

  const handleCommandModeChange = (nextMode: CommandMode) => {
    setCommandMode(nextMode);
    messageApi.success(`命令模式已切换为${nextMode === "command" ? "命令模式" : "标准模式"}`);
  };

  return (
    <Space direction="vertical" size={20} className="w-full">
      {contextHolder}

      <div>
        <Tag color="gold" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
          应用设置
        </Tag>
        <Typography.Title level={2} className="!mb-2 !mt-3 !text-[color:var(--app-text-primary)]">
          应用级偏好
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 !max-w-3xl !text-base !text-[color:var(--app-text-secondary)]">
          这里管理和项目无关的桌面应用偏好，包括主题模式和命令模式。
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="app-surface border-0" styles={{ body: { padding: 20 } }}>
            <Space direction="vertical" size={16} className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[color:var(--app-text-primary)]">
                    <SettingOutlined />
                    <Typography.Title level={4} className="!mb-0 !mt-0 !text-[color:var(--app-text-primary)]">
                      主题模式
                    </Typography.Title>
                  </div>
                  <Typography.Paragraph className="!mb-0 !mt-2 !text-[color:var(--app-text-secondary)]">
                    明暗主题切换只在这里提供，不放在全局头部或壳层。
                  </Typography.Paragraph>
                </div>

                <Tag color={themeMode === "dark" ? "blue" : "green"} className="!m-0 !rounded-full !border-0">
                  {themeMode === "dark" ? "夜间" : "白天"}
                </Tag>
              </div>

              <Radio.Group
                value={themeMode}
                onChange={(event) => handleThemeChange(event.target.value)}
                className="grid gap-3 sm:grid-cols-2"
              >
                <Radio.Button value="dark" className="!h-auto !rounded-[var(--app-radius-md)] !px-4 !py-3">
                  夜间模式
                </Radio.Button>
                <Radio.Button value="light" className="!h-auto !rounded-[var(--app-radius-md)] !px-4 !py-3">
                  白天模式
                </Radio.Button>
              </Radio.Group>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="app-surface border-0" styles={{ body: { padding: 20 } }}>
            <Space direction="vertical" size={16} className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[color:var(--app-text-primary)]">
                    <CloudSyncOutlined />
                    <Typography.Title level={4} className="!mb-0 !mt-0 !text-[color:var(--app-text-primary)]">
                      命令模式
                    </Typography.Title>
                  </div>
                  <Typography.Paragraph className="!mb-0 !mt-2 !text-[color:var(--app-text-secondary)]">
                    命令模式用于控制桌面应用的交互工作方式，后续可扩展为不同执行策略。
                  </Typography.Paragraph>
                </div>

                <Tag color={commandMode === "command" ? "blue" : "default"} className="!m-0 !rounded-full !border-0">
                  {commandMode === "command" ? "命令模式" : "标准模式"}
                </Tag>
              </div>

              <Radio.Group
                value={commandMode}
                onChange={(event) => handleCommandModeChange(event.target.value)}
                className="grid gap-3 sm:grid-cols-2"
              >
                <Radio.Button value="standard" className="!h-auto !rounded-[var(--app-radius-md)] !px-4 !py-3">
                  标准模式
                </Radio.Button>
                <Radio.Button value="command" className="!h-auto !rounded-[var(--app-radius-md)] !px-4 !py-3">
                  命令模式
                </Radio.Button>
              </Radio.Group>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="app-surface border-0" styles={{ body: { padding: 20 } }}>
        <Typography.Title level={5} className="!mb-2 !mt-0 !text-[color:var(--app-text-primary)]">
          保存说明
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 !text-[color:var(--app-text-secondary)]">
          设置会立即应用到当前桌面会话，并保存到本地配置，后续启动时会自动恢复。
        </Typography.Paragraph>
        <Divider className="!my-4 !border-[color:var(--app-border-subtle)]" />
        <Button
          onClick={() => {
            applyAppPreferences({ themeMode, commandMode });
            messageApi.success("当前设置已同步");
          }}
        >
          重新应用当前设置
        </Button>
      </Card>
    </Space>
  );
}

export default AppSettingsPage;
