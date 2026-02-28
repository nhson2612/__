import {useEffect, useState} from 'react';
import {api} from '@assets/helpers';
import stringify from 'qs-stringify';
import {handleError} from '@assets/services/errorService';
import {useStore} from '@assets/reducers/storeReducer';

/**
 * useFetchApi hook for fetch data from api with url.
 * @param {string} url
 * @param {Array<any> | object} [defaultData=[]]
 * @param {boolean} [initLoad=true]
 * @param {function(any): any} [presentData=null]
 * @param {Record<string, any>} [initQueries={}]
 * @returns {{pageInfo: object, data: any, setData: function(any): void, count: number, setCount: function(number): void, fetchApi: function(string, object | null, boolean): Promise<void>, loading: boolean, fetched: boolean, total: number, setTotal: function(number): void, setFetched: function(boolean): void}}
 */
export default function useFetchApi({
  url,
  defaultData = [],
  initLoad = true,
  presentData = null,
  initQueries = {}
}) {
  const [loading, setLoading] = useState(initLoad);
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState(defaultData);
  const [pageInfo, setPageInfo] = useState({});
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const {dispatch} = useStore();

  /**
   * Fetch data from API with optional query params.
   * @param {string} apiUrl
   * @param {object | null} [params=null]
   * @param {boolean} [keepPreviousData=false]
   * @return {Promise<void>}
   */
  async function fetchApi(apiUrl, params = null, keepPreviousData = false) {
    try {
      setLoading(true);
      const path = apiUrl || url;
      const separateChar = path.includes('?') ? '&' : '?';
      const query = params ? separateChar + stringify(params) : '';
      const resp = await api(path + query);
      if (resp.hasOwnProperty('pageInfo')) setPageInfo(resp.pageInfo);
      if (resp.hasOwnProperty('count')) setCount(resp.count);
      if (resp.hasOwnProperty('total')) setTotal(resp.total);
      if (resp.hasOwnProperty('data')) {
        let newData = presentData ? presentData(resp.data) : resp.data;
        if (!Array.isArray(newData)) {
          newData = {...defaultData, ...newData};
        }
        setData(prev => {
          if (!keepPreviousData) {
            return newData;
          }
          return Array.isArray(newData) ? [...prev, ...newData] : {...prev, ...newData};
        });
      }
    } catch (e) {
      handleError(e, dispatch);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  useEffect(() => {
    if (initLoad && !fetched) {
      fetchApi(url, initQueries).then(() => {});
    }
  }, []);

  return {
    fetchApi,
    data,
    setData,
    pageInfo,
    count,
    setCount,
    total,
    setTotal,
    loading,
    fetched,
    setFetched
  };
}
