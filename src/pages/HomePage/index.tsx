import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileAddOutlined,
  LinkOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { UploadProps } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectDocsPath } from "../../router/paths";

type ImportMode = "url" | "file" | "skip";

type ProjectCardData = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const initialProjects: ProjectCardData[] = [
  {
    id: "sample-project",
    name: "Sample Project",
    createdAt: "2026-04-01 09:12",
    updatedAt: "2026-04-06 10:20",
  },
  {
    id: "gateway-service",
    name: "Gateway Service",
    createdAt: "2026-03-29 15:41",
    updatedAt: "2026-04-05 18:08",
  },
  {
    id: "user-center",
    name: "User Center",
    createdAt: "2026-03-21 08:30",
    updatedAt: "2026-04-04 12:55",
  },
  {
    id: "billing-platform",
    name: "Billing Platform",
    createdAt: "2026-03-18 14:06",
    updatedAt: "2026-04-03 09:33",
  },
];

const importModeOptions: { label: string; value: ImportMode; description: string }[] = [
  {
    label: "URL 导入",
    value: "url",
    description: "通过 Swagger / OpenAPI 地址导入",
  },
  {
    label: "文件上传",
    value: "file",
    description: "上传 openapi.json 或 yaml 文件",
  },
  {
    label: "跳过导入",
    value: "skip",
    description: "直接创建空项目",
  },
];

type CreateFormValues = {
  name: string;
  url?: string;
};

function nowLabel() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date())
    .replace(/\//g, "-");
}

