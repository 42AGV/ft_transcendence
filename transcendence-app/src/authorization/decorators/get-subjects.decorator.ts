import { SetMetadata } from '@nestjs/common';
import { SubjectAsString } from '../casl-ability.factory';

export const SET_SUBJECTS_KEY = 'set_subjects';

export const SetSubjects = (...handlers: SubjectAsString[]) =>
  SetMetadata(SET_SUBJECTS_KEY, handlers);
