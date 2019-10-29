import { Factory } from 'typeorm-factory';
import { User } from '../src/entity/User';
import { Role } from '../src/entity/Role';

// .attr → 普通のカラムはこれで作ります
// .sequence → ユニーク成約等があるカラムの場合はindexを受取る無名関数を使って一意化出来ます
export const authAdminFactory = new Factory(Role).attr('role', 'ADMIN');

export const UserFactory = new Factory(User)
  .attr('firstName', 'John')
  .attr('lastName', 'Doe')
  .assocMany('roles', authAdminFactory);

// .assocMany → toManyリレーション作成。最後の引数で一気に作る数を指定出来ます
// .assocOne → toOneリレーションを作成
// export const PostFactory = new Factory(Post)
//     .sequence("title", (i) => `title ${i}`)
//     .sequence("text", (i) => `text ${i}`)
//     .attr("likesCount", 10)
//     .assocMany("comments", CommentFactory, 2)
//     .assocOne("author", AuthorFactory);
