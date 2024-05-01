import {  DataTypes, Model } from "sequelize"
import { ConnectionDB } from "../db/dbConecction"


export const InversionesModel = () => {
    const model = ConnectionDB.db.define<Model<iInversiones>>(
        'inversiones',
        {
            id: {
                type: DataTypes.NUMBER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
            },
            total: {
                type: DataTypes.INTEGER,
            },
            fecha: {
                type: DataTypes.DATE,
            }
        },
        {tableName: 'inversiones'}
    )
    return model;
}

interface iInversiones {
    id?: number;
    nombre?: string;
    total?: number;
    fecha?: Date;

}