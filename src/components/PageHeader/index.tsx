import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  showBack?: boolean;
  backText?: string;
  backTo?: string;
  actions?: ReactNode;
};

function PageHeader({
  title,
  description,
  showBack = true,
  backText = "返回主页",
  backTo = "/",
  actions,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <Space align="start" size={12}>
        {showBack ? (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!px-0 !text-[color:var(--app-text-primary)]"
            onClick={() => navigate(backTo)}
          >
            {backText}
          </Button>
        ) : null}

        <div className="flex items-start gap-3">
          <Typography.Text className="!text-base !font-normal !leading-8 !text-[color:var(--app-text-primary)]">
            {title}
          </Typography.Text>
          {description ? (
            <Tooltip title={description} placement="bottomLeft">
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                aria-label={typeof description === "string" ? description : "页面说明"}
                className="!mt-0.5 !px-0 !text-[color:var(--app-text-tertiary)]"
              />
            </Tooltip>
          ) : null}
        </div>
      </Space>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
