import './RowsTemplate.css';
import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../../urls';
import { MediumAvatar } from '../../Avatar/Avatar';
import SearchForm from '../../Input/SearchForm';
import RowsList, { RowItem } from '../../RowsList/RowsList';
import NavigationBar from '../../NavigationBar/NavigationBar';
import UseSearch from '../../../hooks/UseSearch';
import { useData } from '../../../hooks/UseData';
import Loading from '../../Loading/Loading';
import { usersApi } from '../../../services/ApiService';
import { useSearchContext } from '../../../context/SearchContext';

type SearchFetchFnParams = {
  search: string;
  offset: number;
};

type SearchFetchFn<T> = (
  requestParameters: SearchFetchFnParams,
) => Promise<T[]>;

type RowsTemplateProps<T> = {
  fetchFn: SearchFetchFn<T>;
  dataValidator: (data: T) => boolean;
  dataMapper: (data: T) => RowItem;
  button?: JSX.Element; // TODO: this is provisional, until we have a better idiom
};

export default function RowsTemplate<T>({
  fetchFn,
  dataValidator,
  dataMapper,
  button,
}: RowsTemplateProps<T>) {
  const { query, setQuery } = useSearchContext();

  const getData = useCallback(() => {
    return fetchFn(query);
  }, [fetchFn, query]);
  const { data, isLoading, hasMore } = UseSearch(query.search, getData);
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
          setQuery((prevSearchParams) => ({
            ...prevSearchParams,
            offset: data.length,
          }));
        }
      });
      if (row) {
        observer.current.observe(row);
      }
    },
    [isLoading, hasMore, data.length, setQuery],
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

  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const { data: user } = useData(getCurrentUser);

  if (!user) {
    return (
      <div className="dispatch-page">
        <div className="dispatch-page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <MediumAvatar
            url={
              user.avatarId
                ? `${AVATAR_EP_URL}/${user.avatarId}`
                : WILDCARD_AVATAR_URL
            }
            XCoordinate={user.avatarX ?? 0}
            YCoordinate={user.avatarY ?? 0}
          />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm />
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
