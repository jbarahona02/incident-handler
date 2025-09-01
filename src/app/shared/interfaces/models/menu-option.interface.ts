
export interface MenuOption {
    menuOptionCode: string;
    menuFatherOption: string | null;
    name: string;
    isActive: boolean;
    children?: MenuOption[];
}