import { Column, DataType, Model, Table, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  orderNumber: string;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customerEmail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customerName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  shippingAddress: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  cancelledAt?: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 