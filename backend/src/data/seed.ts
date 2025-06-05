import { sequelize } from '../config/db';
import { User } from '../models/UserModel';
import { GroupModel } from '../models/GroupModel';
import { ChoreModel } from '../models/ChoresModel';
import { GroupMemberModel, GroupMemberRole } from '../models/GroupMembersModel';
import { OneTimeChoreModel } from '../models/OneTimeChoresModel';
import { ChoreStatus } from '../generated/graphql-types';
import "../models";

async function seed() {
    try {
        // Sync all models (force: true drops tables)
        await sequelize.sync({ force: true });

        // Create users
        console.log('Seeding database...');
        console.log('Creating users...');
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

        console.log('✅ Users created:', user1.id, user2.id);
        console.log('Creating groups and chores...');
        // Create groups
        const group1 = await GroupModel.create({
            name: 'Test Group 1',
            createdBy: user1.id
        });

        const group2 = await GroupModel.create({
            name: 'Test Group 2',
            createdBy: user2.id
        });
        console.log('✅ Groups created:', group1.id, group2.id);

        console.log('Creating group members and chores...');
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

        console.log('✅ Group members created:', user1.id, user2.id);
        console.log('Creating chores...');
        // Create chores
        console.log('Creating chore 1...');
        const chore1 = await ChoreModel.create({
            groupId: group1.id,
            title: 'Take out trash',
            description: 'Take out the trash every Monday',
            isRecurring: false,
            createdBy: user1.id
        });
        await OneTimeChoreModel.create({
            choreId: chore1.id,
            dueDate: new Date('2023-11-01T09:00:00Z'), // Example due date
            status: ChoreStatus.Todo
        });
        await chore1.createAssignment({
            assignedTo: null,
            assignedBy: null,
            choreId: chore1.id,
        });

        console.log('✅ Chore 1 created:', chore1.id);
        console.log('Creating chore 2...');

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
        await chore2.createAssignment({
            assignedTo: user1.id,
            assignedBy: user2.id,
            choreId: chore2.id,
        });

        console.log('✅ Chore 2 created:', chore2.id);
        console.log('Creating chore 3...');

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
        await chore3.createAssignment({
            assignedTo: null,
            assignedBy: null,
            choreId: chore3.id,
        });

        console.log('✅ Chore 3 created:', chore3.id);


        console.log('✅ Seed complete!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();