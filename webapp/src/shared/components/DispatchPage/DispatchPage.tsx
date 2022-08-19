import './DispatchPage.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_URL, USERS_EP_URL } from '../../urls';
import { SmallAvatar } from '../Avatar/Avatar';
import SearchForm from '../Input/SearchForm';
import RowsList, { RowItem } from '../RowsList/RowsList';
import NavigationBar from '../NavigationBar/NavigationBar';

type DispatchPageProps<T> = {
  genericEndpointUrl: string;
  dataValidator: (data: T[]) => boolean;
  dataMapper: (data: T) => RowItem;
};

export default function DispatchPage<T>({
  genericEndpointUrl,
  dataValidator,
  dataMapper,
}: DispatchPageProps<T>) {
  const [data, setData] = useState<T[]>([]);

  const mapDataToRows = <T,>(
    callBack: (data: T) => RowItem,
    data: T[],
  ): RowItem[] => {
    return data.map((item) => callBack(item));
  };

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm url={`${genericEndpointUrl}?search=`} setChange={setData} />
      </div>
      <div className="dispatch-page-rows">
        {dataValidator(data) && (
          <RowsList rows={mapDataToRows(dataMapper, data)} />
        )}
      </div>
      <div className="dispatch-page-navigation">
        <NavigationBar />
      </div>
    </div>
  );
}
