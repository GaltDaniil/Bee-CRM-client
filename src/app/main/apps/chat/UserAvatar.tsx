import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import Statuses from './Statuses';
import { UserType } from './types/UserType';
import { SERVER_IP } from 'app/configs/routesConfig';
import { ContactType } from './types/ContactType';
import { ChatContactType } from './types/ChatContactType';

const StyledBadge = styled(Badge)<{ statuscolor: string }>(({ theme, ...props }) => ({
    width: 40,
    height: 40,
    fontSize: 20,
    '& .MuiAvatar-root': {
        fontSize: 'inherit',
        color: theme.palette.text.secondary,
        fontWeight: 600,
    },
    '& .MuiBadge-badge': {
        backgroundColor: props.statuscolor,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            content: '""',
        },
    },
}));

type UserAvatarPropsType = {
    user: PartialDeep<UserType & ChatContactType>;
    className?: string;
};

/**
 * The user avatar component.
 */

function UserAvatar(props: UserAvatarPropsType) {
    const { user, className } = props;

    const status = _.find(Statuses, { value: user.user_status || user.contact_status });

    return (
        <StyledBadge
            className={className}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            statuscolor={status?.color}
        >
            <Avatar
                src={
                    user.user_photo_url
                        ? SERVER_IP + user.user_photo_url
                        : user.contact_photo_url
                        ? SERVER_IP + user.contact_photo_url
                        : ''
                }
                alt={user?.user_name}
                className="w-full h-full"
            >
                {user?.user_name && (!user?.user_photo_url || user?.user_photo_url === '')
                    ? user?.user_name[0]
                    : ''}
            </Avatar>
        </StyledBadge>
    );
}

export default UserAvatar;
