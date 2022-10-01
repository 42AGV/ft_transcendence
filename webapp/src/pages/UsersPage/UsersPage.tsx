import { IconVariant, RowItem } from '../../shared/components';
import {
  AVATAR_EP_URL,
  USERS_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import {
  instanceOfUser,
  User,
  UserControllerGetUsersRequest,
} from '../../shared/generated';
import {
  RowsTemplate,
  validateAndMapDataToRow,
} from '../../shared/components/index';
import { useCallback } from 'react';
import { usersApi } from '../../shared/services/ApiService';
import { SearchContextProvider } from '../../shared/context/SearchContext';
import UseSearch from '../../shared/hooks/UseSearch';
import { useState, useEffect } from 'react';
import { useSearchContext } from '../../shared/context/SearchContext';

const mapUserToRow = (user: User): RowItem => {
  return {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: {
      url: user.avatarId
        ? `${AVATAR_EP_URL}/${user.avatarId}`
        : WILDCARD_AVATAR_URL,
      status: 'offline',
      XCoordinate: user.avatarX,
      YCoordinate: user.avatarY,
    },
    url: `${USERS_URL}/${user.id}`,
    title: user.username,
    subtitle: 'level x',
    key: user.id,
  };
};

// Aqui nos suscribimos al contexto, hacemos la peticion y gestionamos el ciclo de vida de los datos
// Al template le pasamos los datos de las rows para que los pinte

function UsersTemplateInstance() {
  const getUsers = useCallback(
    (requestParameters: UserControllerGetUsersRequest) =>
      usersApi.userControllerGetUsers(requestParameters),
    [],
  );
  const [isLastRow, setIsLastRow] = useState(false);
  const { result, isLoading } = UseSearch(getUsers);
  const { setQuery } = useSearchContext();
  const data = validateAndMapDataToRow(
    instanceOfUser,
    mapUserToRow,
    result.data,
  );

  useEffect(() => {
    // is loading ...
    // if (result.hasMore) {
    //   setQuery((prevSearchParams) => ({
    //     ...prevSearchParams,
    //     // darle una vuelta a esto
    //     offset: data?.length ?? 0,
    //   }));
    // }
  }, [setQuery, data]);

  return (
    <RowsTemplate
      data={data}
      setIsLastRow={setIsLastRow}
      isLoading={isLoading}
      hasMore={result.hasMore}
    />
  );
}

export default function UsersPage() {
  return (
    <SearchContextProvider>
      <UsersTemplateInstance />
    </SearchContextProvider>
  );
}
