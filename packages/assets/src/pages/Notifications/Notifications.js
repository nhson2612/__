import React, {useState, useEffect} from 'react';
import {Page} from '@shopify/polaris';
import NotificationList from '../../components/Notifications/NotificationList/NotificationList';
import useFetchApi from '@assets/hooks/api/useFetchApi';
import NotificationsSkeleton from '@assets/components/NotificationsSkeleton/NotificationsSkeleton';
import styles from './style.module.css';

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

  const {
    data: notifications,
    pageInfo,
    loading,
    fetchApi: refresh,
    setData: setNotifications
  } = useFetchApi({
    url: `/notifications?${query}`,
    defaultData: [],
    initLoad: false
  });

  const {data: settings} = useFetchApi({url: '/settings'});

  useEffect(() => {
    refresh(`/notifications?${query}`);
  }, [cursor, sortValue]);

  const handleSortChange = newSortValue => {
    setSortValue(newSortValue);
    setCursor({next: null, prev: null});
  };
  const hasPrev = pageInfo.hasPrev ?? pageInfo.hasPre;

  const handleNextPage = () => {
    if (pageInfo.hasNext) {
      const lastId = notifications[notifications.length - 1]?.id;
      if (lastId) setCursor({next: lastId, prev: null});
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      const firstId = notifications[0]?.id;
      if (firstId) setCursor({next: null, prev: firstId});
    }
  };

  const handleDismiss = id => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  if (loading && !notifications.length) return <NotificationsSkeleton />;

  return (
    <div className={styles.notifications}>
      <Page
        title="Notifications"
        subtitle="List of sales notification from Shopify"
        fullWidth={true}
      >
        <NotificationList
          items={notifications}
          settings={settings}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          pagination={{
            hasNext: pageInfo.hasNext,
            hasPrevious: hasPrev,
            onNext: handleNextPage,
            onPrevious: handlePrevPage
          }}
          onDismiss={handleDismiss}
        />
      </Page>
    </div>
  );
}
