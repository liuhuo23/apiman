import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = {
  title: string;
  description: string;
  showBack?: boolean;
};

function PageHeader({ title, description, showBack = true }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <Space align="start" size={12}>
        {showBack ? (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!px-0 !text-[color:var(--app-text-primary)]"
            onClick={() => navigate("/")}
          >
            返回主页
          </Button>
        ) : null}

        <div>
          <Typography.Title level={2} className="!mb-2 !mt-0 !text-[color:var(--app-text-primary)]">
            {title}
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !max-w-3xl !text-base !text-[color:var(--app-text-secondary)]">
            {description}
          </Typography.Paragraph>
        </div>
      </Space>
    </div>
  );
}

export default PageHeader;
