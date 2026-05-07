"use client";

import {
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      window.location.href = "/matches";
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Credenciales incorrectas");
      } else {
        setError(err instanceof Error ? err.message : "Error de conexión");
      }
      setLoading(false);
    }
  };

  return (
    <Center mih="100vh" p="md">
      <Card withBorder shadow="md" padding="xl" radius="md" w={400}>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <Stack gap="md">
            <Title order={2} ta="center">
              Champions League Draw
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Ingresá tus credenciales para continuar
            </Text>

            <TextInput
              label="Usuario"
              placeholder="admin"
              leftSection={<IconUser size={16} />}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />

            <PasswordInput
              label="Contraseña"
              placeholder="••••••"
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            {error && (
              <Text size="sm" c="red" ta="center">
                {error}
              </Text>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Iniciar sesión
            </Button>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
