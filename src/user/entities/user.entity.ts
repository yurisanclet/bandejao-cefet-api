import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "../dto/update-user.dto";

@Entity()
export class User {
  update(updateUserDto: UpdateUserDto): any {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('text')
  @Unique(['email'])
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  document: string;

  @Column('date')
  birthdate: Date;

  constructor(createUserDTO?: CreateUserDto) {
    if (createUserDTO) {
      this.email = createUserDTO.email;
      this.name = createUserDTO.name;
      this.document = createUserDTO.document;
      this.birthdate = new Date(createUserDTO.birthdate);
      this.password = createUserDTO.password;
    }
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

}
