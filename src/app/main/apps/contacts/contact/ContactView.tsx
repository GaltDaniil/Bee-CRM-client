import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import format from 'date-fns/format';
import _ from '@lodash';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getContact, selectContact } from '../store/contactSlice';
import { selectCountries } from '../store/countriesSlice';
import { selectTags } from '../store/tagsSlice';
import { SERVER_IP } from 'app/configs/routesConfig';
import { getChat, getChatByContactId, selectChatById } from '../../chat/store/chatListSlice';
import BoardCardDialog from '../../scrumboard/board/dialogs/card/BoardCardDialog';

/**
 * The contact view.
 */
function ContactView() {
    const { data: contact, status } = useAppSelector(selectContact);
    const countries = useAppSelector(selectCountries);
    const tags = useAppSelector(selectTags);
    const routeParams = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fx = async () => {
            dispatch(getContact(routeParams.id));
            dispatch(getChat(routeParams.id));
        };
        fx();
    }, [dispatch, routeParams]);

    function getCountryByIso(iso: string) {
        return countries.find((country) => country.iso === iso);
    }

    if (status === 'loading') {
        return <FuseLoading className="min-h-screen" />;
    }

    const statusColor = (status) => {
        if (status === 'Новый') {
            return 'bg-orange-300';
        } else if (status === 'В работе') {
            return 'bg-blue-400';
        } else if (status === 'Завершен') {
            return 'bg-green-500';
        } else if (status === 'Отменен') {
            return 'bg-grey-500';
        } else {
            return 'bg-black-500';
        }
    };

    if (!contact) {
        return null;
    }

    console.log('contact.cards', contact.cards);

    return (
        <>
            <Box
                className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
                sx={{
                    backgroundColor: 'background.default',
                }}
            >
                {/* {contact.background && (
                    <img
                        className="absolute inset-0 object-cover w-full h-full"
                        src={contact.background}
                        alt="user background"
                    />
                )} */}
            </Box>
            <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
                <div className="w-full max-w-3xl">
                    <div className="flex flex-auto items-end -mt-64">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary',
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={SERVER_IP + contact.contact_photo_url}
                            alt={contact.contact_name}
                        >
                            {contact?.contact_name?.charAt(0)}
                        </Avatar>
                        <div className="flex items-center ml-auto mb-4">
                            <Button
                                variant="contained"
                                color="secondary"
                                component={NavLinkAdapter}
                                to="edit"
                            >
                                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                                <span className="mx-8">Редактировать</span>
                            </Button>
                        </div>
                    </div>

                    <Typography className="mt-12 text-4xl font-bold truncate">
                        {contact.contact_name}
                    </Typography>

                    {/* <div className="flex flex-wrap items-center mt-8">
                        {contact?.tags?.map((id) => (
                            <Chip
                                key={id}
                                label={_.find(tags, { id })?.title}
                                className="mr-12 mb-12"
                                size="small"
                            />
                        ))}
                    </div> */}

                    <Divider className="mt-16 mb-24" />

                    <div className="flex flex-col space-y-32">
                        {/* {contact.title && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{contact.title}</div>
							</div>
						)} */}

                        {/* {contact.company && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
								<div className="ml-24 leading-6">{contact.company}</div>
							</div>
						)} */}

                        <div className="flex">
                            <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
                            <div className="min-w-0 ml-24 space-y-4">
                                <div className="flex items-center leading-6">
                                    {/* <a
                                        className="hover:underline text-primary-500"
                                        href={`mailto: ${contact.contact_email}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    > */}
                                    {contact.contact_email ? contact.contact_email : 'Отсутствует'}
                                    {/* </a> */}
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
                            <div className="min-w-0 ml-24 space-y-4">
                                <div className="flex items-center leading-6">
                                    {/*  <Box
                                            className="hidden sm:flex w-24 h-16 overflow-hidden"
                                            sx={{
                                                background:
                                                    "url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
                                                backgroundSize: '24px 3876px',
                                                backgroundPosition: getCountryByIso(item.country)
                                                    ?.flagImagePos,
                                            }}
                                        /> */}

                                    {/* <div className="sm:ml-12 font-mono">
                                                        {getCountryByIso(item.country)?.code}
                                                    </div> */}

                                    <div className="ml-10 font-mono">
                                        {contact.contact_phone
                                            ? contact.contact_phone
                                            : 'Отсутствует'}
                                    </div>

                                    {/* {item.label && (
                                                        <Typography
                                                            className="text-md truncate"
                                                            color="text.secondary"
                                                        >
                                                            <span className="mx-8">&bull;</span>
                                                            <span className="font-medium">
                                                                {item.label}
                                                            </span>
                                                        </Typography>
                                                    )} */}
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
                            <div className="min-w-0 ml-24 space-y-4">
                                <div className="flex items-center leading-6">
                                    {/* <a
                                        className="hover:underline text-primary-500"
                                        href={`mailto: ${contact.contact_email}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    > */}
                                    {contact.contact_email ? contact.contact_email : 'Отсутствует'}
                                    {/* </a> */}
                                </div>
                            </div>
                        </div>

                        {contact.cards.length > 0 && (
                            <div className="flex flex-col">
                                <div>Ссылка на GetCourse:</div>
                                <a href={contact.cards[0].card_deal_url}>Перейти</a>
                            </div>
                        )}

                        {contact.cards.length > 0 && (
                            <div className="flex flex-col">
                                <div className="mb-4">Заказы:</div>
                                {contact.cards.map((el, i) => (
                                    <div className="flex" key={i}>
                                        <div className="flex">
                                            <div>{el.card_deal_title}</div>
                                            <div
                                                className={`${statusColor(
                                                    el.card_deal_status,
                                                )} ml-4 mr-4 pl-4 pr-4 rounded-4 text-white`}
                                            >
                                                {el.card_deal_status}
                                            </div>
                                        </div>

                                        <a
                                            href={`https://beechat.ru/apps/scrumboard/boards/${el.board_id}/card/${el.card_id}`}
                                        >
                                            открыть
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* {contact.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">{format(new Date(contact.birthday), 'MMMM d, y')}</div>
							</div>
						)} */}

                        {/* {contact.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
								<div
									className="max-w-none ml-24 prose dark:prose-invert"
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{ __html: contact.notes }}
								/>
							</div>
						)} */}
                    </div>
                </div>
            </div>
            <BoardCardDialog />
        </>
    );
}

export default ContactView;
