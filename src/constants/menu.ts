export interface MenuItemTypes {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
    {
        key: 'dashboards',
        label: 'Dashboards',
        isTitle: false,
        icon: 'home',
        url: '/dashboard/ecommerce',
        badge: { variant: 'success', text: '' },
    },
    { key: 'menu', label: 'Menu', isTitle: true },
];


const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
    {
        key: 'dashboards',
        icon: 'home',
        label: 'Dashboards',
        url: '/dashboard/ecommerce',
        isTitle: true,
    }
];

const TWO_COl_MENU_ITEMS: MenuItemTypes[] = [
    {
        key: 'dashboards',
        label: 'Dashboards',
        isTitle: true,
        icon: 'home',
        url: '/dashboard/ecommerce',
    }
];

export { MENU_ITEMS, TWO_COl_MENU_ITEMS, HORIZONTAL_MENU_ITEMS };
