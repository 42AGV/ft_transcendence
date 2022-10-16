import './SearchForm.css';

import { Input, InputVariant } from '..';
import { IconVariant } from '../Icon/Icon';
import { useSearchContext } from '../../context/SearchContext';

export default function SearchForm() {
  const { query, onChange } = useSearchContext();

  return (
    <div className="search-form">
      <Input
        variant={InputVariant.DARK}
        iconVariant={IconVariant.SEARCH}
        placeholder="search"
        value={query.search}
        name="search"
        onChange={onChange}
      />
    </div>
  );
}
