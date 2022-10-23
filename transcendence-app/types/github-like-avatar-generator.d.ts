type GenerateAvatarParams = {
  blocks: number;
  width: number;
  fromPixels?: Array<string>;
};

type GenerateAvatarReturnType = {
  base64: string;
  pixels: Array<string>;
};

declare module 'github-like-avatar-generator' {
  import generateAvatar = require('github-like-avatar-generator');

  function generateAvatar(
    params: GenerateAvatarParams,
  ): GenerateAvatarReturnType;

  export = generateAvatar;
}
