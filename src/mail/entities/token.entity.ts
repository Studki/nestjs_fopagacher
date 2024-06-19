import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tokens')
export class token_entity {
  @PrimaryColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  token: string;

  @Column({default: 'token'})
  name: string;

  @Column({default: 'verifyUser'})
  f: string;

  @Column({default: 'link'})
  link: string;

  @Column()
  expirationDate: Date;
}