function HomePage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("url");
  const [submitting, setSubmitting] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [createForm] = Form.useForm<CreateFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const selectedCount = selectedIds.length;

  const selectedProjectMap = useMemo(() => new Set(selectedIds), [selectedIds]);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setImportMode("url");
    setUploadedFileName(null);
    setUploadKey((current) => current + 1);
    createForm.resetFields();
  };

  const handleCardClick = (projectId: string) => {
    navigate(projectDocsPath(projectId));
  };

  const toggleSelection = (projectId: string, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(projectId) ? current : [...current, projectId];
      }

      return current.filter((id) => id !== projectId);
    });
  };

  const handleDelete = (projectId: string) => {
    setProjects((current) => current.filter((item) => item.id !== projectId));
    setSelectedIds((current) => current.filter((id) => id !== projectId));
    messageApi.success("项目已删除");
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      messageApi.info("请先选择至少一个项目");
      return;
    }

    Modal.confirm({
      title: "批量删除项目",
      icon: <ExclamationCircleOutlined />,
      content: `确定删除已选择的 ${selectedIds.length} 个项目吗？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      centered: true,
      onOk: () => {
        setProjects((current) => current.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        messageApi.success("已删除所选项目");
      },
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? projects.map((item) => item.id) : []);
  };

  const handleCreate = async (values: CreateFormValues) => {
    setSubmitting(true);

    try {
      const projectName = values.name.trim();

      if (!projectName) {
        messageApi.error("请输入项目名称");
        return;
      }

      if (importMode === "url" && !values.url?.trim()) {
        messageApi.error("请输入 OpenAPI 地址");
        return;
      }

      if (importMode === "file" && !uploadedFileName) {
        messageApi.error("请先上传 openapi.json 或 yaml 文件");
        return;
      }

      const nextProject: ProjectCardData = {
        id: `${projectName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: projectName,
        createdAt: nowLabel(),
        updatedAt: nowLabel(),
      };

      setProjects((current) => [nextProject, ...current]);
      messageApi.success("项目已创建");
      closeCreateModal();
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload(file) {
      const lower = file.name.toLowerCase();
      const isValid =
        lower.endsWith(".json") ||
        lower.endsWith(".yaml") ||
        lower.endsWith(".yml");

      if (!isValid) {
        messageApi.error("仅支持 openapi.json、yaml 或 yml 文件");
        return Upload.LIST_IGNORE;
      }

      setUploadedFileName(file.name);
      messageApi.success(`已选择文件：${file.name}`);
      return false;
    },
    onRemove() {
      setUploadedFileName(null);
    },
    maxCount: 1,
    accept: ".json,.yaml,.yml",
  };

  return (
    <Space direction="vertical" size={20} className="w-full">
      {contextHolder}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Tag color="cyan" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
            主页
          </Tag>
          <Typography.Title level={2} className="!mb-2 !mt-3 !text-[color:var(--app-text-primary)]">
            API 项目列表
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !max-w-3xl !text-base !text-[color:var(--app-text-secondary)]">
            主页是应用入口，支持浏览项目、创建项目、多选项目和删除项目。点击任意项目 Card 可进入项目详情页。
          </Typography.Paragraph>
        </div>

        <Space wrap>
          <Button
            icon={<FileAddOutlined />}
            onClick={openCreateModal}
            type="primary"
          >
            新建项目
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => setSelectedIds([])}>
            清空选择
          </Button>
        </Space>
      </div>

      <Card className="app-surface border-0" styles={{ body: { padding: 24 } }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Typography.Title level={4} className="!mb-1 !mt-0 !text-[color:var(--app-text-primary)]">
              项目列表
            </Typography.Title>
            <Typography.Text className="!text-[color:var(--app-text-tertiary)]">
              每个项目以 Card 呈现，卡片右下角提供删除入口，支持多选后批量处理。
            </Typography.Text>
          </div>

          <Space wrap>
            <Button onClick={() => handleSelectAll(selectedCount !== projects.length)}>
              {selectedCount === projects.length ? "取消全选" : "全选"}
            </Button>
            <Button danger onClick={handleBatchDelete}>
              批量删除
            </Button>
          </Space>
        </div>

        <Divider className="!my-6 !border-[color:var(--app-border-subtle)]" />

        {projects.length === 0 ? (
          <Empty
            description="暂无项目，点击新建项目开始导入"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const selected = selectedProjectMap.has(project.id);

              return (
                <Card
                  key={project.id}
                  hoverable
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(project.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCardClick(project.id);
                    }
                  }}
                  className={[
                    "group relative overflow-hidden border-0 transition",
                    selected ? "app-surface-elevated ring-2 ring-[color:var(--app-accent-strong)]" : "app-surface",
                  ].join(" ")}
                  styles={{ body: { padding: 20 } }}
                >
                  <div className="absolute right-4 top-4">
                    <Checkbox
                      checked={selected}
                      onChange={(event: CheckboxChangeEvent) =>
                        toggleSelection(project.id, event.target.checked)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  </div>

                  <div className="flex min-h-[180px] flex-col justify-between gap-5 pr-6">
                    <div>
                      <Space size={8} wrap>
                        <Badge status={selected ? "processing" : "default"} text={selected ? "已选中" : "未选中"} />
                        <Tag color="blue" className="!m-0 !rounded-full !border-0">
                          Project
                        </Tag>
                      </Space>

                      <Typography.Title level={4} className="!mb-2 !mt-4 !text-[color:var(--app-text-primary)]">
                        {project.name}
                      </Typography.Title>

                      <div className="space-y-2 text-sm text-[color:var(--app-text-secondary)]">
                        <div>创建时间：{project.createdAt}</div>
                        <div>最新更新时间：{project.updatedAt}</div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <Typography.Text className="text-xs uppercase tracking-[0.22em] text-[color:var(--app-text-tertiary)]">
                        Click to open
                      </Typography.Text>

                      <Tooltip title="删除项目">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="!px-2"
                          onClick={(event) => {
                            event.stopPropagation();
                            Modal.confirm({
                              title: "删除项目",
                              icon: <ExclamationCircleOutlined />,
                              content: `确定删除项目「${project.name}」吗？`,
                              okText: "删除",
                              okButtonProps: { danger: true },
                              cancelText: "取消",
                              centered: true,
                              onOk: () => handleDelete(project.id),
                            });
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {selectedCount > 0 ? (
        <div className="app-surface-elevated sticky bottom-0 z-10 flex items-center justify-between gap-4 rounded-[var(--app-radius-lg)] px-5 py-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedCount === projects.length}
              indeterminate={selectedCount > 0 && selectedCount < projects.length}
              onChange={(event) => handleSelectAll(event.target.checked)}
            />
            <div>
              <div className="font-medium text-[color:var(--app-text-primary)]">
                已选择 {selectedCount} 个项目
              </div>
              <div className="text-sm text-[color:var(--app-text-tertiary)]">
                可执行批量删除
              </div>
            </div>
          </div>

          <Space>
            <Button onClick={() => setSelectedIds([])}>取消选择</Button>
            <Button danger onClick={handleBatchDelete}>
              批量删除
            </Button>
          </Space>
        </div>
      ) : null}

      <Modal
        key={uploadKey}
        open={isCreateOpen}
        onCancel={closeCreateModal}
        title="新建项目"
        centered
        width={760}
        destroyOnClose
        footer={null}
      >
        <Typography.Paragraph className="!mb-4 !text-[color:var(--app-text-secondary)]">
          支持 URL 导入、文件上传导入和跳过导入三种方式。
        </Typography.Paragraph>

        <Radio.Group
          value={importMode}
          onChange={(event) => setImportMode(event.target.value)}
          className="mb-4 grid gap-3 sm:grid-cols-3"
        >
          {importModeOptions.map((option) => (
            <Radio.Button
              key={option.value}
              value={option.value}
              className="!h-auto !rounded-[var(--app-radius-md)] !border !border-[color:var(--app-border-subtle)] !px-4 !py-3"
            >
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="mt-1 text-xs text-[color:var(--app-text-tertiary)]">
                  {option.description}
                </div>
              </div>
            </Radio.Button>
          ))}
        </Radio.Group>

        <Form
          layout="vertical"
          form={createForm}
          initialValues={{ name: "", url: "" }}
          onFinish={handleCreate}
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="例如：User Center" />
          </Form.Item>

          {importMode === "url" ? (
            <Form.Item
              label="OpenAPI 地址"
              name="url"
              rules={[{ required: true, message: "请输入 OpenAPI 地址" }]}
            >
              <Input prefix={<LinkOutlined />} placeholder="https://example.com/openapi.json" />
            </Form.Item>
          ) : null}

          {importMode === "file" ? (
            <div>
              <Upload.Dragger {...uploadProps} className="!bg-[color:var(--app-bg-muted)]">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
                <p className="ant-upload-hint">仅支持 openapi.json、yaml 或 yml 文件</p>
              </Upload.Dragger>
              {uploadedFileName ? (
                <div className="mt-3 rounded-[var(--app-radius-md)] border border-[color:var(--app-border-subtle)] bg-[color:var(--app-bg-muted)] px-4 py-3 text-sm text-[color:var(--app-text-secondary)]">
                  当前已选择：{uploadedFileName}
                </div>
              ) : null}
            </div>
          ) : null}

          {importMode === "skip" ? (
            <div className="rounded-[var(--app-radius-md)] border border-dashed border-[color:var(--app-border-strong)] bg-[color:var(--app-bg-muted)] px-4 py-4 text-[color:var(--app-text-secondary)]">
              选择跳过导入后，将直接创建一个空项目，后续可再补充文档内容。
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button onClick={closeCreateModal}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              创建项目
            </Button>
          </div>
        </Form>
      </Modal>
    </Space>
  );
}

export default HomePage;
