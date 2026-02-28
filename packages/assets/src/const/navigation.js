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
  },
  {
    label: 'Analytics',
    destination: '/analytics'
  }
].map(item => ({
  ...item,
  destination: '/embed' + item.destination
}));
