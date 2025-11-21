import {Button, useMantineColorScheme} from "@mantine/core";
import {IconMoon, IconSun} from "@tabler/icons-react";

export function ThemeToggle() {
    const {colorScheme, setColorScheme} = useMantineColorScheme();

    function toggleMode() {
        const next = colorScheme === "light" ? "dark" : "light";
        setColorScheme(next);
    }

    return <Button
        variant={colorScheme === "light" ? "light" : "filled"}
        onClick={toggleMode}
        radius="xl"
    >
        {colorScheme === "light" ? <IconMoon size={20}/> : <IconSun size={20}/>}
    </Button>;
}