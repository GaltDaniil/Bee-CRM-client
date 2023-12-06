import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import UserType from 'app/store/user/UserType';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data: PartialDeep<UserType>): UserType {
    data = data || {};

    return _.defaults(data, {
        user_role: [],
        data: {
            user_name: 'John Doe',
            user_photo_url: 'assets/images/avatars/brian-hughes.jpg',
            user_email: 'johndoe@withinpixels.com',
            user_shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
            settings: {},
        },
    });
}

export default UserModel;
