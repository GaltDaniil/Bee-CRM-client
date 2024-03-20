import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { ContactType } from '../../types/ContactType';
import UserType from 'app/store/user/UserType';

type ContactListItemPropsType = {
    user: UserType;
};

/**
 * The contact list item.
 */
function UserListItem(props: ContactListItemPropsType) {
    const { user } = props;

    return (
        <>
            <ListItemButton
                className="px-32 py-16 rounded-full"
                sx={{ bgcolor: 'background.paper' }}
                component={NavLinkAdapter}
                to={`/apps/contacts/${user.user_id}`}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={user.data.user_name}
                        src={`https://beechat.ru/${user.data.user_photo_url}`}
                    />
                </ListItemAvatar>
                <ListItemText
                    classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
                    primary={user.data.user_name}
                    secondary={
                        <Typography
                            className="inline"
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            {/* {'user.title'} */}
                        </Typography>
                    }
                />
            </ListItemButton>
            {/*  <Divider /> */}
        </>
    );
}

export default UserListItem;
