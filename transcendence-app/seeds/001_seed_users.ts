import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { readdirSync, unlinkSync } from "fs";
import { Password } from "../src/shared/password";
import { configService, createRandomAvatar, defaultUsernames } from "./utils";
import { join } from "path";
import { AVATARS_PATH } from "../src/shared/constants";

const USERS_NUMBER = 5000;

const createRandomUser = (avatarId: string) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.helpers.unique(faker.internet.userName, [
    firstName,
    lastName
  ]);
  return {
    username: username.slice(-20),
    email: faker.internet.email(firstName, lastName).slice(-50),
    fullName: faker.name.fullName({ firstName, lastName }),
    avatarId
  };
};

const createUserWithPassword = async (username: string, avatarId: string) => {
  const hashedPassword = await Password.toHash(username);
  return {
    username,
    email: `${username}@${username}.com`,
    fullName: username,
    avatarId: avatarId,
    password: hashedPassword
  };
};

export async function seed(knex: Knex): Promise<void> {
  const adminUsername = await configService.get("WEBSITE_OWNER_USERNAME");
  const [admin, _] = await knex("users")
    .select("*")
    .where("username", adminUsername);
  const [adminAvatarFile, __] = await knex("localfile")
    .select("*")
    .where("id", admin.avatarId);
  // Deletes ALL existing entries and local files, except website owner
  await knex("users").delete().whereNot("id", admin.id);
  await knex("localfile").delete().whereNot("id", admin.avatarId);
  const appDataPath = configService.get("TRANSCENDENCE_APP_DATA") as string;
  const avatarsPath = join(appDataPath, AVATARS_PATH);

  try {
    (await readdirSync(avatarsPath))
      .filter((file) => file !== adminAvatarFile.filename)
      .map((file) =>
        unlinkSync(join(avatarsPath, file)));
  } catch (error) {
    throw error;
  }

  const avatars = await Promise.all(
    Array.from({ length: USERS_NUMBER }, createRandomAvatar)
  );
  const users = avatars.map((avatar) => createRandomUser(avatar.id));

  // Inserts seed entries
  await knex("localfile").insert(avatars);
  await knex("users").insert(users);

  // Create users with default password
  const defaultAvatars = await Promise.all(
    Array.from({ length: defaultUsernames.length }, createRandomAvatar)
  );
  const usersWithPassword = await Promise.all(
    defaultUsernames.map((username, index) =>
      createUserWithPassword(username, defaultAvatars[index].id)
    )
  );

  // Inserts seed entries
  await knex("localfile").insert(defaultAvatars);
  await knex("users").insert(usersWithPassword);
}
