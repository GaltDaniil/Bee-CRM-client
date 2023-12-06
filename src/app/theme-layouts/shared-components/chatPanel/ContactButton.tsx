import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { ContactType } from 'app/theme-layouts/shared-components/chatPanel/types/ContactType';
import ContactStatus from 'app/theme-layouts/shared-components/chatPanel/ContactStatus';
import { ChatListItemType } from 'app/theme-layouts/shared-components/chatPanel/types/ChatListItemType';

const Root = styled(Tooltip)<{ active: number }>(({ theme, active }) => ({
    width: 70,
    minWidth: 70,
    flex: '0 0 auto',
    ...(active && {
        '&:after': {
            position: 'absolute',
            top: 8,
            right: 0,
            bottom: 8,
            content: "''",
            width: 4,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: theme.palette.primary.main,
        },
    }),
}));

const StyledUreadBadge = styled('div')(({ theme }) => ({
    position: 'absolute',
    minWidth: 18,
    height: 18,
    top: 4,
    left: 10,
    borderRadius: 9,
    padding: '0 5px',
    fontSize: 11,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.35)',
    zIndex: 10,
}));

type ContactButtonProps = {
    contact: Partial<ContactType & ChatListItemType>;
    selectedContactId: string;
    onClick: (id: string) => void;
};

/**
 * Contact button component.
 */
function ContactButton(props: ContactButtonProps) {
    const { contact, selectedContactId, onClick } = props;

    return (
        <Root
            title={contact.contact_name}
            placement="left"
            active={selectedContactId === contact.contact_id ? 1 : 0}
        >
            <Button
                onClick={() => onClick(contact.contact_id)}
                className={clsx(
                    'contactButton rounded-0 py-4 h-auto min-h-auto max-h-none',
                    selectedContactId === contact.contact_id && 'active',
                )}
            >
                {contact.unread && <StyledUreadBadge>{contact.unread}</StyledUreadBadge>}

                <ContactStatus value={contact.contact_status} />

                <Avatar src={contact.contact_photo_url} alt={contact.contact_name}>
                    {!contact.contact_photo_url || contact.contact_photo_url === ''
                        ? contact.contact_name[0]
                        : ''}
                </Avatar>
            </Button>
        </Root>
    );
}

export default ContactButton;
