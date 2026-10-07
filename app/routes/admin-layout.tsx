import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { AdminHeader } from "../components/AdminHeader";
import AdminSidebarSimple from "../components/AdminSidebarSimple";
import {
  HomeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  SwatchIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  BeakerIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  KeyIcon,
  EnvelopeIcon,
  BookOpenIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  MapIcon,
  CalculatorIcon,
  PaintBrushIcon,
  PuzzlePieceIcon,
  BellIcon,
  CodeBracketIcon,
  CircleStackIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  ServerIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard - Prorevest" },
    { name: "description", content: "Dashboard administrativo da Prorevest" },
  ];
}

const navSections = [
  {
    title: "Gestão",
    links: [
      { to: "/admin", label: "Visão Geral", icon: HomeIcon },
      { to: "/admin/products", label: "Produtos", icon: ShoppingBagIcon },
      { to: "/admin/colors", label: "Cores", icon: SwatchIcon },
      { to: "/admin/textures", label: "Texturas", icon: PaintBrushIcon },
      { to: "/admin/quotes", label: "Orçamentos", icon: CurrencyDollarIcon },
      { to: "/admin/users", label: "Usuários", icon: UsersIcon },
      { to: "/admin/blog-posts", label: "Blog e Projetos", icon: BookOpenIcon },
    ],
  },
  {
    title: "Análises",
    links: [
      { to: "/admin/reports", label: "Relatórios", icon: ChartBarIcon },
      { to: "/admin/intelligent-reports", label: "Relatórios Inteligentes", icon: SparklesIcon },
      { to: "/admin/production-reports", label: "Relatórios de Produção", icon: BeakerIcon },
      { to: "/admin/region-heatmap", label: "Mapa de Calor Regional", icon: MapIcon },
    ],
  },
  {
    title: "Automação e Ferramentas",
    links: [
      { to: "/admin/dosage-machines", label: "Máquinas de Dosagem", icon: CogIcon },
      { to: "/admin/dosage-formulas", label: "Fórmulas de Dosagem", icon: DocumentTextIcon },
      { to: "/admin/tinting-machines", label: "Máquinas de Tintura", icon: PaintBrushIcon },
      { to: "/admin/predictive-alerts", label: "Alertas Preditivos", icon: BellIcon },
      { to: "/admin/email-templates", label: "Templates de E-mail", icon: EnvelopeIcon },
      { to: "/admin/schedule-emails", label: "Agendar E-mails", icon: BellIcon },
      { to: "/admin/magic-calculator", label: "Calculadora Mágica", icon: CalculatorIcon },
      { to: "/admin/ai-color-assistant", label: "Assistente de Cor IA", icon: SparklesIcon },
    ],
  },
  {
    title: "Conteúdo e Templates",
    links: [
      { to: "/admin/quote-templates", label: "Templates de Orçamento", icon: ArchiveBoxIcon },
      { to: "/admin/dynamic-templates", label: "Templates Dinâmicos", icon: PuzzlePieceIcon },
      { to: "/admin/gamification", label: "Gamificação", icon: PuzzlePieceIcon },
    ],
  },
  {
    title: "Sistema",
    links: [
      { to: "/admin/technical-config", label: "Configurações Técnicas", icon: CogIcon },
      { to: "/admin/logo-settings", label: "Logotipo", icon: CogIcon },
      { to: "/admin/system-logs", label: "Logs do Sistema", icon: CommandLineIcon },
      { to: "/admin/backup-lgpd", label: "Backup e LGPD", icon: ShieldCheckIcon },
      { to: "/admin/api-webhooks", label: "API e Webhooks", icon: CodeBracketIcon },
      { to: "/admin/cloud-storage", label: "Armazenamento", icon: ServerIcon },
      { to: "/admin/ci-cd", label: "CI/CD", icon: CircleStackIcon },
      { to: "/admin/final-testing", label: "Testes Finais", icon: ClipboardDocumentCheckIcon },
    ],
  },
];

import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const AdminNavLink = ({ to, icon: Icon, children, collapsed }: { to: string; icon: React.ElementType; children: React.ReactNode; collapsed: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-slate-700 text-white shadow-lg shadow-purple-500/20"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span className="font-medium">{children}</span>}
    </Link>
  );
};

export default function AdminDashboard() {
  const { user, isAdmin, signOut } = useAuth(); // Adicionado isAdmin
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // A verificação de administrador agora é feita no contexto de autenticação
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-background">
        <svg className="animate-spin h-8 w-8 text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Verificar se o usuário é administrador usando o contexto de autenticação
  console.log("Verificando acesso administrativo:", { user, isAdmin });

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-background p-4">
        <div className="text-center bg-dark-card p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-cormorant font-bold text-destructive mb-4">Acesso Restrito</h2>
          <p className="text-dark-muted-foreground mb-8">Você não tem permissão para acessar esta área.</p>
          <Link to="/" className="bg-dark-primary text-dark-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-dark-primary/90 transition-all duration-300 transform hover:scale-105">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 admin-route">
      <div className="flex">
        {/* Nova Sidebar com base em permissões */}
        <AdminSidebarSimple />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="p-6 flex-1 bg-slate-900">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
