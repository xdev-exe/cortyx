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
      
      {/* Simplified routing: Assume 2-segment paths are module/doctype for document lists */}
      {/* This matches the old cortyx app where clicking on a doctype from the sidebar navigates to /app/Module/DocType */}
      
      {/* /app/Module/DocType/ID/edit */}
      <Route path="/app/:module/:doctype/:id/edit">
        {() => (
          <AppLayout>
            <DocumentForm />
          </AppLayout>
        )}
      </Route>
      
      {/* /app/Module/DocType/new */}
      <Route path="/app/:module/:doctype/new">
        {() => (
          <AppLayout>
            <DocumentForm />
          </AppLayout>
        )}
      </Route>
      
      {/* /app/Module/DocType/ID */}
      <Route path="/app/:module/:doctype/:id">
        {() => (
          <AppLayout>
            <DocumentDetail />
          </AppLayout>
        )}
      </Route>
      
      {/* /app/Module/DocType - Document list */}
      <Route path="/app/:module/:doctype">
        {() => (
          <AppLayout>
            <DocumentList />
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
