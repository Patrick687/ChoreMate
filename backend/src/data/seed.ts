import { sequelize } from '../config/db';
import { User } from '../models/UserModel';
import { GroupModel } from '../models/GroupModel';
import { ChoreModel } from '../models/ChoresModel';
import { GroupMemberModel, GroupMemberRole } from '../models/GroupMembersModel';
import { UUID } from 'crypto';
import { UnauthorizedError } from '../utils/error/customErrors';
import { OneTimeChoreModel } from '../models/OneTimeChoresModel';

async function testChoreCreatorValidation(groupId: UUID, nonMemberUserId: UUID) {
    try {
        await ChoreModel.create({
            groupId,
            title: 'Should Fail',
            description: 'This should not be created',
            isRecurring: false,
            createdBy: nonMemberUserId
        });
        console.error('❌ Test failed: Chore was created by a non-member!');
    } catch (err) {
        if (err instanceof UnauthorizedError && err.message.includes('must be a member')) {
            console.log('✅ Test passed: Chore creation blocked for non-member.');
        } else {
            console.error('❌ Test failed with unexpected error:', err);
        }
    }
}

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
            isRecurring: true,
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
            dueDate: new Date('2023-11-15T10:00:00Z') // Example due date
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
            dueDate: new Date('2023-12-01T12:00:00Z') // Example due date
        });


        // Create a user who sis NOT a member of group1
        const outsider = await User.create({
            firstName: 'Charlie',
            lastName: 'Outsider',
            userName: 'charlieoutsider',
            email: 'charlie@example.com',
            password: 'Password3!'
        });

        // Test: Try to create a chore in group1 by outsider (should fail)
        await testChoreCreatorValidation(group1.id, outsider.id);

        console.log('✅ Seed complete!');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();