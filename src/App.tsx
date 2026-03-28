import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n/I18nContext";
import LocaleLayout from "@/components/LocaleLayout";
import LocaleRedirect from "@/components/LocaleRedirect";
import Index from "./pages/Index";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import Placeholder from "./pages/Placeholder";
import ProPage from "./pages/ProPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Root redirect to locale */}
              <Route path="/" element={<LocaleRedirect />} />

              {/* Legacy routes redirect */}
              <Route path="/quiz/:slug" element={<LocaleRedirect />} />
              <Route path="/categorias" element={<LocaleRedirect />} />
              <Route path="/dashboard" element={<LocaleRedirect />} />
              <Route path="/login" element={<LocaleRedirect />} />

              {/* Locale-prefixed routes */}
              <Route path="/:lang" element={<LocaleLayout />}>
                <Route index element={<Index />} />
                <Route path="conteudo/:slug" element={<PostPage />} />
                <Route path="content/:slug" element={<PostPage />} />
                <Route path="categorias" element={<CategoriesPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categoria/:slug" element={<CategoryPage />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="quiz/:slug" element={<QuizPage />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="resultado/:id" element={<ResultPage />} />
                <Route path="result/:id" element={<ResultPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="videos" element={<Placeholder />} />
                <Route path="pro" element={<ProPage />} />
                <Route path="sobre" element={<Placeholder />} />
                <Route path="about" element={<Placeholder />} />
                <Route path="conta" element={<Placeholder />} />
                <Route path="account" element={<Placeholder />} />
                <Route path="termos" element={<Placeholder />} />
                <Route path="terms" element={<Placeholder />} />
                <Route path="privacidade" element={<Placeholder />} />
                <Route path="privacy" element={<Placeholder />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
