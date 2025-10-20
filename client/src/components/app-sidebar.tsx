import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Brain, ChevronRight, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { type Module } from "@shared/schema";
import { useState } from "react";

export function AppSidebar() {
  const [location] = useLocation();
  const { data: modules, isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const [openModules, setOpenModules] = useState<Set<string>>(new Set(["Accounts", "CRM", "Stock"]));

  const toggleModule = (moduleName: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleName)) {
        next.delete(moduleName);
      } else {
        next.add(moduleName);
      }
      return next;
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2" data-testid="sidebar-header">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-display font-semibold text-lg">Cortex</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground" data-testid="sidebar-loading">
                Loading...
              </div>
            ) : (
              <SidebarMenu>
                {modules?.map((module) => {
                  const isOpen = openModules.has(module.moduleName);
                  return (
                    <Collapsible
                      key={module.moduleName}
                      open={isOpen}
                      onOpenChange={() => toggleModule(module.moduleName)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full"
                            data-testid={`button-module-${module.moduleName.toLowerCase()}`}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-medium">{module.moduleName}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {module.docTypeNames.map((docType) => {
                              const isActive = location.includes(`/app/${docType}`);
                              return (
                                <SidebarMenuSubItem key={docType}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActive}
                                    data-testid={`link-doctype-${docType.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <Link href={`/app/${docType}`}>
                                      <span>{docType}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
