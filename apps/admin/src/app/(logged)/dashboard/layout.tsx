"use client";

import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { MenubarSeparator } from "@/components/ui/menubar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Breadcrumbs from "@/components/Breadcrumbs";
import { logout } from "@/lib/auth";
import { navigate } from "@/app/actions/navigate";
import ClickHandler from "@/components/ClickHandler";
import { redirect, usePathname } from "next/navigation";

type RouteLink = {
  name: string;
  icon: React.ReactNode;
  active: boolean;
  type: "link";
  external?: boolean;
  path?: string;
  url?: string;
};

type RouteComponent = {
  component: React.ReactNode;
  type: "component";
};

type RouteType = RouteLink | RouteComponent;

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const routes: RouteType[] = [
    {
      type: "link",
      name: "Stripe",
      url: "https://dashboard.stripe.com",
      icon: <StripeIcon className="h-4 w-4" />,
      external: true,
      active: false,
    },
    {
      type: "component",
      component: <MenubarSeparator className="bg-slate-400 my-4" />,
    },
    {
      type: "link",
      name: "Spas",
      path: "/spas",
      icon: <Package2Icon className="h-4 w-4" />,
      active: false,
    },
    {
      type: "link",
      name: "Services",
      path: "/services",
      icon: <Package2Icon className="h-4 w-4" />,
      active: false,
    },
    {
      type: "link",
      name: "Images",
      path: "/images",
      icon: <ImageIcon className="h-4 w-4" />,
      active: false,
    },
    {
      type: "link",
      name: "reservations",
      path: "/reservations",
      icon: <CalendarIcon className="h-4 w-4" />,
      active: false,
    },
    {
      type: "link",
      name: "availabilities",
      path: "/availabilities",
      icon: <CalendarCheckIcon className="h-4 w-4" />,
      active: false,
    },
  ];

  // get the path after the last slash
  const head = "/dashboard";
  const pathname = usePathname();
  const tail = pathname?.split(head).pop() || "/";
  const tailWihtoutSlash = tail.slice(1);

  const routesLink = routes.filter(
    (route) => route.type === "link"
  ) as RouteLink[];

  const route = routesLink.find((route) =>
    route?.path ? tail.startsWith(route.path) : false
  );
  if (route) {
    route.active = true;
  }

  // get the path after the last slash
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">L&apos;escale Admin</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {routes.map((route, index) => {
                if (route.type === "component") {
                  return <div key={index}>{route.component}</div>;
                  // return route.component;
                }
                return (
                  <Link
                    key={route.path}
                    className={
                      route.active
                        ? `flex items-center justify-between gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50`
                        : `flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50`
                    }
                    href={
                      (route.path ? head + route.path : route.url) as string
                    }
                  >
                    <div className="flex gap-3 items-center">
                      {route.icon}
                      {route.name}
                    </div>
                    {route.external && <ExternalLinkIcon className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-h-screen  ">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
          <Link className="lg:hidden" href="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex-1">
            <Breadcrumbs className="w-fit">
              {tailWihtoutSlash.split("/").map((crumb, index, array) => {
                const path = array.slice(0, index + 1).join("/");
                return (
                  <Link
                    className="bg-slate-200 py-1 px-2 rounded-full"
                    href={head + "/" + path}
                    key={index}
                  >
                    {crumb}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                size="icon"
                variant="ghost"
              >
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <ClickHandler
                onClick={async function () {
                  console.log("logout");
                  await logout();
                  navigate("/login");
                }}
              >
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </ClickHandler>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 h-0">
          <div className="p-4 md:gap-8 md:p-6 h-full overflow-y-scroll relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function CalendarCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g id="Interface / External_Link">
          {" "}
          <path
            id="Vector"
            d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}

function StripeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="#000000"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z"></path>
      </g>
    </svg>
  );
}
