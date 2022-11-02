type GenerateAvatarParams = {
  blocks: number;
  width: number;
  fromPixels?: string[];
};

type GenerateAvatarReturnType = {
  base64: string;
  pixels: string[];
};

declare module 'github-like-avatar-generator' {
  function generateAvatar(
    params: GenerateAvatarParams,
  ): GenerateAvatarReturnType;

  export = generateAvatar;
}
