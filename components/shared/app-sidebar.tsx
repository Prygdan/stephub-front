import { ClockArrowUp, Home, List, LogOut, Menu, MessageCircle, SlackIcon, Truck } from "lucide-react"

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
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/hooks/use-auth"
import { Logo } from "./logo"

// Оновлений список
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Замовлення",
    url: "/admin/orders",
    icon: ClockArrowUp,
  },
  {
    title: "Товари",
    url: "/admin/products",
    icon: List,
  },
  {
    title: "Відгуки",
    url: "/admin/reviews",
    icon: MessageCircle,
  },
  {
    title: "Каруселі",
    url: "/admin/carousels",
    icon: List,
  },
  {
    title: "Меню",
    url: "/admin/categories",
    icon: Menu,
  },
  {
    title: "Сторінки",
    url: "/admin/pages",
    icon: Menu,
  },
  {
    title: "Фільтри",
    icon: SlackIcon,
    children: [
      { title: "Розміри", url: "/admin/sizes" },
      { title: "Бренди", url: "/admin/brands" },
      { title: "Сезони", url: "/admin/seasons" },
      { title: "Матеріали", url: "/admin/materials" },
    ],
  },
  {
    title: "Nova Poshta",
    icon: Truck,
    children: [
      { title: "API ключ", url: "/admin/nova-poshta/key" },
      { title: "Області", url: "/admin/nova-poshta/areas" },
      { title: "Міста", url: "/admin/nova-poshta/cities" },
      { title: "Відділення", url: "/admin/nova-poshta/branches" },
      { title: "Поштомати", url: "/admin/nova-poshta/postomates" },
    ],
  }
]

export function AppSidebar() {
  const {logout} = useAuth();

  return (
    <Sidebar className="z-50">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pt-2 pb-4 mb-2 border-b border-neutral-200">
            <Link href={'/admin'}>
              <Logo className="max-w-12 opacity-50" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                item.children ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.title}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.title}>
                            <Link href={child.url}>
                              {child.title}
                            </Link>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
              
              <SidebarMenuItem className="mt-3 pt-2 border-t border-neutral-200">
                <SidebarMenuButton onClick={() => {
                  if (window.confirm("Ви впевнені, що хочете вийти?")) {
                    logout()
                  }
                }}>
                  <LogOut className="mr-2 w-4 h-4" />
                  Вийти
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
