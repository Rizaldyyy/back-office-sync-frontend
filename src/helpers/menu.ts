import { MENU_ITEMS, HORIZONTAL_MENU_ITEMS, TWO_COl_MENU_ITEMS, MenuItemTypes } from '../constants/menu';

import { useSelector } from 'react-redux';

// store
import { RootState } from '../redux/store';

const GetMenuDynamic = () => {
    const { menu } = useSelector((state: RootState) => ({
        menu: state.Auth.user.menu,
    }));
    
    const menuFiltered = menu.filter((mn : any) => mn.children.length > 0);
    
    const MENU_ITEMS_DYNAMIC : MenuItemTypes[] = menuFiltered.map((mn : any) => {
        let item = {
            key: mn.menu_name,
            label: mn.menu_name,
            icon: mn.menu_icon,
            url: mn.route,
            children: []
        };
    
        const children = mn.children.map((child : any) => {
            return {
                key: child.id,
                label: child.menu_name,
                url: child.route,
                parentKey: mn.menu_name,
            }
        });
    
        item = {...item, children: children}
        
        return item;
    });

    return MENU_ITEMS_DYNAMIC;
}

const getMenuItems = () => {

    const ITEMS_DYNAMIC = GetMenuDynamic();
    const MENU_DYNAMIC = ITEMS_DYNAMIC.map((item) => {
        return {...item, isTitle: false}
    });
    
    return MENU_ITEMS.concat(MENU_DYNAMIC);
};

const getHorizontalMenuItems = () => {

    const ITEMS_DYNAMIC = GetMenuDynamic();
    const MENU_DYNAMIC = ITEMS_DYNAMIC.map((item) => {
        return {...item, isTitle: true}
    });

    return HORIZONTAL_MENU_ITEMS.concat(MENU_DYNAMIC);
};

const getTwoColumnMenuItems = () => {
    return TWO_COl_MENU_ITEMS;
};

const findAllParent = (menuItems: MenuItemTypes[], menuItem: MenuItemTypes): string[] => {
    let parents: string[] = [];
    const parent = findMenuItem(menuItems, menuItem['parentKey']);

    if (parent) {
        parents.push(parent['key']);
        if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
    }

    return parents;
};

const findMenuItem = (
    menuItems: MenuItemTypes[] | undefined,
    menuItemKey: MenuItemTypes['key'] | undefined
): MenuItemTypes | null => {
    if (menuItems && menuItemKey) {
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].key === menuItemKey) {
                return menuItems[i];
            }
            var found = findMenuItem(menuItems[i].children, menuItemKey);
            if (found) return found;
        }
    }
    return null;
};

export { getMenuItems, getHorizontalMenuItems, getTwoColumnMenuItems, findAllParent, findMenuItem };
