import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent } from 'react';
import { useAppSelector } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ToolbarMenu from './ToolbarMenu';
import { selectMembers } from '../../../../store/membersSlice';
import { selectUsers } from 'app/store/user/userListSlice';

type MembersMenuProps = {
    memberIds: string[];
    onToggleMember: (memberId: string) => void;
};

/**
 * The members menu component.
 */
function MembersMenu(props: MembersMenuProps) {
    const { memberIds, onToggleMember } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
    const members = useAppSelector(selectMembers);
    const users = useAppSelector(selectUsers);

    function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton onClick={handleMenuOpen} size="large">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
            </IconButton>
            <ToolbarMenu state={anchorEl} onClose={handleMenuClose}>
                <div>
                    {users.map((member) => {
                        return (
                            <MenuItem
                                className="px-8"
                                key={member.user_id}
                                onClick={() => {
                                    onToggleMember(member.user_id);
                                }}
                            >
                                <Checkbox checked={memberIds.includes(member.user_id)} />
                                <Avatar
                                    className="w-32 h-32"
                                    src={`https://beechat.ru/${member.data.user_photo_url}`}
                                />
                                <ListItemText className="mx-8">
                                    {member.data.user_name}
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </div>
            </ToolbarMenu>
        </div>
    );
}

export default MembersMenu;
