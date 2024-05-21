import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/dbConecction';

export const TokenModel = () => {
  const model = ConnectionDB.db.define<Model<iTokens>>(
    'tokens',
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fcm_token: {
        type: DataTypes.STRING,
      },
     
    },
    { tableName: 'tokens' },
  );
  return model;
};

interface iTokens {
  id?: number;
  fcm_token?: string;
  
}
