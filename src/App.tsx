import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pt/conteudo/:slug" element={<Placeholder />} />
          <Route path="/en/content/:slug" element={<Placeholder />} />
          <Route path="/quiz/geral" element={<Placeholder />} />
          <Route path="/quiz/:slug" element={<Placeholder />} />
          <Route path="/resultado/:id" element={<Placeholder />} />
          <Route path="/dashboard" element={<Placeholder />} />
          <Route path="/categorias" element={<Placeholder />} />
          <Route path="/categoria/:slug" element={<Placeholder />} />
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
  </QueryClientProvider>
);

export default App;
