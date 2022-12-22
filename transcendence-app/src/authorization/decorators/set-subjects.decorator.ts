import { SetMetadata } from '@nestjs/common';
import { Subject, SubjectCtors } from '../casl-ability.factory';

export const SET_SUBJECTS_KEY = 'set_subjects';

export const SetSubjects = (...handlers: SubjectCtors[]) =>
  SetMetadata(SET_SUBJECTS_KEY, handlers);
