import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { Link, useRouteContext } from "@tanstack/react-router"
import { LayoutDashboard } from "lucide-react"
import { NavUser } from "./nav-user"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]
 
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { trpc } = useRouteContext({ from: '/_app' })
  const userQuery = useQuery(trpc.user.get.queryOptions(undefined, {
    staleTime: Infinity
  }))

  const user = userQuery.data

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/" className="hover:bg-transparent">
                <img src="/logo-dark.png" alt="LicenseBee" className="max-h-8" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupContent>
            <SidebarMenu>
            {sidebarLinks.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton className="w-full" tooltip={link.label} asChild>
                <Link to={link.to} className="w-full gap-0 px-0 mx-0">
                {({ isActive }) => (
                  <span className={cn(
                    "flex items-center gap-2 w-full p-2 rounded-md ",
                    isActive && "bg-slate-800/90 text-primary-foreground hover:bg-slate-500/90"
                  )}>
                    {link.icon && <link.icon />}
                    <span>{link.label}</span>
                  </span>
                )}
                </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
      <SidebarFooter >
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}