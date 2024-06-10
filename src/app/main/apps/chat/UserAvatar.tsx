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
    const colorBorder = () => {
        if (user.contact_getcourse && user.contact_bothelp_kn) {
            return { borderLeft: '6px solid red', borderRight: '6px solid green' };
        } else if (user.contact_getcourse) {
            return { borderRight: '6px solid green' };
        } else if (user.contact_bothelp_kn) {
            return { borderLeft: '6px solid red' };
        }
    };

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
            {user.contact_getcourse ? (
                <div className="absolute w-14 h-14 bg-green-900 border-2 border-white rounded-6 text-white text-[8px] text-center">
                    G
                </div>
            ) : null}
            {user.contact_bothelp_bs || user.contact_bothelp_kn ? (
                <div className="absolute w-14 h-14 bottom-0 bg-red-400 rounded-6 text-white text-xs text-center">
                    B
                </div>
            ) : null}
        </StyledBadge>
    );
}

export default UserAvatar;
