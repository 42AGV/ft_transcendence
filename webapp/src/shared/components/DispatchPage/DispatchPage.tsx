import './DispatchPage.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, USERS_EP_URL } from '../../urls';
import { SmallAvatar } from '../Avatar/Avatar';
import SearchForm from '../Input/SearchForm';
import RowsList, { RowItem } from '../RowsList/RowsList';
import NavigationBar from '../NavigationBar/NavigationBar';
import { useData } from '../../hooks/UseData';

type DispatchPageProps<T> = {
  fetchFn: (...args: any[]) => Promise<T[]>;
  dataValidator: (data: T) => boolean;
  dataMapper: (data: T) => RowItem;
  button?: JSX.Element; // TODO: this is provisional, until we have a better idiom
};

export default function DispatchPage<T>({
  fetchFn,
  dataValidator,
  dataMapper,
  button,
}: DispatchPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState('');
  const [hasMoreData, setHasMoreData] = useState(false);
  const getData = useCallback(() => {
    return fetchFn({ search });
  }, [fetchFn, search]);
  const results = useData(getData);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setData([]);
  }, [search]);

  useEffect(() => {
    if (results.data) {
      setData(results.data);
      setHasMoreData(results.data.length > 0);
    }
  }, [results.data]);

  const fetchMoreData = useCallback(async () => {
    try {
      const newData = await fetchFn({
        offset: data.length,
        search,
      });
      setData((prevData) => [...prevData, ...newData]);
      setHasMoreData(newData.length > 0);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [data.length, fetchFn, search]);

  const lastRowElementRef = useCallback(
    (row: HTMLLIElement) => {
      if (results.isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreData) {
          fetchMoreData();
        }
      });
      if (row) {
        observer.current.observe(row);
      }
    },
    [results.isLoading, hasMoreData, fetchMoreData],
  );

  const mapDataToRows = (
    callBack: (data: T) => RowItem,
    data: T[],
  ): RowItem[] => {
    return data.map((item) => callBack(item));
  };

  const instanceOfArrayTyped = (
    array: object,
    elementChecker: (object: any) => boolean,
  ): boolean => {
    if (!Array.isArray(array)) {
      return false;
    }
    return array.every((element) => elementChecker(element));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm search={search} onSearchChange={handleSearch} />
      </div>
      <div className="dispatch-page-rows">
        {dataValidator &&
          instanceOfArrayTyped(data, dataValidator) &&
          dataMapper && (
            <RowsList
              rows={mapDataToRows(dataMapper, data)}
              lastRowRef={lastRowElementRef}
            />
          )}
      </div>
      {button && <div className="dispatch-page-button">{button}</div>}
      <div className="dispatch-page-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
