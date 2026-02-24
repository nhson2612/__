import {HomeIcon, NotificationIcon, SettingsIcon} from '@shopify/polaris-icons';

const menuIcons = [
  {
    icon: HomeIcon,
    destination: '/embed/'
  },
  {
    icon: SettingsIcon,
    destination: '/embed/settings'
  },
  {
    icon: NotificationIcon,
    destination: '/embed/notifications'
  }
];

export const getMenuIcon = url => menuIcons.find(x => x.destination === url)?.icon || SettingsIcon;
