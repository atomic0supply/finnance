"use client";

import { 
  Home, 
  Building, 
  Car, 
  Settings, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Plus,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "Transacciones",
    href: "/transactions",
    icon: CreditCard
  },
  {
    title: "Propiedades",
    href: "/properties",
    icon: Building
  },
  {
    title: "Vehículos",
    href: "/vehicles",
    icon: Car
  },
  {
    title: "Servicios",
    href: "/services",
    icon: Settings
  },
  {
    title: "Calendario",
    href: "/calendar",
    icon: Calendar
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: BarChart3
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Header with user info */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Finnance</h1>
        <p className="text-sm text-gray-600">Gestión financiera personal</p>
        
        {/* User info */}
        {user && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      {user.imageUrl ? (
                        <Image 
                          src={user.imageUrl} 
                          alt={user.fullName || 'User'} 
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          priority={false}
                          unoptimized={false}
                        />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress}
                      </p>
                      <p className="text-xs text-gray-500">Usuario</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Transacción
        </Button>
      </div>
    </div>
  );
}
