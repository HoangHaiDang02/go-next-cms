// @flow

import {NavLink, Text} from "@mantine/core";
import {NavLink as NavRouter} from "react-router";
import type {Icon, IconProps} from "@tabler/icons-react";
import classes from "./LinksGroup.module.css";

type Props = {
    link: {
        label: string
        icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
        link: string
        id: string
        initiallyOpened?: undefined
        links?: undefined
    } | {
        label: string
        icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
        initiallyOpened: boolean
        id: string
        links: {
            label: string
            link: string
            id: string
        }[]
        link?: undefined
    }

    activeItem: string | undefined
    setActiveItem: (item: string | undefined) => void
};

export function LinksGroup({link, activeItem, setActiveItem}: Props) {

    const hasLinks = Array.isArray(link.links);

    return (
        <NavLink
            component={hasLinks ? undefined : NavRouter}
            key={link.label}
            label={<Text size="lg">{link.label}</Text>}
            leftSection={<link.icon size="1rem" stroke={1.5}/>}
            childrenOffset={0}
            to={link.link || "/"}
            variant="light"
            active={link.id === activeItem}
            onClick={() => hasLinks ? setActiveItem(undefined) : setActiveItem(link.id)}
        >
            {hasLinks &&
                <div className={classes.nestedLinks}>
                    {
                        link.links?.map((subItem) => (
                            <NavLink
                                component={NavRouter}
                                key={subItem.label}
                                label={<Text size="md">{link.label}</Text>}
                                to={subItem.link}
                                variant="subtle"
                                onClick={() => setActiveItem(subItem.id)}
                            />
                        ))
                    }
                </div>
            }
        </NavLink>
    );
}