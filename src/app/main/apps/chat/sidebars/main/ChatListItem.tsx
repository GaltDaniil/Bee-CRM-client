import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLinkAdapterPropsType } from '@fuse/core/NavLinkAdapter/NavLinkAdapter';
import UserAvatar from '../../UserAvatar';
import { ContactType } from '../../types/ContactType';
import { ChatListItemType } from '../../types/ChatListItemType';
import React from 'react';
import ru from 'date-fns/locale/ru';
import { useMediaQuery } from '@mui/material';

type ExtendedListItemProps = NavLinkAdapterPropsType & {
    component: React.ElementType<NavLinkAdapterPropsType>;
};

const StyledListItem = styled(ListItemButton)<ExtendedListItemProps>(({ theme }) => ({
    '&.active': {
        backgroundColor: theme.palette.background.default,
    },
}));

type ChatListItemProps = {
    item: Partial<ContactType & ChatListItemType>;
};

/**
 * The chat list item.
 */
function ChatListItem(props: ChatListItemProps) {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const { item } = props;
    return (
        <StyledListItem
            component={NavLinkAdapter}
            className={`px-32 py-12 min-h-80 ${isMobile ? 'w-screen' : 'w-full'}`}
            to={`/apps/chat/${item.chat_id}`}
            end
            activeClassName="active"
        >
            <UserAvatar user={item.chat_contact} />

            <ListItemText
                classes={{
                    root: `min-w-px px-16  `,
                    primary: 'font-medium text-14',
                    secondary: 'truncate',
                }}
                primary={item.chat_contact.contact_name}
                secondary={item.lastMessage}
            />

            {item.contact_id && (
                <div className="flex flex-col justify-center items-end">
                    {item?.lastMessageAt && (
                        <Typography
                            className="whitespace-nowrap mb-8 font-medium text-12"
                            color="text.secondary"
                        >
                            {format(new Date(item.lastMessageAt), 'PP', { locale: ru })}
                        </Typography>
                    )}
                    <div className="items-center">
                        {item.messenger_type ? (
                            <img
                                className="w-20 h-20 mb-4 opacity-50"
                                src={`assets/icons/${item.messenger_type}.png`}
                                alt="messenger_logo"
                            />
                        ) : null}
                        {Boolean(item.unread_count) && (
                            <Box
                                sx={{
                                    backgroundColor: 'secondary.main',
                                    color: 'secondary.contrastText',
                                }}
                                className="flex items-center justify-center min-w-20 h-20 rounded-full font-medium text-10 text-center"
                            >
                                {item.unread_count}
                            </Box>
                        )}
                    </div>
                </div>
            )}
        </StyledListItem>
    );
}

export default ChatListItem;
