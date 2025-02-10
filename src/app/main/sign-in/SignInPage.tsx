import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { InferType } from 'yup';
import * as yup from 'yup';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { UserType } from 'app/store/user';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup.string().email('You must enter a valid email').required('You must enter a email'),
    password: yup
        .string()
        .required('Please enter your password.')
        .min(4, 'Password is too short - must be at least 4 chars.'),
    remember: yup.boolean(),
});

const defaultValues = {
    email: '',
    password: '',
    remember: true,
};

/**
 * The sign in page.
 */
function SignInPage(props?) {
    const { control, formState, handleSubmit, setError, setValue } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const { onLogin } = props;

    const { isValid, dirtyFields, errors } = formState;

    /* useEffect(() => {
        setValue('email', 'galt@ya.ru', { shouldDirty: true, shouldValidate: true });
        setValue('password', '9293709Bb13', { shouldDirty: true, shouldValidate: true });
    }, [setValue]); */

    function onSubmit({ email, password }: InferType<typeof schema>) {
        jwtService
            .signInWithEmailAndPassword(email, password)
            .then((user: UserType) => {
                // eslint-disable-next-line no-console
                console.info(user);
                onLogin();

                // No need to do anything, user data will be set at app/auth/AuthContext
            })
            .catch(
                (
                    _errors: {
                        type: 'email' | 'password' | `root.${string}` | 'root';
                        message: string;
                    }[],
                ) => {
                    console.log('_errors', _errors);
                    _errors.forEach((error) => {
                        setError(error.type, {
                            type: 'manual',
                            message: error.message,
                        });
                    });
                },
            );
    }

    return (
        <div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
            <Paper className="flex h-full w-full items-center justify-center px-16 py-8 sm:p-48 md:p-64">
                <div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
                    {/* <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" /> */}

                    <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
                        Вход
                    </Typography>

                    <form
                        name="loginForm"
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
                                    label="Почта"
                                    autoFocus
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors?.email?.message}
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
                                    helperText={errors?.password?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <FormControl>
                                        <FormControlLabel
                                            label="Запомнить меня"
                                            control={<Checkbox size="small" {...field} />}
                                        />
                                    </FormControl>
                                )}
                            />

                            {/* <Link className="text-md font-medium" to="/pages/auth/forgot-password">
                                Забыли пароль?
                            </Link> */}
                        </div>

                        <Button
                            variant="contained"
                            color="secondary"
                            className=" mt-16 w-full"
                            aria-label="Sign in"
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            type="submit"
                            size="large"
                        >
                            Войти
                        </Button>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default SignInPage;
