import {
  Status,
} from '../../../shared/components';
import { BookSection } from '../BookSection';

export const StatusExample = () => (
  <BookSection title="Status component">
      <Status variant="online" />
      <Status variant="offline" />
      <Status variant="playing" />
  </BookSection>
);
