import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Palette,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Package,
  PenTool
} from "lucide-react";
import { useState } from "react";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../contexts/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  children?: NavItem[];
}

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Verificar se o usuário é admin
  const isAdmin = user?.role === 'admin';
  
  // Debug logs
  console.log("AdminSidebar - User:", user);
  console.log("AdminSidebar - isAdmin:", isAdmin);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const navigation: NavItem[] = [
    {
      name: "Painel",
      href: "/admin",
      icon: LayoutDashboard,
      permission: "view_dashboard"
    },
    {
      name: "Produtos",
      href: "/admin/products",
      icon: Palette,
      permission: "view_products",
      children: [
        {
          name: "Gerenciar Produtos",
          href: "/admin/products",
          icon: Package,
          permission: "view_products"
        },
        {
          name: "Cores",
          href: "/admin/colors",
          icon: PenTool,
          permission: "view_products"
        }
      ]
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: Users,
      permission: "view_users"
    },
    {
      name: "Blog",
      href: "/admin/blog-posts",
      icon: FileText,
      permission: "view_blog",
      children: [
        {
          name: "Posts",
          href: "/admin/blog-posts",
          icon: FileText,
          permission: "view_blog"
        }
      ]
    },
    {
      name: "Orçamentos",
      href: "/admin/quotes",
      icon: FileText,
      permission: "view_quotes"
    },
    {
      name: "Relatórios",
      href: "/admin/reports",
      icon: BarChart3,
      permission: "view_reports"
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: Settings,
      permission: "view_settings"
    }
  ];

  // Filtrar itens de navegação com base nas permissões
  const filteredNavigation = navigation.filter(item => {
    // Admins veem todos os itens
    if (isAdmin) return true;
    // Para não-admins, mostrar apenas itens sem permissão específica por enquanto
    if (!item.permission) return true;
    // TODO: Implementar verificação de permissões quando o sistema estiver funcionando
    return false;
  });
  
  console.log("AdminSidebar - filteredNavigation:", filteredNavigation);
  console.log("AdminSidebar - navigation length:", navigation.length);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const isChildActive = (children: NavItem[]) => {
    return children.some(child => child.href && location.pathname && location.pathname.startsWith(child.href));
  };

  return (
    <div className="w-64 bg-gray-900 h-screen sticky top-0 border-r border-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">ProRevest Admin</h2>
      </div>
      
      <nav className="px-2 pb-4">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const active = isActive(item.href);
            const childActive = hasChildren ? isChildActive(item.children!) : false;

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active || childActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {isExpanded && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.children!.map((child) => (
                          <li key={child.name}>
                            <Link
                              to={child.href}
                              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                location.pathname === child.href
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              <child.icon className="mr-3 h-4 w-4" />
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;