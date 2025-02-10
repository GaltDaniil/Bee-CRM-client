import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { motion } from 'framer-motion';

import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { useAppDispatch, useAppSelector } from 'app/store';
import { ChangeEvent, useState } from 'react';
import {
    searchContact,
    selectFilteredContacts,
    selectSearchText,
    setContactsSearchText,
} from './store/contactsSlice';

/**
 * The contacts header.
 */
function ContactsHeader() {
    const dispatch = useAppDispatch();
    //const searchText = useAppSelector(selectSearchText);
    const filteredData = useAppSelector(selectFilteredContacts);

    const [type, setType] = useState('email');
    const [value, setValue] = useState('');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setType(newValue);
    };

    function handleSearch() {
        dispatch(searchContact({ type, value }));
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div className="p-24 sm:p-32 w-full border-b-1">
            <div className="flex flex-col items-center sm:items-start">
                <motion.span initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.2 } }}>
                    <Typography className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
                        Контакты
                    </Typography>
                </motion.span>
                <motion.span
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                >
                    <Typography
                        component={motion.span}
                        className="text-14 font-medium ml-2"
                        color="text.secondary"
                    >
                        {`${filteredData.length} контактов`}
                    </Typography>
                </motion.span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 -mx-8">
                <Box
                    component={motion.div}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
                >
                    <FuseSvgIcon color="action" size={20}>
                        heroicons-outline:search
                    </FuseSvgIcon>
                    <Tabs value={type} onChange={handleChange} aria-label="basic tabs example">
                        <Tab value={'name'} label="Имя" />
                        <Tab value={'email'} label="Почта" />
                        <Tab value={'phone'} label="Телефон" />
                    </Tabs>
                    <Input
                        placeholder="Поиск контактов"
                        className="flex flex-1 px-16"
                        disableUnderline
                        fullWidth
                        value={value}
                        inputProps={{
                            'aria-label': 'Search',
                        }}
                        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                            setValue(ev.target.value);
                        }}
                    />
                    <Button
                        onClick={handleSearch}
                        className="mx-8"
                        variant="contained"
                        color="secondary"
                    >
                        <span className="mx-8">Поиск</span>
                    </Button>
                </Box>
                <Button
                    className="mx-8"
                    variant="contained"
                    color="secondary"
                    component={NavLinkAdapter}
                    to="new/edit"
                >
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                    <span className="mx-8">Add</span>
                </Button>
            </div>
        </div>
    );
}

export default ContactsHeader;
