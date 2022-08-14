import { Input, InputVariant } from '../';
import { IconVariant } from '../Icon/Icon';
import './SearchUserForm.css';

type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchUserForm({ search, setSearch }: SearchProps) {
  return (
    <div className="search-user-form">
      <Input
        variant={InputVariant.DARK}
        iconVariant={IconVariant.SEARCH}
        placeholder="Search"
        value={search}
        name="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
}
