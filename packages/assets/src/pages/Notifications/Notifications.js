import React from 'react';
import {Page, Layout} from '@shopify/polaris';
import NotificationList from '../../components/Notifications/NotificationList/NotificationList';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Notifications() {
  const notifications = [
    {
      id: '1',
      message: 'Someone in New York, United States',
      action: 'Purchased Sport Snaker',
      date: '2026-01-31 10:00 AM',
      status: 'unread',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg',
    },
    {
      id: '2',
      message: 'Someone in New York, United States',
      action: 'Purchased Sport Snaker',
      date: '2026-01-30 02:30 PM',
      status: 'read',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg',
    },
    {
      id: '3',
      message: 'Someone in New York, United States',
      action: 'Purchased Sport Snaker',
      date: '2026-01-30 09:15 AM',
      status: 'unread',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg',
    }
  ];

  return (
    <Page title="Notifications" subtitle="View and manage all system and store notifications">
      <Layout>
        <Layout.Section>
          <NotificationList items={notifications} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
