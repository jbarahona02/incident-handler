
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  children?: NavItem[]; // Para soportar submenús
  expanded?: boolean; // Para controlar si el submenú está expandido
}