import { UUID } from "crypto";
import { Chore, CHORE_TABLE_NAME, ChoreModel, ChoreModelAttributes } from "./ChoresModel";
import { BelongsToGetAssociationMixin, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { ConflictError } from "../utils/error/customErrors";
import { ChoreStatus } from "../generated/graphql-types";


export interface OneTimeChoreModelAttributes {
    id: UUID;
    choreId: ChoreModelAttributes['id'];
    dueDate: Date | null;
    status: ChoreStatus;
}

export interface OneTimeChoreModelCreationAttributes {
    choreId: ChoreModelAttributes['id'];
    dueDate?: Date | null;
    status?: ChoreStatus;
}

export const ONE_TIME_CHORE_TABLE_NAME = "CHR_ONETIME_CHORE";
export const ONE_TIME_CHORE_MODEL_NAME = "OneTimeChore";

export class OneTimeChore extends Model<OneTimeChoreModelAttributes, OneTimeChoreModelCreationAttributes> implements OneTimeChoreModelAttributes {

    public id!: OneTimeChoreModelAttributes['id'];
    public choreId!: OneTimeChoreModelAttributes['choreId'];
    public dueDate!: OneTimeChoreModelAttributes['dueDate'];
    public status!: OneTimeChoreModelAttributes['status'];

    // chore
    public getChore!: BelongsToGetAssociationMixin<Chore>;
}

export const OneTimeChoreModel = OneTimeChore.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        choreId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CHORE_TABLE_NAME,
                key: 'id',
            },
        },
        dueDate: {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(ChoreStatus),
            defaultValue: ChoreStatus.Todo,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize, // Assuming sequelize is imported from your db config
        tableName: ONE_TIME_CHORE_TABLE_NAME,
        modelName: ONE_TIME_CHORE_MODEL_NAME,
        hooks: {
            beforeCreate: async (oneTimeChore, _) => {
                const chore = await ChoreModel.findByPk(oneTimeChore.choreId);
                if (chore?.isRecurring) {
                    throw new ConflictError("Chore is not a recurring chore");
                }
            }
        }
    }
);