import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import _ from '@lodash';
import { CardType } from '../../types/CardType';

type BoardCardCheckItemsProps = {
    card: CardType;
};

/**
 * The board card check items component.
 */
function BoardCardCheckItems(props: BoardCardCheckItemsProps) {
    /* const { card } = props;

    const checkItemsChecked = getCheckItemsChecked(card);
    const checkItems = getCheckItems(card);

    function getCheckItemsChecked(_card: CardType) {
        return _.sum(
            _card.card_checklists.map((list) =>
                _.sum(list.checkItems.map((x) => (x.checked ? 1 : 0))),
            ),
        );
    }

    function getCheckItems(_card: CardType) {
        return _.sum(_card.card_checklists.map((x) => x.checkItems.length));
    }

    if (checkItems === 0) {
        return null;
    }

    return (
        <Chip
            size="small"
            className={clsx(
                'flex items-center font-semibold text-12 mx-4 mb-6',
                checkItemsChecked === checkItems ? 'bg-green text-white' : 'bg-grey-500 text-white',
            )}
            sx={{
                '& .MuiChip-icon': {
                    color: 'inherit',
                },
            }}
            icon={
                <FuseSvgIcon size={16} color="inherit">
                    heroicons-outline:check
                </FuseSvgIcon>
            }
            label={`${checkItemsChecked}/${checkItems}`}
        />
    ); */
}

export default BoardCardCheckItems;
