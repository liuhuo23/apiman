import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Checkbox, Modal, Space, Tag, Tooltip, Typography } from "antd";
import type { MouseEvent } from "react";
import type { ProjectSummary } from "../../types/project";

type ProjectCardProps = {
  project: ProjectSummary;
  selected: boolean;
  onOpen: (projectId: string) => void;
  onToggleSelect: (projectId: string, selected: boolean) => void;
  onDelete: (projectId: string) => void;
};

function ProjectCard({ project, selected, onOpen, onToggleSelect, onDelete }: ProjectCardProps) {
  const handleCardOpen = () => {
    onOpen(project.id);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    Modal.confirm({
      title: "删除项目",
      icon: <ExclamationCircleOutlined />,
      content: `确定删除项目「${project.name}」吗？`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      centered: true,
      onOk: () => {
        onDelete(project.id);
      },
    });
  };

  return (
    <Card
      hoverable
      role="button"
      tabIndex={0}
      onClick={handleCardOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardOpen();
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
          onChange={(event) => onToggleSelect(project.id, event.target.checked)}
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
              onClick={handleDeleteClick}
            />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;
