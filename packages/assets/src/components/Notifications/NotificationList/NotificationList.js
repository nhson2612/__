import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Card, ResourceList} from '@shopify/polaris';
import Notification from '../Notification/Notification';

/**
 * @param {Object} props
 * @param {Array} props.items
 * @return {JSX.Element}
 * @constructor
 */
export default function NotificationList({
  items = [],
  settings = {},
  sortValue = 'DATE_MODIFIED_DESC',
  onSortChange,
  pagination,
  onDismiss
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const bulkActions = [
    {
      content: 'Read All',
      onAction: () => alert('mark all as read')
    }
  ];

  const renderItem = item => {
    return <Notification {...item} settings={settings} onClose={() => onDismiss(item.id)} />;
  };

  console.log('NotificationList items:', items);

  return (
    <Card padding="0">
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest Update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest Update', value: 'DATE_MODIFIED_ASC'}
        ]}
        onSortChange={onSortChange}
        pagination={pagination}
      />
    </Card>
  );
}

NotificationList.propTypes = {
  items: PropTypes.array.isRequired,
  settings: PropTypes.object,
  sortValue: PropTypes.string,
  onSortChange: PropTypes.func,
  pagination: PropTypes.object,
  onDismiss: PropTypes.func
};

NotificationList.defaultProps = {
  items: [],
  settings: {},
  sortValue: 'DATE_MODIFIED_DESC',
  onSortChange: undefined,
  pagination: undefined,
  onDismiss: () => {}
};
