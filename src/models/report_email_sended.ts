import { DataTypes, Model } from 'sequelize';
import { ConnectionDB } from '../db/dbConecction';

export const ReportEmailSended = () => {
  const model = ConnectionDB.db.define<Model<iReportEmailSended>>(
    'report_email_sended',
    {
      id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: 'report_email_sended' },
  );
  return model;
};

interface iReportEmailSended {
  id?: number;
  user_email?: string;
}
