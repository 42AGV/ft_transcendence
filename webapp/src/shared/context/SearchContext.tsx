import * as React from 'react';

import { useData } from '../hooks/UseData';

type SearchContextProps<T> = {
  children: React.ReactNode;
  fetchFn: (requestParams: {}) => Promise<T[]>;
  maxEntries: number;
};

type Query = {
  search?: string;
  offset: number;
};

type Result<T> = {
  data: T[];
};

type QueryReducerAction = {
  type: 'SEARCH' | 'LOAD_MORE';
  value?: string;
  offset?: number;
};

type ResultReducerAction<T> = {
  type: 'APPEND' | 'FLUSH';
  data?: { value: T[]; offset: number };
};

type Context<T> = {
  query: Query;
  result: Result<T>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchMoreResults: () => void;
};

function queryReducerCallback(state: Query, action: QueryReducerAction) {
  const { type, value, offset } = action;

  if (type === 'SEARCH') {
    return { search: value, offset: 0 };
  } else if (type === 'LOAD_MORE') {
    return { ...state, offset: state.offset + (offset ?? 0) };
  }
  throw new Error('Unknown query reducer action');
}

function resultReducerCallback<T>(
  state: Result<T>,
  action: ResultReducerAction<T>,
) {
  const { type, data } = action;

  if (type === 'APPEND' && data) {
    if (data.offset > 0) {
      return {
        data: [...state.data, ...data.value],
      };
    } else {
      return {
        data: [...data.value],
      };
    }
  } else if (type === 'FLUSH') {
    return { data: [] };
  }
  throw new Error('Unknown result reducer action');
}

// https://reactjs.org/docs/context.html#reactcreatecontext
const SearchContext = React.createContext<Context<any> | undefined>(undefined);

export const SearchContextProvider = <T,>({
  children,
  fetchFn,
  maxEntries,
}: SearchContextProps<T>): JSX.Element => {
  const [query, queryReducer] = React.useReducer(queryReducerCallback, {
    search: '',
    offset: 0,
  });

  const [result, resultReducer] = React.useReducer(resultReducerCallback, {
    data: [],
  });

  const { data, error, isLoading } = useData(
    React.useCallback(async () => {
      const data = await fetchFn(query);
      return { value: data, offset: query.offset };
    }, [fetchFn, query]),
  );

  const fetchMoreResults = React.useCallback(() => {
    queryReducer({ type: 'LOAD_MORE', offset: maxEntries });
  }, [maxEntries]);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      queryReducer({ type: 'SEARCH', value });
    },
    [],
  );

  React.useEffect(() => {
    if (!isLoading && !error) {
      if (data && (data.value.length > 0 || data.offset > 0)) {
        resultReducer({
          type: 'APPEND',
          data,
        });
      } else {
        resultReducer({ type: 'FLUSH' });
      }
    }
  }, [data, isLoading, error]);

  return (
    <SearchContext.Provider
      value={{ query, result, onChange, fetchMoreResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function useSearchContext() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be within SearchContextProvider');
  }
  return context;
}
