"use client";

import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Group,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconTrophy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";
import { DrawBanner } from "./DrawBanner";
import { Navbar } from "./Navbar";

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <IconTrophy size={22} />
            <Title order={4}>Champions League Draw</Title>
          </Group>
          <Tooltip label="Cerrar sesión">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => void handleLogout()}
              aria-label="Logout"
            >
              <IconLogout size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="lg">
            <DrawBanner />
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
