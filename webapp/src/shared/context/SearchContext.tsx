import * as React from 'react';

type SearchContextProps = {
  children: React.ReactNode;
};

type Query = {
  search: string;
  offset: number;
};

type Context = {
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// https://reactjs.org/docs/context.html#reactcreatecontext
const SearchContext = React.createContext<Context | undefined>(undefined);

export const SearchContextProvider = ({
  children,
}: SearchContextProps): JSX.Element => {
  const [query, setQuery] = React.useState<Query>({
    search: '',
    offset: 0,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery({ search: value, offset: 0 });
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, onChange }}>
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
