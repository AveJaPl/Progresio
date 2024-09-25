import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

function Header() {
  const routes = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Goals", href: "/goals" },
    { name: "Parameters", href: "/parameters" },
    { name: "Stats", href: "/stats" },
    { name: "Settings", href: "/settings" },
  ];
  return (
    <div className="relative w-full flex items-center p-6 h-20 outline outline-2 outline-border">
      <NavigationMenu className="absolute left-1/2 transform -translate-x-1/2">
        <NavigationMenuList className="flex space-x-4">
          {routes.map((route, index) => (
            <NavigationMenuItem key={index}>
              <Link href={route.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {route.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Przycisk po prawej stronie */}
      <div className="ml-auto">
      </div>
    </div>
  );
}

export default Header;
