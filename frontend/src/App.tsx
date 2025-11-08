import { Kanban } from "@/components/kanban";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Kanban />
    </ThemeProvider>
  );
}

export default App;
