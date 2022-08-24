import './DispatchPage.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, USERS_EP_URL } from '../../urls';
import { SmallAvatar } from '../Avatar/Avatar';
import SearchForm from '../Input/SearchForm';
import RowsList, { RowItem } from '../RowsList/RowsList';
import NavigationBar from '../NavigationBar/NavigationBar';

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

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm fetchFn={fetchFn} setChange={setData} />
      </div>
      <div className="dispatch-page-rows">
        {dataValidator &&
          instanceOfArrayTyped(data, dataValidator) &&
          dataMapper && <RowsList rows={mapDataToRows(dataMapper, data)} />}
      </div>
      {button && <div className="dispatch-page-button">{button}</div>}
      <div className="dispatch-page-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
