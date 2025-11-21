import {Group, ScrollArea, Text} from "@mantine/core";
import {
    IconAdjustments,
    IconCalendarStats,
    IconFileAnalytics,
    IconGauge,
    IconNotes,
    IconPresentationAnalytics,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import {UserButton} from "../UserButton";
import {LinksGroup} from "../LinksGroup/";
import {useState} from "react";

const data = [
    {label: "Dashboard", icon: IconGauge, link: "/", id: "dashboard"},
    {
        label: "Market news",
        icon: IconNotes,
        initiallyOpened: true,
        id: "market-news",
        links: [
            {label: "Overview", link: "/overview", id: "overview"},
            {label: "Forecasts", link: "/forecasts", id: "forecasts"},
        ],
    },
    {
        label: "Releases",
        icon: IconCalendarStats,
        id: "releases",
        links: [
            {label: "Upcoming releases", link: "/upcoming", id: "upcoming"},
            {label: "Previous releases", link: "/previous", id: "previous"},
        ],
    },
    {label: "Analytics", icon: IconPresentationAnalytics, link: "/analytics", id: "analytics"},
    {label: "Contracts", icon: IconFileAnalytics, link: "/contracts", id: "contracts"},
    {label: "Settings", icon: IconAdjustments, link: "/settings", id: "settings"},
];

export function Navbar() {
    const [activeItem, setActiveItem] = useState<string | undefined>("dashboard");


    const links = data.map((link) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <LinksGroup key={link.label} link={link} activeItem={activeItem} setActiveItem={setActiveItem}/>);

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="space-between">
                    <Text fw={700} size="lg">Dash board</Text>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                {links}
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton/>
            </div>
        </nav>
    );
}