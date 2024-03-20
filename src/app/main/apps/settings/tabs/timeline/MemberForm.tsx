import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import React, { SetStateAction } from 'react';
import UserType from 'app/store/user/UserType';

import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { InferType } from 'yup';
import * as yup from 'yup';
import _ from '@lodash';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Card } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppDispatch } from 'app/store';
import { createUser } from 'app/store/user/userSlice';

type IProps = {
    setFormBoxIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

function MemberForm(props: IProps) {
    const { control, formState, handleSubmit, setError, setValue } = useForm({
        mode: 'onChange',
    });
    const [role, setRole] = React.useState('choose');
    const dispatch = useAppDispatch();

    const container = {
        show: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
    };

    const { isValid, dirtyFields, errors } = formState;

    function onSubmit({ email, password, name }) {
        const params = {
            user_name: name,
            user_password: password,
            user_email: email,
            user_role: role,
        };
        dispatch(createUser(params));
        props.setFormBoxIsOpen(false);
    }

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full">
            <Card
                component={motion.div}
                variants={item}
                className="flex flex-col w-full px-32 pt-24"
            >
                <div className="flex justify-between items-center pb-16">
                    <Typography className="text-2xl font-semibold leading-tight">
                        Список пользователей
                    </Typography>
                    <Button
                        onClick={() => props.setFormBoxIsOpen((prev) => false)}
                        color="inherit"
                        size="small"
                        className="font-medium -mx-8"
                    >
                        Закрыть
                    </Button>
                </div>
                <form
                    name="memberForm"
                    noValidate
                    className="mt-32 flex w-full flex-col justify-center"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Email"
                                autoFocus
                                type="email"
                                error={!!errors.email}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Пароль"
                                type="password"
                                error={!!errors.password}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className="mb-24"
                                label="Имя"
                                type="name"
                                error={!!errors.name}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                className="mb-24"
                                label="Роль"
                                type="role"
                                error={!!errors.role}
                                variant="outlined"
                                required
                                fullWidth
                                value={role}
                                onChange={handleChange}
                            >
                                <MenuItem value={'choose'}>Выбрать роль</MenuItem>
                                <MenuItem value={'admin'}>Админ</MenuItem>
                                <MenuItem value={'manager'}>Менеджер</MenuItem>
                                <MenuItem value={'another'}>Другое</MenuItem>
                            </Select>
                        )}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        className=" mt-16 w-full"
                        disabled={_.isEmpty(dirtyFields) || !isValid}
                        aria-label="Sign in"
                        type="submit"
                        size="large"
                    >
                        Добавить
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
}

export default MemberForm;
