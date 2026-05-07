"use client";

import { NavLink as MantineNavLink } from "@mantine/core";
import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconShirtSport,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  { label: "Dashboard", href: "/dashboard", icon: <IconLayoutDashboard size={18} /> },
  { label: "Partidos", href: "/matches", icon: <IconShirtSport size={18} /> },
  { label: "Jornadas", href: "/matchdays", icon: <IconCalendarEvent size={18} /> },
  { label: "Equipos", href: "/teams", icon: <IconUsersGroup size={18} /> },
];

type Props = {
  onNavigate?: () => void;
};

export function Navbar({ onNavigate }: Props) {
  const pathname = usePathname() ?? "";

  return (
    <>
      {items.map((item) => (
        <MantineNavLink
          key={item.href}
          component={Link}
          href={item.href}
          label={item.label}
          leftSection={item.icon}
          active={pathname.startsWith(item.href)}
          onClick={onNavigate}
        />
      ))}
    </>
  );
}
