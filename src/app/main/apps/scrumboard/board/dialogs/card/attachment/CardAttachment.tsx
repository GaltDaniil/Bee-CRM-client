import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { MouseEvent, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { AttachmentType } from '../../../../types/AttachmentType';
import { CardType } from '../../../../types/CardType';

type CardAttachmentProps = {
    item: AttachmentType;
    card: CardType;
    /* makeCover: (id: string) => void;
    removeCover: () => void; */
    removeAttachment: (id: string) => void;
};

/**
 * The card attachment component.
 */
function CardAttachment(props: CardAttachmentProps) {
    const { item, card, removeAttachment } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dateObject = new Date(item.createdAt);
    const time = Math.floor(dateObject.getTime() / 1000);

    function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    switch (item.attachment_type) {
        case 'image': {
            return (
                <div className="flex w-full sm:w-1/2 mb-16 px-16" key={item.attachment_id}>
                    <div className="flex items-center justify-center min-w-128 w-128 h-128">
                        <Paper className="overflow-hidden shadow">
                            <img
                                className="block max-h-full"
                                src={item.attachment_src}
                                alt="attachment"
                            />
                        </Paper>
                    </div>
                    <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
                        <div className="flex items-center max-w-120">
                            <Typography className="text-16 font-semibold truncate shrink">
                                {item.attachment_name}
                            </Typography>
                            {/* {card.attachmentCoverId === item.id && (
								<FuseSvgIcon
									className="text-orange-300 mx-4"
									size={20}
								>
									heroicons-outline:start
								</FuseSvgIcon>
							)} */}
                        </div>
                        <Typography className="truncate w-full mb-12" color="text.secondary">
                            {format(fromUnixTime(time), 'Pp')}
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
                            id="actions-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {/* {card.attachmentCoverId !== item?.id ? (
								<MenuItem
									onClick={() => {
										handleMenuClose();
										makeCover(item?.id);
									}}
								>
									Make Cover
								</MenuItem>
							) : (
								<MenuItem
									onClick={() => {
										handleMenuClose();
										removeCover();
									}}
								>
									Remove Cover
								</MenuItem>
							)} */}
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
        }
        case 'link': {
            return (
                <div className="flex w-full sm:w-1/2 mb-16 px-16" key={item.attachment_id}>
                    <Paper className="min-w-128 w-128 h-128 flex items-center justify-center rounded-4 overflow-hidden shadow">
                        <Typography className="font-semibold">LINK</Typography>
                    </Paper>
                    <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
                        <Typography className="text-16 font-semibold truncate w-full">
                            {item.attachment_src}
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
        }
        default: {
            return null;
        }
    }
}

export default CardAttachment;
