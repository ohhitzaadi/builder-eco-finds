import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import Sell from "@/pages/Sell";
import Dashboard from "@/pages/Dashboard";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Purchases from "@/pages/Purchases";
import TreesSavedPage from "@/pages/TreesSavedPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { AuthProvider, useAuth } from "@/state/auth";
import { ProductsProvider } from "@/state/products";
import { CartProvider } from "@/state/cart";
import { ThemeProvider } from "@/state/theme";

const queryClient = new QueryClient();

function WithCartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return <CartProvider userId={currentUser?.id ?? null}>{children}</CartProvider>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <WithCartProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/sell" element={<Sell />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/trees" element={<TreesSavedPage />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </WithCartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
