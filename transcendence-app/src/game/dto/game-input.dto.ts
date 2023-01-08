import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

type inputCommandType = 'hola';

export class GameInputDto {
  command!: inputCommandType;
}
