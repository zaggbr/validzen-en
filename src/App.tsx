import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
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
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProPage from "./pages/ProPage";
import QuizPage from "./pages/QuizPage";
import QuizzesPage from "./pages/QuizzesPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/BackToTop";
import { initGA } from "@/lib/analytics";
import { useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Initialize GA4 if measurement ID is set
const gaId = import.meta.env.VITE_GA_ID;
if (gaId) initGA(gaId);

const CheckoutSuccessHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Assinatura confirmada! Bem-vindo ao ValidZen PRO.", {
        duration: 5000,
      });
      // Clean up URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("checkout");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <BrowserRouter>
            <CheckoutSuccessHandler />
            <ScrollToTop />
            <BackToTop />
            <Routes>
              {/* Root redirect to locale */}
              <Route path="/" element={<LocaleRedirect />} />

              {/* Legacy routes redirect */}
              <Route path="/quiz/:slug" element={<LocaleRedirect />} />
              <Route path="/quizzes" element={<LocaleRedirect />} />
              <Route path="/categorias" element={<LocaleRedirect />} />
              <Route path="/dashboard" element={<LocaleRedirect />} />
              <Route path="/login" element={<LocaleRedirect />} />
              <Route path="/paineladmin" element={<LocaleRedirect />} />
              <Route path="/admin" element={<Navigate to="/pt/paineladmin" replace />} />

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
                <Route path="quizzes" element={<QuizzesPage />} />
                <Route path="resultado/:id" element={<ResultPage />} />
                <Route path="result/:id" element={<ResultPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="videos" element={<Placeholder />} />
                <Route path="pro" element={<ProPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="conta" element={<Placeholder />} />
                <Route path="account" element={<Placeholder />} />
                <Route path="termos" element={<TermsPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacidade" element={<PrivacyPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route
                  path="admin"
                  element={<Navigate to="../paineladmin" replace />}
                />
                <Route
                  path="paineladmin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
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
