import { Knex } from 'knex';
import { configService, createRandomAvatar } from '../seeds/utils';
import { Password } from '../src/shared/password';

const createAdminWithPassword = async (avatarId: string) => {
  const hashedPassword = await Password.toHash(
    configService.get('WEBSITE_OWNER_PASSWORD') as string,
  );
  const adminUsername = await configService.get('WEBSITE_OWNER_USERNAME');
  return {
    username: adminUsername,
    email: `${adminUsername}@transcendence.live`,
    fullName: adminUsername,
    avatarId: avatarId,
    password: hashedPassword,
  };
};

export async function up(knex: Knex): Promise<void> {
  const adminAvatar = await createRandomAvatar();
  const adminWithPassword = await createAdminWithPassword(adminAvatar.id);
  // Inserts admin entry
  await knex('localfile').insert(adminAvatar);
  const [admin, _] = await knex('users')
    .insert(adminWithPassword)
    .returning('*');
  await knex('moderators').insert({ id: admin.id, owner: true });
}

export async function down(knex: Knex): Promise<void> {
  const adminUsername = await configService.get('WEBSITE_OWNER_USERNAME');
  const [admin, _] = await knex('users')
    .select('*')
    .where('username', adminUsername);
  await knex('users').where('username', adminUsername).delete();
  await knex('localfile').where('id', admin.avatarId).delete();
}
