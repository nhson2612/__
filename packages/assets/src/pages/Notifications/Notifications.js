import React from 'react';
import {Page, Layout} from '@shopify/polaris';
import NotificationList from '../../components/Notifications/NotificationList/NotificationList';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import SettingsSkeleton from '@assets/components/SettingsSkeleton/SettingsSkeleton';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Notifications() {
  const {data: notifications, loading, fetchApi: refresh} = useFetchApi({
    url: '/notifications',
    defaultData: []
  });

  const {data: settings} = useFetchApi({url: '/settings'});

  const {fetchApi: sync, loading: syncing} = useFetchApi({
    url: '/notifications/sync',
    manual: true
  });

  const handleSync = async () => {
    await sync();
    await refresh();
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <Page
      title="Notifications"
      subtitle="View and manage all system and store notifications"
      primaryAction={{
        content: 'Sync from Orders',
        onAction: handleSync,
        loading: syncing
      }}
    >
      <Layout>
        <Layout.Section>
          <NotificationList items={notifications} settings={settings} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
