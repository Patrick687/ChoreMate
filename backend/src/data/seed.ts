import { sequelize } from '../config/db';
import { User } from '../models/UserModel';
import { GroupModel } from '../models/GroupModel';
import { ChoreModel } from '../models/ChoresModel';
import { GroupMemberModel, GroupMemberRole } from '../models/GroupMembersModel';
import { OneTimeChoreModel } from '../models/OneTimeChoresModel';
import { ChoreStatus } from '../generated/graphql-types';


async function seed() {
    try {
        // Sync all models (force: true drops tables)
        await sequelize.sync({ force: true });

        // Create users
        const user1 = await User.create({
            firstName: 'Alice',
            lastName: 'Smith',
            userName: 'alicesmith',
            email: 'alice@example.com',
            //password: 'Password1!'
            password: 'Asdf1234!'
        });

        const user2 = await User.create({
            firstName: 'Bob',
            lastName: 'Jones',
            userName: 'bobjones',
            email: 'bob@example.com',
            password: 'Password2!'
        });

        // Create groups
        const group1 = await GroupModel.create({
            name: 'Test Group 1',
            createdBy: user1.id
        });

        const group2 = await GroupModel.create({
            name: 'Test Group 2',
            createdBy: user2.id
        });

        // Create group members
        await GroupMemberModel.create({
            groupId: group1.id,
            userId: user1.id,
            role: GroupMemberRole.ADMIN
        });
        await GroupMemberModel.create({
            groupId: group1.id,
            userId: user2.id,
            role: GroupMemberRole.MEMBER
        });
        await GroupMemberModel.create({
            groupId: group2.id,
            userId: user2.id,
            role: GroupMemberRole.ADMIN
        });

        // Create chores
        await ChoreModel.create({
            groupId: group1.id,
            title: 'Take out trash',
            description: 'Take out the trash every Monday',
            isRecurring: false,
            createdBy: user1.id
        });

        const chore2 = await ChoreModel.create({
            groupId: group1.id,
            title: 'Vacuum living room',
            description: '',
            isRecurring: false,
            createdBy: user2.id
        });

        await OneTimeChoreModel.create({
            choreId: chore2.id,
            dueDate: new Date('2023-11-15T10:00:00Z'), // Example due date
            status: ChoreStatus.Done
        });

        const chore3 = await ChoreModel.create({
            groupId: group2.id,
            title: 'Wash dishes',
            description: 'Wash all dishes after dinner',
            isRecurring: false,
            createdBy: user2.id
        });

        await OneTimeChoreModel.create({
            choreId: chore3.id,
            dueDate: new Date('2023-12-01T12:00:00Z'), // Example due date
            status: ChoreStatus.InProgress
        });


        console.log('✅ Seed complete!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();