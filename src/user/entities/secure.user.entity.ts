import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';
import { Role } from 'src/enums/roles.enum';
import { user_entity } from './user.entity';

@Entity()
export class SecureUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: false })
  isSubcribed: boolean;

  @OneToOne(() => user_entity, (user) => user.secureUser, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: user_entity;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role?: string;

  @Column({ nullable: true })
  imageUrl: string;
}

// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<user_entity> {
//   afterUpdate(event: UpdateEvent<user_entity>) {
//     const user = event.entity;
//     if (user) {
//       // Assuming user is a property of this class
//       user.secureUser.firstname = user.firstname;
//       user.secureUser.lastname = user.lastname;
//       user.secureUser.email = user.email;
//       user.secureUser.username = user.username;
//       user.secureUser.role = user.role;
//       console.log('SECURE USER UPDATE');
//     }
//   }

//   listenTo() {
//     return user_entity; // Return the User entity to listen for updates
//   }
// }
