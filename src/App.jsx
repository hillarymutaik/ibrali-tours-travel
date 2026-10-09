import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ContentProtection from "./components/ContentProtection";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProtection />
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;