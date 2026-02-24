export const navigationLinks = [
  {
    label: 'Home',
    destination: '/'
  },
  {
    label: 'Settings',
    destination: '/settings'
  },
  {
    label: 'Notifications',
    destination: '/notifications'
  }
].map(item => ({
  ...item,
  destination: '/embed' + item.destination
}));
