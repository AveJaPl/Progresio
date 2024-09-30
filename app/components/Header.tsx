import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBullseye,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Import Navigation Menu components
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"; // Import Navigation Menu styles
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Import Popover components
import { useMediaQuery } from "react-responsive"; // Import useMediaQuery to handle screen size detection
import Settings from "./Settings";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for Popover
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" }); // Check if mobile

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FaTachometerAlt className="h-6 w-6" />,
    },
    { name: "Goals", href: "/goals", icon: <FaBullseye className="h-6 w-6" /> },
    {
      name: "Habits",
      href: "/habits",
      icon: <FaClipboardList className="h-6 w-6" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <FaCog className="h-6 w-6" />,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full flex items-center justify-between p-6 h-20 shadow-md relative">
      {/* Logo or Branding */}
      <div className="px-4 flex-shrink-0">
        <Link href="/" className="text-3xl font-bold">
          Aurora
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            {routes.map((route) =>
              route.name === "Settings" ? (
                <NavigationMenuItem key={route.name}>
                  {/* Popover for Settings on Desktop */}
                  <Popover open={isPopoverOpen && !isMobile} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className={`${navigationMenuTriggerStyle()} flex items-center`}
                      >
                        {route.name}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-64"
                      align="end"
                      sideOffset={10}
                    >
                      <Settings />
                    </PopoverContent>
                  </Popover>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={route.name}>
                  <Link href={route.href}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {route.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
          {isMobileMenuOpen ? (
            <FaTimes className="h-6 w-6" aria-hidden="true" />
          ) : (
            <FaBars className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <Drawer
          onOpenChange={setIsMobileMenuOpen}
          open={isMobileMenuOpen}
          direction="right"
        >
          <DrawerContent
            showBar={false}
            className="h-screen top-0 right-0 left-auto mt-0 w-full rounded-none border-none"
          >
            {/* Button to close the menu */}
            <Button
              onClick={toggleMobileMenu}
              className="absolute top-0 right-0 m-4"
              variant="outline"
            >
              Close
            </Button>

            <div className="w-full p-5 h-full flex flex-col gap-4 items-center justify-center">
              {routes.map((route) => (
                <Card
                  key={route.name}
                  className="w-3/4 flex items-center justify-center p-4"
                >
                  <Link
                    href={route.href}
                    className="flex items-center justify-center space-x-2"
                    onClick={toggleMobileMenu}
                  >
                    {route.icon}
                    <span>{route.name}</span>
                  </Link>
                </Card>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </header>
  );
}

export default Header;
