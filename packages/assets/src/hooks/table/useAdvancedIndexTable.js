import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  EmptySearchResult,
  IndexFilters,
  IndexTable,
  InlineStack,
  Pagination,
  Select,
  Text,
  IndexFiltersMode,
  useSetIndexFiltersMode
} from '@shopify/polaris';
import formatDateTime from '@avada/functions/src/helpers/datetime/formatDateTime';
import {getUniqueArrayObject} from '@assets/helpers/getUniqueArrayObject';
import {commonItemPages} from '@assets/const/paginationOptions';
import useFetchApi from '../api/useFetchApi';
import './useAdvancedIndexTable.scss';

/**
 * Normalize and format query params for API requests.
 * @param {Record<string, any>} [value={}]
 * @return {Record<string, any>}
 */
function convertQueriesParams(value = {}) {
  const cloned = structuredClone(value);
  if (cloned.start) cloned.start = formatDateTime(cloned.start);
  if (cloned.end) cloned.end = formatDateTime(cloned.end);
  return cloned;
}

/**
 * @param {string} fetchUrl
 * @param {Array<object>} [columns=[]]
 * @param {Array<object>} [defaultData=[]]
 * @param {function(any): any} [renderItemCols=(val) => val]
 * @param {function(any): any} [prepareItems=(val) => val]
 * @param {function(object): void} [onClickRow=(_)=>{}]
 * @param {string} [defaultOrder='createdAt desc']
 * @param {string} [defaultLimit='10']
 * @param {string} [customKey='']
 * @param {React.ReactNode} [emptyState=null]
 * @param {Record<string, any>} [customKeys={}]
 * @param {function(object): object} [formatParams=(params) => params]
 * @param {Record<string, any>} [initQueries={}]
 * @param {string} [orderField='sort']
 * @param {string} [limitField='limit']
 * @param {boolean} [loadMore=false]
 * @param {boolean} [initLoad=true]
 * @param {Array<object>} [selection=[]]
 * @param {Array<{singular: string, plural: string}>} [resourceData=[{singular: 'data', plural: 'data'}]]
 * @param {function(Array<object>): void} [setSelection=(_)=>{}]
 * @param {boolean} [selectable=false]
 * @param {boolean} [searchable=false]
 * @param {string} [searchPlaceholder='Search by name or email']
 * @param {number} [amount=5]
 * @return {{data: (*[]|*), setData: ((function(((function(*[]): *[])|*[])): void)|*), dataLength: number, dataTable: React.JSX.Element, refetchData: (function(): Promise<void>|*), loading: (boolean|*), table: React.JSX.Element, fetched: (boolean|*)}}
 */
