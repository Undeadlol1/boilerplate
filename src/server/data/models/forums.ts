import { Table, Column, Model, HasMany, DataType } from "sequelize-typescript";

@Table({ tableName: "forumns", freezeTableName: true })
export default class Forums extends Model<Forums> {
  @Column({
    unique: true,
    allowNull: false,
    type: DataType.STRING,
    comment: "Human redable name for a forum."
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    comment: "Unique id of a user who created this forum."
  })
  UserId: number;

  @Column({
    unique: true,
    allowNull: false,
    type: DataType.STRING,
    comment: "Url friendly name of a forum."
  })
  slug: string;

  // @HasMany(() => Hobby)
  // hobbies: Hobby[];
}

// module.exports = function(sequelize: any, DataTypes: any) {
//   var Forums = sequelize.define(
//     "Forums",
//     {
//       id: {
//         unique: true,
//         primaryKey: true,
//         type: DataTypes.UUID,
//         validate: { isUUID: 4 },
//         defaultValue: DataTypes.UUIDV4,
//         comment: "Unique identifier."
//       },
//       name: {
//         unique: true,
//         allowNull: false,
//         type: DataTypes.STRING,
//         comment: "Human redable name for a forum."
//       },
//       slug: {
//         unique: true,
//         allowNull: false,
//         type: DataTypes.STRING,
//         comment: "Url friendly name of a forum."
//       },
//       UserId: {
//         allowNull: false,
//         type: DataTypes.INTEGER,
//         comment: "Unique id of a user who created this forum."
//       }
//       //   @BelongsTo(() => Team)
//       // team: Team;
//     },
//     {
//       tableName: "forums",
//       freezeTableName: true
//     }
//   );
//   // Class methods
//   // associations can be defined here
//   Forums.associate = function(models) {
//     Forums.belongsTo(models.User);
//   };
//   return Forums;
// };
