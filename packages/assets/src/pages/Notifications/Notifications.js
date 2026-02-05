import React, {useState, useCallback} from 'react';
import {Page, Layout} from '@shopify/polaris';
import NotificationList from '../../components/Notifications/NotificationList/NotificationList';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import SettingsSkeleton from '@assets/components/SettingsSkeleton/SettingsSkeleton';

/**
 * @return {React.JSX.Element}
 * @constructor
 */
export default function Notifications() {
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [cursor, setCursor] = useState({next: null, prev: null});

  const getSortParams = () => {
    switch (sortValue) {
      case 'DATE_MODIFIED_ASC':
        return {sort: 'timestamp', direction: 'asc'};
      case 'DATE_MODIFIED_DESC':
      default:
        return {sort: 'timestamp', direction: 'desc'};
    }
  };

  const {sort, direction} = getSortParams();
  let query = `limit=5&sort=${sort}&direction=${direction}`;
  if (cursor.next) query += `&nextCursor=${cursor.next}`;
  if (cursor.prev) query += `&prevCursor=${cursor.prev}`;

  const {data: notifications, pageInfo, loading, fetchApi: refresh, setData: setNotifications} = useFetchApi({
    url: `/notifications?${query}`,
    defaultData: [],
    initLoad: false // Disable auto-init, we control it via useEffect
  });

  const {data: settings} = useFetchApi({url: '/settings'});

  const {fetchApi: sync, loading: syncing} = useFetchApi({
    url: '/notifications/sync',
    manual: true
  });

  // Fetch data when query parameters change
  React.useEffect(() => {
    refresh(`/notifications?${query}`);
  }, [cursor, sortValue]); // Dependency on state that drives the query

  const handleSync = async () => {
    await sync();
    await refresh();
  };

  const handleSortChange = useCallback(newSortValue => {
    setSortValue(newSortValue);
    setCursor({next: null, prev: null}); // Reset pagination on sort change
  }, []);

  const handleNextPage = useCallback(() => {
    if (pageInfo.hasNext) {
      setCursor({next: pageInfo.nextCursor, prev: null});
    }
  }, [pageInfo]);

  const handlePrevPage = useCallback(() => {
    if (pageInfo.hasPrev) {
      setCursor({next: null, prev: pageInfo.prevCursor});
    }
  }, [pageInfo]);

  const handleDismiss = useCallback(
    id => {
      setNotifications(prev => prev.filter(item => item.id !== id));
    },
    [setNotifications]
  );

  if (loading && !notifications.length) return <SettingsSkeleton />;

  return (
    <Page title="Notifications" subtitle="List of sales notification from Shopify">
      <Layout>
        <Layout.Section>
          <NotificationList
            items={notifications}
            settings={settings}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            pagination={{
              hasNext: pageInfo.hasNext,
              hasPrev: pageInfo.hasPrev,
              onNext: handleNextPage,
              onPrevious: handlePrevPage
            }}
            onDismiss={handleDismiss}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
