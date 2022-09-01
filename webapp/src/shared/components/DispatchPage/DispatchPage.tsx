import './DispatchPage.css';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, USERS_EP_URL } from '../../urls';
import { SmallAvatar } from '../Avatar/Avatar';
import SearchForm from '../Input/SearchForm';
import RowsList, { RowItem } from '../RowsList/RowsList';
import NavigationBar from '../NavigationBar/NavigationBar';
import UseSearch from '../../hooks/UseSearch';
import { useData } from '../../hooks/UseData';
import { usersApi } from '../../services/ApiService';

type SearchFetchFnParams = {
  search: string;
  offset: number;
};

type SearchFetchFn<T> = (
  requestParameters: SearchFetchFnParams,
) => Promise<T[]>;

type DispatchPageProps<T> = {
  fetchFn: SearchFetchFn<T>;
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
  const [searchParams, setSearchParams] = useState<SearchFetchFnParams>({
    search: '',
    offset: 0,
  });
  const { search } = searchParams;
  const getData = useCallback(() => {
    return fetchFn(searchParams);
  }, [fetchFn, searchParams]);
  const { data, isLoading, hasMore } = UseSearch(search, getData);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowElementRef = useCallback(
    (row: HTMLLIElement) => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSearchParams((prevSearchParams) => ({
            ...prevSearchParams,
            offset: data.length,
          }));
        }
      });
      if (row) {
        observer.current.observe(row);
      }
    },
    [isLoading, hasMore, data.length],
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
    setSearchParams({ search: value, offset: 0 });
  };
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const { data: user } = useData(getCurrentUser);

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <SmallAvatar
            url={`${USERS_EP_URL}/avatar`}
            XCoordinate={user?.avatarX ?? 0}
            YCoordinate={user?.avatarY ?? 0}
          />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm search={search} onSearchChange={handleSearch} />
      </div>
      <div className="dispatch-page-rows">
        {instanceOfArrayTyped(data, dataValidator) && (
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
