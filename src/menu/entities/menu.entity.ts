import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('date')
  date: Date;

  @Column('text')
  accompaniment: string;

  @Column('text')
  mainCourse: string;

  @Column('text')
  dessert: string;

  @Column('text')
  garnish: string;
}
