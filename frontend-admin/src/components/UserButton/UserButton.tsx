import {Avatar, Group, Text, UnstyledButton} from "@mantine/core";

export function UserButton() {
    return (
        <UnstyledButton
            w="100%"
            style={{
                padding: "var(--mantine-spacing-xs)",
                borderRadius: "var(--mantine-radius-sm)",
                color: "light-dark(var(--mantine-color-black), var(--mantine-color-dark-0))",
            }}
        >
            <Group>
                <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                    radius="xl"
                />
                <div style={{flex: 1}}>
                    <Text size="sm" fw={500}>
                        Đăng Sun
                    </Text>
                    <Text c="dimmed" size="xs">
                        haidang@assmin.vlxx
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    );
}

