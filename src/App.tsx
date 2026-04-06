import {
  ArrowRightOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Space, Tag, Typography } from "antd";

const stack = ["Tauri 2", "React", "TypeScript", "Vite", "Tailwind CSS", "Ant Design"];

const highlights = [
  {
    title: "Native shell, web speed",
    description: "Ship a desktop app that feels native while keeping the frontend iteration loop fast.",
    icon: ThunderboltOutlined,
  },
  {
    title: "Design system ready",
    description: "Ant Design handles structured UI; Tailwind shapes the page and spacing layer.",
    icon: AntDesignOutlined,
  },
  {
    title: "Desktop-first foundation",
    description: "Tauri v2 config, Rust entrypoints, and Vite build wiring are already in place.",
    icon: AppstoreOutlined,
  },
  {
    title: "Easy to extend",
    description: "Add windows, commands, plugins, or a richer backend without changing the scaffold.",
    icon: ToolOutlined,
  },
];

function App() {
  return (
    <main className="min-h-full overflow-hidden text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-200">
              Apiman starter
            </div>
            <Typography.Title level={2} className="!mb-2 !mt-0 !text-3xl !text-slate-50 sm:!text-4xl">
              Tauri 2.0 desktop shell with React, TSX, Ant Design, Vite, and Tailwind.
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !max-w-3xl !text-base !text-slate-300">
              This repository is initialized as a clean desktop foundation. The Rust side is wired for
              Tauri v2, while the frontend is ready for a component-driven app built on Ant Design and
              Tailwind CSS.
            </Typography.Paragraph>
          </div>

          <Space wrap size={[8, 8]}>
            {stack.map((item) => (
              <Tag key={item} color="cyan" className="!m-0 !rounded-full !border-0 !px-3 !py-1 !text-sm">
                {item}
              </Tag>
            ))}
          </Space>
        </header>

        <section className="relative flex-1 pt-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 rounded-[3rem] bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.24),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.16),transparent_20%),radial-gradient(circle_at_50%_90%,rgba(249,115,22,0.10),transparent_20%)] blur-3xl" />

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <Card
              className="border-white/10 bg-slate-950/70 shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur"
              styles={{
                body: { padding: "2rem" },
              }}
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <Typography.Title level={3} className="!mb-2 !mt-0 !text-2xl !text-white">
                    Project status
                  </Typography.Title>
                  <Typography.Text className="!text-slate-300">
                    A working scaffold is ready. Build out your feature modules from here.
                  </Typography.Text>
                </div>

                <Tag color="green" className="!m-0 !rounded-full !border-0 !px-3 !py-1">
                  Ready
                </Tag>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card
                      key={item.title}
                      className="border-white/10 bg-white/5"
                      styles={{ body: { padding: "1.25rem" } }}
                    >
                      <div className="mb-4 inline-flex rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                        <Icon />
                      </div>
                      <Typography.Title level={4} className="!mb-2 !mt-0 !text-lg !text-slate-50">
                        {item.title}
                      </Typography.Title>
                      <Typography.Paragraph className="!mb-0 !text-slate-300">
                        {item.description}
                      </Typography.Paragraph>
                    </Card>
                  );
                })}
              </div>

              <Divider className="!my-8 !border-white/10" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Typography.Title level={4} className="!mb-1 !mt-0 !text-white">
                    Next step
                  </Typography.Title>
                  <Typography.Text className="!text-slate-300">
                    Install dependencies, then start the dev environment with Tauri.
                  </Typography.Text>
                </div>

                <Space wrap>
                  <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                    Start building
                  </Button>
                  <Button size="large">Add your first screen</Button>
                </Space>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="border-white/10 bg-slate-950/70 backdrop-blur" styles={{ body: { padding: "1.5rem" } }}>
                <Typography.Title level={4} className="!mb-4 !mt-0 !text-white">
                  Scaffold checklist
                </Typography.Title>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>Frontend stack: React, TSX, Vite, Tailwind CSS, and Ant Design.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>Desktop shell: Tauri v2 Rust entrypoint, build script, and capability config.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>Build scripts: Vite dev server on port 5173 with Tauri-friendly dist output.</span>
                  </li>
                </ul>
              </Card>

              <Card className="border-white/10 bg-gradient-to-br from-sky-400/10 via-white/5 to-emerald-400/10 backdrop-blur" styles={{ body: { padding: "1.5rem" } }}>
                <Typography.Title level={4} className="!mb-3 !mt-0 !text-white">
                  Commands
                </Typography.Title>
                <div className="space-y-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-slate-200">
                    npm install
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-slate-200">
                    npm run tauri:dev
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-slate-200">
                    npm run tauri:build
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
