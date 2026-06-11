"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  ChevronsUpDown,
  Home,
  LogOut,
  Plus,
  Settings,
  UserCircle,
  FolderOpen,
  History,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

// 导航项配置 — 匹配 CoopOrder 业务
const mainNavItems = [
  { to: "/app", label: "首页", icon: Home, exact: true },
  { to: "/app/create", label: "新建合作", icon: Plus },
  { to: "/app/project", label: "项目列表", icon: FolderOpen },
];

const secondaryNavItems = [
  { to: "/app/evidence", label: "证据链", icon: History },
];

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("coop-auth");
    navigate("/login");
  };

  return (
    <motion.div
      className={cn("sidebar fixed left-0 z-[100] h-full shrink-0 border-r")}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-[100] flex text-[#5a5a5a] h-full shrink-0 flex-col bg-white transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            {/* Brand Header */}
            <div className="flex h-[54px] w-full shrink-0 border-b border-[#e5e0d6] p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2"
                    >
                      <div className="size-4 rounded bg-[#c4850f] flex items-center justify-center">
                        <Sparkles className="size-2.5 text-white" />
                      </div>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-semibold text-[#1a1a1a]">
                              CoopOrder
                            </p>
                            <ChevronsUpDown className="h-4 w-4 text-[#a0a0a0]/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => navigate("/app/settings")}
                    >
                      <Settings className="h-4 w-4" /> 系统设置
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {/* Main Nav */}
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact
                        ? location.pathname === item.to
                        : location.pathname.startsWith(item.to);
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.exact}
                          className={cn(
                            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-[#f5f0e8] hover:text-[#1a1a1a]",
                            isActive && "bg-[#f5f0e8] text-[#c4850f]"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <motion.li variants={variants}>
                            {!isCollapsed && (
                              <p className="ml-2 text-sm font-medium">
                                {item.label}
                              </p>
                            )}
                          </motion.li>
                        </NavLink>
                      );
                    })}

                    <Separator className="w-full" />

                    {/* Secondary Nav */}
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.to);
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-[#f5f0e8] hover:text-[#1a1a1a]",
                            isActive && "bg-[#f5f0e8] text-[#c4850f]"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <motion.li variants={variants}>
                            {!isCollapsed && (
                              <p className="ml-2 text-sm font-medium">
                                {item.label}
                              </p>
                            )}
                          </motion.li>
                        </NavLink>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col p-2">
                <NavLink
                  to="/app/settings"
                  className={cn(
                    "mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-[#f5f0e8] hover:text-[#1a1a1a]",
                    location.pathname.startsWith("/app/settings") &&
                      "bg-[#f5f0e8] text-[#c4850f]"
                  )}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium">设置</p>
                    )}
                  </motion.li>
                </NavLink>

                {/* User Account Dropdown */}
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-[#f5f0e8] hover:text-[#1a1a1a]">
                        <Avatar className="size-4">
                          <AvatarFallback className="bg-[#c4850f] text-white text-[8px]">
                            设
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">设计师</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-[#a0a0a0]/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-[#c4850f] text-white text-xs">
                            设
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">设计师</span>
                          <span className="line-clamp-1 text-xs text-[#a0a0a0]">
                            designer@cooporder.com
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/app/settings")}
                      >
                        <UserCircle className="h-4 w-4" /> 个人资料
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" /> 退出登录
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
