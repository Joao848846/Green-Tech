
import React from 'react';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const Icons = {
  Dashboard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.025h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  ),
  ChartBar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Upload: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  ),
  PlusCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CalendarDays: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  ),
  Cog: (props: React.SVGProps<SVGSVGElement>) => ( // Used for Instances and also Settings Module
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0112 4.5v1.5m0 12.5v-1.5a7.5 7.5 0 01-7.5-7.5H3m15-7.5H16.5a7.5 7.5 0 00-7.5 7.5v1.5m12.5-1.5a7.5 7.5 0 00-7.5-7.5H12m0 12.5a7.5 7.5 0 007.5-7.5H16.5M7.5 12a4.5 4.5 0 014.5-4.5m4.5 4.5a4.5 4.5 0 01-4.5 4.5M12 12a4.5 4.5 0 01-4.5-4.5m0 0A4.5 4.5 0 0012 12m0 0a4.5 4.5 0 004.5 4.5m0 0A4.5 4.5 0 0112 12" />
    </svg>
  ),
  Home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
  ),
  Trash: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.033 3.22.096M15 5.79H9m6 0V3.75M9 5.79V3.75m0 0A2.25 2.25 0 0111.25 1.5h1.5A2.25 2.25 0 0115 3.75v2.04" />
    </svg>
  ),
   Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  PaperAirplane: (props: React.SVGProps<SVGSVGElement>) => ( // Used for SendMessage and Communication Module
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  BuildingOffice: (props: React.SVGProps<SVGSVGElement>) => ( // For Companies
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 10.5h6M9 14.25h6M9 18h6" />
    </svg>
  ),
  UserGroup: (props: React.SVGProps<SVGSVGElement>) => ( // For Users
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.247-2.418A5.985 5.985 0 017.25 15.75a5.985 5.985 0 011.228-3.247M12 12.75a5.25 5.25 0 110-10.5 5.25 5.25 0 010 10.5zM13.5 11.25H12v1.5h1.5V15H12v1.5h1.5V18h1.5v-1.5H15v-1.5h-1.5v-1.5zM12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75zM7.5 12.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
    </svg>
  ),
};

export interface NavItemType {
  to: string;
  icon: JSX.Element;
  label: string;
  exact?: boolean;
}

export interface ModuleType {
  id: string;
  label: string;
  icon: JSX.Element;
  basePath: string;
  subItems: NavItemType[];
}

export const APP_MODULES: ModuleType[] = [
  {
    id: 'agendamentos',
    label: 'Agendamentos',
    icon: <Icons.CalendarDays className="w-5 h-5" />,
    basePath: '/agendamentos',
    subItems: [
      { to: '/agendamentos/upload-csv', icon: <Icons.Upload className="w-5 h-5" />, label: 'Upload CSV' },
      { to: '/agendamentos/estimativa-valor', icon: <Icons.ChartBar className="w-5 h-5" />, label: 'Estimativa Valor' },
      { to: '/agendamentos/lista', icon: <Icons.CalendarDays className="w-5 h-5" />, label: 'Consultar Agendamentos' },
      { to: '/agendamentos/estatisticas', icon: <Icons.ChartBar className="w-5 h-5" />, label: 'Estatísticas' },
    ],
  },
  {
    id: 'comunicacao',
    label: 'Comunicação',
    icon: <Icons.PaperAirplane className="w-5 h-5" />,
    basePath: '/comunicacao',
    subItems: [
      { to: '/comunicacao/enviar-mensagem', icon: <Icons.PaperAirplane className="w-5 h-5" />, label: 'Enviar Mensagem' },
      { to: '/comunicacao/criar-instancia', icon: <Icons.PlusCircle className="w-5 h-5" />, label: 'Criar Instância' },
      { to: '/comunicacao/gerenciar-instancias', icon: <Icons.Cog className="w-5 h-5" />, label: 'Gerenciar Instâncias' },
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: <Icons.Cog className="w-5 h-5" />,
    basePath: '/configuracoes',
    subItems: [
      { to: '/configuracoes/empresas', icon: <Icons.BuildingOffice className="w-5 h-5" />, label: 'Gerenciar Empresas' },
      { to: '/configuracoes/usuarios', icon: <Icons.UserGroup className="w-5 h-5" />, label: 'Gerenciar Usuários' },
    ],
  },
];
