import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import Placeholder from "./pages/Placeholder";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pt/conteudo/:slug" element={<PostPage />} />
            <Route path="/en/content/:slug" element={<PostPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/quiz/geral" element={<QuizPage />} />
            <Route path="/quiz/:slug" element={<QuizPage />} />
            <Route path="/resultado/:id" element={<ResultPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/videos" element={<Placeholder />} />
            <Route path="/pro" element={<Placeholder />} />
            <Route path="/sobre" element={<Placeholder />} />
            <Route path="/conta" element={<Placeholder />} />
            <Route path="/termos" element={<Placeholder />} />
            <Route path="/privacidade" element={<Placeholder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
