import {useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';

/**
 * Paginated data fetching with query helpers.
 * @param {string} url
 * @param {Array<any> | object} [defaultData=[]]
 * @param {boolean} [initLoad=true]
 * @param {boolean} [keepPreviousData=false]
 * @param {function(any): any} [presentData=null]
 * @param {number} [defaultLimit=20]
 * @param {string} [defaultSort='createdAt:asc']
 * @param {string} [searchKey='searchKey']
 * @param {Record<string, any>} [initQueries={}]
 * @returns {{pageInfo: {hasPre: boolean, hasNext: boolean}, data: any, setData: function(any): void, count: number, setCount: function(number): void, fetchApi: function(string, object | null, boolean): Promise<void>, loading: boolean, fetched: boolean, prevPage: function(): Promise<void>, nextPage: function(): Promise<void>, onQueryChange: function(string, any, boolean): void, onQueriesChange: function(object, boolean): void}}
 */
export default function usePaginate({
  url,
  defaultData = [],
  initLoad = true,
  keepPreviousData = false,
  presentData = null,
  defaultLimit = 20,
  defaultSort = 'createdAt:asc',
  searchKey = 'searchKey',
  initQueries = {}
}) {
  const [queries, setQueries] = useState({
    page: 1,
    sort: defaultSort,
    limit: defaultLimit,
    [searchKey]: '',
    ...initQueries
  });

  const fetchApiHook = useFetchApi({url, defaultData, initLoad, presentData, initQueries: queries});
  const {data, fetchApi} = fetchApiHook;

  /**
   * Fetch data with merged query params.
   * @param {object | null} [params=null]
   * @param {boolean} [keepData=false]
   * @return {Promise<void>}
   */
  const handleFetchApi = async (params = null, keepData = false) => {
    await fetchApi(url, {...queries, ...params}, keepData);
  };

  /**
   * Update a single query field and optionally fetch.
   * @param {string} key
   * @param {any} value
   * @param {boolean} [isFetch=false]
   * @return {void}
   */
  const onQueryChange = (key, value, isFetch = false) => {
    setQueries(prev => ({...prev, [key]: value}));
    if (isFetch) handleFetchApi({[key]: value}).then();
  };

  /**
   * Update multiple query fields and optionally fetch.
   * @param {object} newQueries
   * @param {boolean} [isFetch=false]
   * @return {void}
   */
  const onQueriesChange = (newQueries, isFetch = false) => {
    setQueries(prev => ({...prev, ...newQueries}));
    if (isFetch) handleFetchApi(newQueries).then();
  };

  /**
   * Paginate to previous/next page.
   * @param {'prev' | 'next' | ''} [paginate='']
   * @return {Promise<void>}
   */
  const onPaginate = async (paginate = '') => {
    const [before, after, page] = (() => {
      switch (paginate) {
        case 'prev':
          return [data[0].id, '', queries.page - 1];
        case 'next':
          return ['', data[data.length - 1].id, queries.page + 1];
        default:
          return ['', '', 1];
      }
    })();
    await handleFetchApi({page, before, after}, keepPreviousData);
    setQueries(prev => ({...prev, page}));
  };

  return {
    prevPage: () => onPaginate('prev'),
    nextPage: () => onPaginate('next'),
    onQueryChange,
    onQueriesChange,
    ...fetchApiHook
  };
}
