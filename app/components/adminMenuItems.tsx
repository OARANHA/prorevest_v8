import React from 'react';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiSettings,
  FiBarChart2,
  FiAlertCircle,
} from 'react-icons/fi/index.js';


export interface MenuItemBase {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export const baseMenuItems: MenuItemBase[] = [
  {
    icon: <FiHome />,
    label: 'Dashboard',
    href: '/admin',
  },
  {
    icon: <FiPackage />,
    label: 'Produtos',
    href: '/admin/produtos',
    subItems: [
      { label: 'Listar Produtos', href: '/admin/produtos' },
      { label: 'Adicionar Produto', href: '/admin/produtos/novo' },
      { label: 'Categorias', href: '/admin/produtos/categorias' },
    ],
  },
  {
    icon: <FiShoppingCart />,
    label: 'Pedidos',
    href: '/admin/pedidos',
    subItems: [
      { label: 'Todos os Pedidos', href: '/admin/pedidos' },
      { label: 'Pedidos Pendentes', href: '/admin/pedidos/pendentes' },
      { label: 'Pedidos Concluídos', href: '/admin/pedidos/concluidos' },
    ],
  },
  {
    icon: <FiUsers />,
    label: 'Clientes',
    href: '/admin/clientes',
  },
  {
    icon: <FiBarChart2 />,
    label: 'Relatórios',
    href: '/admin/relatorios',
    subItems: [
      { label: 'Vendas', href: '/admin/relatorios/vendas' },
      { label: 'Produtos', href: '/admin/relatorios/produtos' },
      { label: 'Clientes', href: '/admin/relatorios/clientes' },
    ],
  },
  {
    icon: <FiSettings />,
    label: 'Configurações',
    href: '/admin/configuracoes',
    subItems: [
      { label: 'Geral', href: '/admin/configuracoes' },
      { label: 'Usuários', href: '/admin/configuracoes/usuarios' },
      { label: 'Logo e Marca', href: '/admin/configuracoes/logo' },
    ],
  },
];