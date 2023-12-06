import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The type definition for a user object.
 */
export type UserType = {
    user_id?: string;
    user_role?: string[] | string | null;
    from?: string;
    data: {
        user_name: string;
        user_photo_url?: string;
        user_email?: string;
        user_shortcuts?: string[];
        settings?: Partial<FuseSettingsConfigType>;
    };
};

export default UserType;
