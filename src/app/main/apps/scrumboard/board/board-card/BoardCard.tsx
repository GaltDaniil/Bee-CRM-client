import _ from '@lodash';
import react from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from 'app/store';
import { AvatarGroup } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MouseEvent, useEffect } from 'react';
import { openCardDialog } from '../../store/cardSlice';
import { selectCardById } from '../../store/cardsSlice';
import BoardCardLabel from './BoardCardLabel';
import { selectMembers } from '../../store/membersSlice';
import BoardCardDueDate from './BoardCardDueDate';
import BoardCardCheckItems from './BoardCardCheckItems';
import { selectBoard } from '../../store/boardSlice';
import { CardType } from '../../types/CardType';
import { makeStyles } from '@mui/styles';
import { getContact } from '../../../contacts/store/contactSlice';
import { ContactType, ContactsType } from '../../../contacts/types/ContactType';
import moment from 'moment';
import { selectUsers } from 'app/store/user/userListSlice';
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';

const StyledCard = styled(Card)(({ theme }) => ({
    '& ': {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
}));

type BoardCardProps = {
    cardId: string;
    index: number;
};

const formateTime = (time) => {
    const dateObject = new Date(time);
    return Math.floor(dateObject.getTime());
};

/**
 * The board card component.
 */
function BoardCard(props: BoardCardProps) {
    const { cardId, index } = props;

    const dispatch = useAppDispatch();
    const { data: board } = useAppSelector(selectBoard);
    const card = useAppSelector(selectCardById(cardId));
    const [contact, setContact] = react.useState<ContactType>();
    const [date, setDate] = react.useState<string>();
    const users = useAppSelector(selectUsers);

    /* react.useEffect(() => {
        const fx = async () => {
            if (card) {
                const contactData = await dispatch(getContact(card.contact_id));
                setContact((prev) => contactData.payload);
                const formattedDate = moment('2024-02-14T13:42:02.581Z').format('DD MMM HH:mm');
                setDate((prev) => formattedDate);
            }
        };
        fx();
    }, [card]); */
    //const commentsCount = getCommentsCount(card);
    /* const cardCoverImage = _.find(card.attachments, { id: card.card_attachmentCoverId }); */

    const useStyles = makeStyles({
        textTwoLines: {
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    });
    const classes = useStyles();
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

    function handleCardClick(ev: MouseEvent<HTMLDivElement>, _card: CardType) {
        ev.preventDefault();

        dispatch(openCardDialog({ ..._card }));
    }

    /* function getCommentsCount(_card: CardType) {
        return _.sum(_card.card_activities.map((x) => (x.type === 'comment' ? 1 : 0)));
    } */

    if (!board) {
        return null;
    }

    return (
        <Draggable draggableId={cardId} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <StyledCard
                        className={clsx(
                            snapshot.isDragging ? 'shadow-lg' : 'shadow',
                            'w-full mb-12 rounded-lg cursor-pointer',
                        )}
                        onClick={(ev) => handleCardClick(ev, card)}
                    >
                        {/* {board.settings.cardCoverImages && cardCoverImage && (
                            <img className="block" src={cardCoverImage.src} alt="card cover" />
                        )} */}
                        {card && card.contact ? (
                            <div className="p-16 pb-0 flex">
                                <FuseSvgIcon className="pr-6" size={20} color="action">
                                    heroicons-outline:user
                                </FuseSvgIcon>
                                {card.contact.contact_name}
                            </div>
                        ) : null}
                        {card ? (
                            <div className="p-16 pb-0 pt-4 flex">
                                {/* {card.card_labels.length > 0 && (
                                <div className="flex flex-wrap mb-8 -mx-4">
                                    {card.card_labels.map((id) => (
                                        <BoardCardLabel id={id} key={id} />
                                    ))}
                                </div>
                            )} */}
                                {/* <FuseSvgIcon className="pr-6" size={20} color="action">
                                heroicons-outline:shopping-cart
                            </FuseSvgIcon> */}
                                <div
                                    className={`${statusColor(
                                        card.card_deal_status,
                                    )} min-w-4 mr-4 rounded-tl-lg rounded-bl-lg`}
                                ></div>
                                <Typography className={`${classes.textTwoLines} font-medium mb-2 `}>
                                    {card?.card_deal_title}
                                </Typography>

                                {/* {(card.dueDate || card.card_checklists.length > 0) && (
                                <div className="flex items-center mb-12 -mx-4">
                                    <BoardCardDueDate dueDate={card.dueDate} />

                                    <BoardCardCheckItems card={card} />
                                </div>
                            )} */}
                            </div>
                        ) : null}

                        <div className="flex justify-between h-48 px-16">
                            <div className="flex items-center space-x-4">
                                {/* {card?.card_subscribed && (
                                    <FuseSvgIcon size={16} color="action">
                                        heroicons-outline:eye
                                    </FuseSvgIcon>
                                )} */}

                                {/* {card.card_description !== '' && (
                                    <FuseSvgIcon size={16} color="action">
                                        heroicons-outline:document-text
                                    </FuseSvgIcon>
                                )} */}

                                {card ? (
                                    <span className="flex items-center space-x-2">
                                        <FuseSvgIcon className="pr-4" size={16} color="action">
                                            heroicons-outline:clock
                                        </FuseSvgIcon>
                                        <Typography color="text.secondary">
                                            {card.createdAt
                                                ? format(
                                                      formateTime(card.createdAt),
                                                      'dd MMM HH:mm',
                                                      { locale: ru },
                                                  )
                                                : 0}
                                        </Typography>
                                    </span>
                                ) : null}
                                {card ? (
                                    <span className="flex items-center space-x-2">
                                        <FuseSvgIcon size={16} color="action">
                                            heroicons-outline:cash
                                        </FuseSvgIcon>
                                        <Typography color="text.secondary">
                                            {card.card_deal_price ? card.card_deal_price : 0}
                                        </Typography>
                                    </span>
                                ) : null}
                                {/* {commentsCount > 0 && (
                                    <span className="flex items-center space-x-2">
                                        <FuseSvgIcon size={16} color="action">
                                            heroicons-outline:chat
                                        </FuseSvgIcon>

                                        <Typography color="text.secondary">
                                            {commentsCount}
                                        </Typography>
                                    </span>
                                )} */}
                            </div>

                            {card ? (
                                <div className="flex items-center justify-end space-x-12">
                                    {card.memberIds.length > 0 && (
                                        <div className="flex justify-start">
                                            <AvatarGroup
                                                max={3}
                                                classes={{ avatar: 'w-24 h-24 text-12' }}
                                            >
                                                {card.memberIds.map((user_id) => {
                                                    const member = _.find(users, { user_id });
                                                    return (
                                                        <Tooltip
                                                            title={member?.data.user_name}
                                                            key={user_id}
                                                        >
                                                            <Avatar
                                                                key={index}
                                                                alt="member"
                                                                src={`https://beechat.ru/${member?.data.user_photo_url}`}
                                                            />
                                                        </Tooltip>
                                                    );
                                                })}
                                            </AvatarGroup>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </StyledCard>
                </div>
            )}
        </Draggable>
    );
}

export default BoardCard;
