import type { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function Page({ children, className = "", contentClassName = "" }: PageProps) {
  const rootClassName = ["app-page", className].filter(Boolean).join(" ");
  const contentRootClassName = ["app-page__content", contentClassName].filter(Boolean).join(" ");

  return (
    <main className={rootClassName}>
      <div className={contentRootClassName}>{children}</div>
    </main>
  );
}

export default Page;
