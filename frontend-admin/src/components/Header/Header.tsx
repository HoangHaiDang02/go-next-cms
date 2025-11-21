import {Container, Group} from "@mantine/core";
import classes from "./Header.module.css";
import {ThemeToggle} from "../ThemeToggle";

const links = [
    {link: "/users", label: "users"},
    {link: "/posts", label: "posts"},
];

export function Header() {
    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </a>
    ));

    return (
        <header className={classes.header}>
            <Container size="xl">
                <div className={classes.inner}>
                    <Group ms="auto">
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                            {items}
                        </Group>
                        <ThemeToggle/>
                    </Group>
                </div>
            </Container>
        </header>
    );
}