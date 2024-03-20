import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { useAppSelector } from 'app/store';
//import { selectFilteredContacts, selectGroupedFilteredContacts } from './store/contactsSlice';
import ContactListItem from './UserListItem';
import { getUsers, selectUsers } from 'app/store/user/userListSlice';
import UserListItem from './UserListItem';
import { UserListType } from 'app/store/user/UserListType';

/**
 * The contacts list.
 */
interface IProps {
    userList: UserListType;
}

function UsersList<IProps>(props) {
    const users = useAppSelector(selectUsers);
    if (!props.userList) {
        return null;
    }

    if (props.userList.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="text.secondary" variant="h5">
                    There are no contacts!
                </Typography>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex flex-col flex-auto w-full max-h-full"
        >
            {props.userList.map((user, i) => {
                return <UserListItem key={i} user={user} />;
            })}
        </motion.div>
    );
}

export default UsersList;
