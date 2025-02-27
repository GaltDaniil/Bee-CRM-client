import Paper from '@mui/material/Paper';

import { useRef, useState } from 'react';

import { AttachmentType } from '../../scrumboard/types/AttachmentType';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Avatar } from '@mui/material';

type ChatAttachmentProps = {
    attachment: AttachmentType;
    /* makeCover: (id: string) => void;
    removeCover: () => void; */
    /* removeAttachment: (id: string) => void; */
};

/**
 * The card attachment component.
 */
function CardAttachment(props: ChatAttachmentProps) {
    const { attachment } = props;
    const BASE_URL = 'https://beechat.ru/';
    const fullSrc = `${BASE_URL}${attachment.attachment_src}`;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const dateObject = new Date(attachment.createdAt);
    const time = Math.floor(dateObject.getTime() / 1000);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(
        attachment.attachment_payload ? attachment.attachment_payload.duration : 0,
    );
    const audioRef = useRef(null);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    /* function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    } */

    /* function handleMenuClose() {
        setAnchorEl(null);
    } */

    switch (attachment.attachment_type) {
        case 'image': {
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center min-w-128 w-128 ">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block w-full"
                                src={attachment.attachment_src}
                                alt="attachment"
                            />
                        </Paper>
                    </div>
                    <a
                        className="text-white w-full mt-4 font-semibold whitespace-normal text-sm"
                        color="white"
                        target="_blank"
                        href={attachment.attachment_src}
                    >
                        Открыть изображение
                    </a>
                </div>
            );
        }
        case 'photo': {
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justifyW-center min-w-128 w-128 ">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block w-full"
                                src={attachment.attachment_src}
                                alt="attachment"
                            />
                        </Paper>
                    </div>
                    <a
                        className="text-white w-full mt-4 font-semibold whitespace-normal text-sm"
                        color="white"
                        target="_blank"
                        href={attachment.attachment_src}
                    >
                        Открыть изображение
                    </a>
                </div>
            );
        }
        case 'document': {
            const isImage = /\jpg|jpeg|png$/i.test(attachment.attachment_extension);
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center min-w-128 w-128">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block w-full"
                                src={
                                    isImage
                                        ? attachment.attachment_src
                                        : 'https://beechat.ru/assets/icons/doc.png'
                                }
                                alt="attachment"
                            />
                        </Paper>
                    </div>

                    <a
                        className="text-white mt-4 font-semibold whitespace-normal text-sm"
                        color="white"
                        target="_blank"
                        href={attachment.attachment_src}
                    >
                        Открыть документ
                    </a>
                </div>
            );
        }
        /* case 'voice': {
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center w-full max-w-md">
                        <Paper className="flex items-center w-full p-2 shadow">
                            <audio
                                controls
                                className="w-full"
                                style={{
                                    height: '40px', // Компактный размер, как в мессенджерах
                                    background: '#f0f0f0', // Светлый фон
                                    borderRadius: '8px', // Закругленные углы
                                }}
                            >
                                <source src={fullSrc} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </Paper>
                    </div>
                    <a
                        className="text-white mt-4 font-semibold whitespace-normal text-sm"
                        color="white"
                        target="_blank"
                        href={fullSrc}
                    >
                        Скачать аудио
                    </a>
                </div>
            );
        } */
        case 'audio': {
            return (
                <div className="flex flex-col w-full mb-4 px-4" key={attachment.attachment_id}>
                    <style>{`
                        input[type="range"]::-webkit-slider-thumb {
                            width: 8px;
                            height: 8px;
                            background: #3b82f6;
                            border-radius: 50%;
                            cursor: pointer;
                            -webkit-appearance: none;
                        }
                        input[type="range"]::-moz-range-thumb {
                            width: 8px;
                            height: 8px;
                            background: #3b82f6;
                            border-radius: 50%;
                            cursor: pointer;
                        }
                    `}</style>
                    <div className="flex items-center justify-center w-full max-w-md">
                        <Paper
                            className="flex items-center w-full p-2 shadow"
                            style={{ borderRadius: '10px' }}
                        >
                            <button
                                onClick={togglePlayPause}
                                className="flex items-center justify-center rounded-full hover:bg-blue-600 text-white focus:outline-none"
                            >
                                {isPlaying ? (
                                    <FuseSvgIcon className="text-24" color="action">
                                        heroicons-solid:pause
                                    </FuseSvgIcon>
                                ) : (
                                    <FuseSvgIcon className="text-24" color="action">
                                        heroicons-solid:play
                                    </FuseSvgIcon>
                                )}
                            </button>
                            <div className="flex flex-col flex-grow ml-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #3b82f6 ${
                                            (currentTime / duration) * 100
                                        }%, #e5e7eb ${(currentTime / duration) * 100}%)`,
                                    }}
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </Paper>
                    </div>
                    <a
                        className="text-blue-500 mt-2 font-semibold whitespace-normal text-sm hover:text-blue-600"
                        target="_blank"
                        href={fullSrc}
                        download
                    >
                        Скачать аудио
                    </a>

                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                        src={fullSrc}
                    />
                </div>
            );
        }
        case 'video':
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center w-full max-w-md">
                        <Paper className="overflow-hidden shadow">
                            <video controls className="w-full" style={{ maxHeight: '300px' }}>
                                <source
                                    src={fullSrc}
                                    type={`video/${
                                        attachment.attachment_extension?.slice(1) || 'mp4'
                                    }`}
                                />
                                Your browser does not support the video element.
                            </video>
                        </Paper>
                    </div>
                    {attachment.attachment_payload?.duration && (
                        <span className="text-gray-500 text-xs mt-1">
                            Длительность: {Math.floor(attachment.attachment_payload.duration / 60)}:
                            {attachment.attachment_payload.duration % 60} сек
                        </span>
                    )}
                    <a
                        className="text-white mt-4 font-semibold whitespace-normal text-sm"
                        target="_blank"
                        href={fullSrc}
                    >
                        Скачать видео
                    </a>
                </div>
            );
        case 'market':
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center min-w-128 w-128">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block w-full"
                                src={
                                    attachment.attachment_payload?.photo_url ||
                                    `${BASE_URL}assets/icons/market.png`
                                }
                                alt={attachment.attachment_name}
                            />
                        </Paper>
                    </div>
                    <div className="mt-4 text-white">
                        <p>
                            <strong>{attachment.attachment_payload?.title}</strong>
                        </p>
                        <p>{attachment.attachment_payload?.description}</p>
                        <p>Цена: {attachment.attachment_payload?.price}</p>
                    </div>
                    {attachment.attachment_payload?.photo_url && (
                        <a
                            className="text-white mt-4 font-semibold whitespace-normal text-sm"
                            target="_blank"
                            href={attachment.attachment_payload.photo_url}
                        >
                            Открыть товар
                        </a>
                    )}
                </div>
            );
        case 'reply1':
            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm">
                            Ответ на сообщение #{attachment.attachment_payload?.reply_message_id}:
                        </p>
                        <p className="text-gray-900">{attachment.attachment_payload?.reply_text}</p>
                    </div>
                </div>
            );

        case 'reply':
            const reply = attachment.attachment_payload;
            const sender = reply?.reply_from;
            const senderName = sender?.first_name || sender?.username || 'Неизвестный';
            const replyText = reply?.reply_text || 'Сообщение без текста';
            const replyMessageId = reply?.reply_message_id;

            // Заглушка для аватара (можно подтянуть реальный URL из API)
            const avatarSrc = sender?.is_bot
                ? 'https://via.placeholder.com/40?text=Bot' // Заглушка для бота
                : 'https://via.placeholder.com/40'; // Заглушка для пользователя

            return (
                <div className="flex flex-col w-full mb-16 px-16" key={attachment.attachment_id}>
                    <div
                        className="bg-white p-3 rounded-lg shadow-md border-l-4 border-blue-500"
                        style={{ maxWidth: '100%' }}
                    >
                        <div className="flex items-start gap-2">
                            <Avatar src={avatarSrc} alt={senderName} className="w-10 h-10" />
                            <div className="flex-1">
                                <p className="text-gray-800 font-semibold text-sm mb-1">
                                    {senderName}
                                </p>
                                <p className="text-gray-600 text-sm ">{replyText}</p>
                                {/* <a
                                    className="text-blue-600 text-xs mt-1 inline-block hover:underline"
                                    href={`/messages/${replyMessageId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Посмотреть оригинал (#{replyMessageId})
                                </a> */}
                            </div>
                        </div>
                    </div>
                </div>
            );
        /* case 'link': {
            return (
                <div className="flex w-full sm:w-1/2 mb-16 px-16" key={attachment.attachment_id}>
                    <Paper className="min-w-128 w-128 h-128 flex items-center justify-center rounded-4 overflow-hidden shadow">
                        <Typography className="font-semibold">LINK</Typography>
                    </Paper>
                    <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
                        <Typography className="text-16 font-semibold truncate w-full">
                            {attachment.attachment_url}
                        </Typography>
                        <Typography className="truncate w-full mb-12" color="text.secondary">
                            {time}
                        </Typography>
                        <Button
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            variant="outlined"
                            size="small"
                            endIcon={
                                <FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>
                            }
                        >
                            Действия
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    removeAttachment(item.attachment_id);
                                }}
                            >
                                Удалить файл
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            );
        } */

        /* case 'file': {
            return (
                <div className="flex w-full sm:w-1/2 mb-16 px-16" key={attachment.attachment_id}>
                    <Paper className="min-w-128 w-128 h-128 flex items-center justify-center rounded-4 overflow-hidden shadow">
                        <Typography className="font-semibold">LINK</Typography>
                    </Paper>
                    <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
                        <Typography className="text-16 font-semibold truncate w-full">
                            {attachment.attachment_url}
                        </Typography>
                        <Typography className="truncate w-full mb-12" color="text.secondary">
                            {time}
                        </Typography>
                        <Button
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            variant="outlined"
                            size="small"
                            endIcon={
                                <FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>
                            }
                        >
                            Действия
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    removeAttachment(item.attachment_id);
                                }}
                            >
                                Удалить файл
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            );
        } */
        /* case 'market': {
            return (
                <div className="flex w-full sm:w-1/2 mb-16 px-16" key={attachment.attachment_id}>
                    <div className="flex items-center justify-center min-w-128 w-128 h-128">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block max-h-full"
                                src={attachment.attachment_market.photo_url}
                                alt="attachment"
                            />
                        </Paper>
                    </div>
                    <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
                        <div className="flex flex-col max-w-120">
                            <Typography className="text-16 font-semibold shrink">
                                {attachment.attachment_market.title}
                            </Typography>
                            <Typography className="text-6 max-h-60 whitespace-normal truncate overflow-hidden shrink">
                                {attachment.attachment_market.description}
                            </Typography>
                        </div>
                    </div>
                </div>
            );
        } */
        default: {
            return null;
        }
    }
}

export default CardAttachment;
