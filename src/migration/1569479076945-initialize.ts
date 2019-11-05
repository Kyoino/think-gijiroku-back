import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../entity/Role';
import { User } from '../entity/User';
import { Note } from '../entity/Note';

export class Initialize1569479076945 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<any> {
    const roleRepository = getRepository(Role);
    const admin = new Role({ role: 'ADMIN' });
    const normal = new Role({ role: 'NORMAL' });
    await roleRepository.save(admin);
    await roleRepository.save(normal);
    const user = new User({
      firstName: 'kkiyama117',
      lastName: 'kkiyama',
      roles: [admin],
    });
    const userRepository = getRepository(User);
    await userRepository.save(user);
    const testNote = new Note({
      title: 'test note',
      text: 'nanjamonja.',
    });
    testNote.user = user;
    const noteRepository = getRepository(Note);
    await noteRepository.save(testNote);
    const testNote2 = new Note({
      title: 'test note2',
      text: 'nanjamonja2.',
    });
    await noteRepository.save(testNote2);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  public async down(queryRunner: QueryRunner): Promise<any> {
    const noteRepository = getRepository(Note);
    await noteRepository.clear();
    const userRepository = getRepository(User);
    await userRepository.clear();
    const roleRepository = getRepository(Role);
    await roleRepository.clear();
  }
}
