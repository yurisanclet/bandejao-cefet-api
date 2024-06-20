import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  nutritionalData: string;

  @Column('int')
  quantity: number;

  @Column('date')
  expiryDate: Date;

  get status(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.expiryDate >= today ? 'In date' : 'Out of date';
  }
}
