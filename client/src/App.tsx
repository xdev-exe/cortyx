import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import AppLayout from "@/pages/app-layout";
import DocumentList from "@/pages/document-list";
import DocumentDetail from "@/pages/document-detail";
import DocumentForm from "@/pages/document-form";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      
      <Route path="/app/:doctype">
        {() => (
          <AppLayout>
            <DocumentList />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/:doctype/new">
        {() => (
          <AppLayout>
            <DocumentForm />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/:doctype/:id/edit">
        {() => (
          <AppLayout>
            <DocumentForm />
          </AppLayout>
        )}
      </Route>
      
      <Route path="/app/:doctype/:id">
        {() => (
          <AppLayout>
            <DocumentDetail />
          </AppLayout>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