export default function useAdvancedIndexTable({
  fetchUrl,
  columns = [],
  defaultData = [],
  renderItemCols = val => val,
  prepareItems = val => val,
  onClickRow = _ => {},
  defaultOrder = 'createdAt desc',
  defaultLimit = '10',
  customKey = '',
  emptyState = null,
  customKeys = {},
  formatParams = params => params,
  initQueries = {},
  orderField = 'sort',
  limitField = 'limit',
  loadMore = false,
  initLoad = true,
  selection = [],
  resourceData = [{singular: 'data', plural: 'data'}],
  setSelection = _ => {},
  selectable = false,
  searchable = false,
  searchPlaceholder = 'Search by name or email',
  amount = 5
}) {
  const convertedQueries = convertQueriesParams(initQueries);
  const {
    data,
    setData,
    loading,
    fetched,
    fetchApi,
    pageInfo,
    endCursor,
    total: totalCount
  } = useFetchApi({
    url: fetchUrl,
    initQueries: convertedQueries,
    defaultData,
    initLoad
  });
  const items = prepareItems(data) || [];
  const {hasNext, hasPre, totalPage = 0} = pageInfo;
  const [page, setPage] = useState(1);
  const [typing, setTyping] = useState(false);
  const [currentSelected, setCurrentSelected] = useState([]);
  const [queries, setQueries] = useState({
    ...customKeys,
    customKey,
    [orderField]: defaultOrder,
    [limitField]: defaultLimit
  });

  /**
   * Sync header cell widths to match body cell widths during scroll.
   * @param {number} amount
   * @return {void}
   */
  const handleTableHeadingWhenScroll = amount => {
    for (let i = 1; i <= amount; i++) {
      const cell = document.querySelector(`.Polaris-IndexTable__TableCell:nth-child(${i})`);
      const heading = document.querySelector(`.Polaris-IndexTable__TableHeading:nth-child(${i})`);
      if (cell && heading) {
        const cellWidth = cell.offsetWidth;
        heading.style.width = `${cellWidth}px`;
        heading.style.minWidth = `${cellWidth}px`;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => handleTableHeadingWhenScroll(amount));
    return () => {
      window.removeEventListener('scroll', () => handleTableHeadingWhenScroll(amount));
    };
  }, []);

  const isCheckAll = useMemo(() => {
    if (!data || !data.length || !selectable) return false;
    return data.every(item => currentSelected.includes(item.id));
  }, [data, currentSelected]);

  const itemCount = useMemo(() => (isCheckAll ? currentSelected.length : totalCount || 0), [
    isCheckAll,
    currentSelected,
    totalCount
  ]);

  /**
   * Build a new selection array based on selection type and toggle behavior.
   * @param {object} params
   * @param {'single' | 'page'} [params.selectionType='single']
   * @param {string | number} params.selectedValue
   * @param {boolean} [params.toggleType=false]
   * @return {Array<object>}
   */
  function getDataSelectedObject({selectionType = 'single', selectedValue, toggleType = false}) {
    const allData = data;
    const allDataId = data.map(item => item.id);

    const selectedItem = allData.find(item => item.id === selectedValue);
    if (toggleType) {
      const newDataAdd = selectionType === 'page' ? allData : [selectedItem];
      return getUniqueArrayObject([...selection, ...newDataAdd], 'id');
    }

    const isRemove = value =>
      selectionType === 'page' ? !allDataId.includes(value.id) : value.id !== selectedValue;
    return selection.filter(isRemove);
  }

  /**
   * Update selection state from the IndexTable.
   * @param {'single' | 'page'} selectionType
   * @param {boolean} toggleType
   * @param {string | number} selection
   * @return {void}
   */
  const handleSelectionChange = (selectionType, toggleType, selection) => {
    const itemSelectedObject = getDataSelectedObject({
      selectionType,
      selectedValue: selection,
      toggleType
    });
    setSelection(itemSelectedObject);
  };

  /**
   * Update a query value and optionally trigger a fetch.
   * @param {string} key
   * @param {any} value
   * @param {boolean} [isFetch=false]
   * @return {void}
   */
  const handleQueryChange = (key, value, isFetch = false) => {
    const customQueries = {[key]: value};
    setQueries(prev => ({...prev, ...customQueries}));
    if (isFetch) {
      handleFetchApi({customQueries}).then();
    }
  };

  useEffect(() => {
    if (!typing && fetched) setTyping(true);
  }, [queries.search]);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      setPage(1);
      handleFetchApi().then();
    }, 500);
    return () => clearTimeout(timeout);
  }, [queries.search]);

  /**
   * Fetch data for the table with pagination and custom query overrides.
   * @param {object} [params={}]
   * @param {'prev' | 'next' | ''} [params.paginate='']
   * @param {Record<string, any>} [params.customQueries={}]
   * @return {Promise<void>}
   */
  const handleFetchApi = async ({paginate = '', customQueries = {}} = {}) => {
    setTyping(false);
    const paramQueries = {...convertQueriesParams(queries), ...customQueries};
    let keepPreviousData = false;
    switch (paginate) {
      case 'prev':
        paramQueries.before = data[0].id;
        paramQueries.after = '';
        paramQueries.page = page - 1;
        break;
      case 'next':
        paramQueries.before = '';
        paramQueries.after = endCursor || data[data.length - 1].id;
        paramQueries.page = page + 1;
        keepPreviousData = loadMore;
        break;
      case '':
      default:
        paramQueries.before = '';
        paramQueries.after = '';
        paramQueries.page = 1;
        break;
    }
    const params = {...paramQueries};
    await fetchApi(fetchUrl, formatParams(params), keepPreviousData);
    setPage(paramQueries.page);
  };

  useEffect(() => {
    if (!loading && fetched) {
      handleFetchApi().then();
    }
  }, [queries[limitField]]);

  useEffect(() => {
    if (!selectable) return;
    if (Array.isArray(selection)) {
      const itemSelectedID = selection?.map(item => item.id);
      setCurrentSelected(itemSelectedID);
    }
  }, [selection]);

  const {Row, Cell} = IndexTable;
  const renderItem = useMemo(
    () => (
      <>
        {items.map((row, index) => (
          <Row
            id={row.id}
            key={row.id}
            selected={currentSelected.includes(row.id)}
            onClick={() => onClickRow(row)}
            position={index}
          >
            {renderItemCols(row).map((col, index) => (
              <Cell key={index}>{col}</Cell>
            ))}
          </Row>
        ))}
      </>
    ),
    [items, currentSelected, renderItemCols]
  );

  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const searchBar = (
    <div onKeyDown={event => event.key === 'Enter' && handleFetchApi()}>
      <IndexFilters
        loading={loading}
        queryValue={queries.search}
        queryPlaceholder={searchPlaceholder}
        onQueryChange={value => handleQueryChange('search', value)}
        onQueryClear={() => handleQueryChange('search', '', true)}
        mode={mode}
        setMode={setMode}
        tabs={[]}
        filters={[]}
        autoFocusSearchField={false}
        onClearAll={() => {}}
      />
    </div>
  );

  const pagination = (
    <InlineStack blockAlign="center" align="center">
      <div style={{flex: '1 1 150px'}} />
      <Pagination
        hasPrevious={hasPre && !loading}
        onPrevious={() => handleFetchApi({paginate: 'prev'})}
        hasNext={hasNext && !loading}
        onNext={() => handleFetchApi({paginate: 'next'})}
        label={`Page ${[page, totalPage].filter(Boolean).join(' / ')}`}
        previousTooltip="Previous"
        nextTooltip="Next"
      />
      <div style={{flex: 1}} />
      <InlineStack gap="200">
        <Text as="span">Items per page</Text>
        <Select
          label=""
          labelHidden
          options={commonItemPages}
          disabled={loading}
          value={queries[limitField]}
          onChange={val => handleQueryChange(limitField, val)}
        />
      </InlineStack>
    </InlineStack>
  );

  const table = (
    <IndexTable
      resourceName={resourceData}
      itemCount={itemCount}
      emptyState={
        !fetched || loading || typing ? (
          <div className="Avada__IndexTable-EmptyState" />
        ) : queries.search ? (
          <EmptySearchResult title="No items found" withIllustration />
        ) : (
          emptyState || <EmptySearchResult title="No items found" withIllustration />
        )
      }
      selectedItemsCount={currentSelected.length}
      onSelectionChange={handleSelectionChange}
      headings={columns}
      selectable={selectable}
      loading={!fetched && loading}
    >
      {renderItem}
    </IndexTable>
  );

  const dataTable = (
    <div className="Avada__IndexTable-Container">
      {searchable && searchBar}
      {table}
      {fetched && !!totalCount && (
        <Box paddingBlockStart="500" paddingBlockEnd="300" paddingInline="300">
          {pagination}
        </Box>
      )}
    </div>
  );

  return {
    table,
    dataTable,
    refetchData: () => fetchApi(fetchUrl, formatParams(queries)),
    loading,
    fetched,
    data,
    setData,
    dataLength: data.length
  };
}
