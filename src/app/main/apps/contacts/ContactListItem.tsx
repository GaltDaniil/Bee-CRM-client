import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { ContactType } from './types/ContactType';
import { SERVER_IP } from 'app/configs/routesConfig';

type ContactListItemPropsType = {
    contact: ContactType;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemPropsType) {
    const { contact } = props;

    return (
        <>
            <ListItemButton
                className="px-32 py-16"
                sx={{ bgcolor: 'background.paper' }}
                component={NavLinkAdapter}
                to={`/apps/contacts/${contact.contact_id}`}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={contact.contact_name}
                        src={SERVER_IP + contact.contact_photo_url}
                    />
                </ListItemAvatar>
                <ListItemText
                    classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
                    primary={contact.contact_name}
                    /* secondary={
                        <Typography
                            className="inline"
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            {contact.title}
                        </Typography>
                    } */
                />
            </ListItemButton>
            <Divider />
        </>
    );
}

export default ContactListItem;
