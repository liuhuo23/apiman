// Resolve appWindow in a way that avoids TypeScript export mismatches across @tauri-apps/api versions
import "./App.css";
import { Layout } from "antd";
import { MyHeader } from "./component/Header";
function App() {
  return (
    <Layout className="app-layout" style={{ minHeight: '100vh', background: 'var(--color-bg-container, #f5f5f5)' }}>
      <MyHeader />
      <Layout>
        <Layout.Sider
          className="app-side"
          width={69}
        >
        </Layout.Sider>
        <Layout.Content className="app-content">
          
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default App;
