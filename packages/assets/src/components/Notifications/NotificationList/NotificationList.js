import React, {useState} from 'react';
import {Card, ResourceList} from '@shopify/polaris';
import Notification from '../Notification/Notification';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup';

/**
 * @param {Object} props
 * @param {Array} props.items
 * @return {JSX.Element}
 * @constructor
 */
export default function NotificationList({items = []}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const promotedBulkActions = [
    {
      content: 'Mark as read',
      onAction: () => console.log('Todo: implement bulk mark read')
    }
  ];

  const bulkActions = [
    {
      content: 'Delete',
      onAction: () => console.log('Todo: implement bulk delete')
    }
  ];

  const renderItem = (item) => {
    return <Notification {...item} />;
  };

  return (
    <Card padding="0">
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest Update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest Update', value: 'DATE_MODIFIED_ASC'}
        ]}
        onSortChange={selected => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        pagination={{
          hasNext: true,
          onNext: () => {}
        }}
      />
    </Card>
  );
}
