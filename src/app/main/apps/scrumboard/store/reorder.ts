import _ from '@lodash';
import { DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { BoardListsType } from '../types/BoardListType';

// a little function to help us with reordering the result
const reorder = (
    list: string[],
    startIndex: DraggableLocation['index'],
    endIndex: DraggableLocation['index'],
) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default reorder;

/**
 * Reorder Quote Map
 */
export const reorderQuoteMap = (
    lists: BoardListsType,
    source: DropResult['source'],
    destination: DropResult['destination'],
) => {
    const current = _.find(lists, { list_id: source.droppableId });
    const next = _.find(lists, { list_id: destination?.droppableId });
    const target = current.list_cards[source.index];

    // moving to same list
    if (source.droppableId === destination?.droppableId) {
        const reordered = reorder(current.list_cards, source.index, destination.index);
        return lists.map((list) => {
            if (list.list_id === source.droppableId) {
                list.list_cards = reordered;
            }
            return list;
        });
    }

    // moving to different list

    // remove from original
    current.list_cards.splice(source.index, 1);

    // insert into next
    next.list_cards.splice(destination?.index, 0, target);

    return lists.map((list) => {
        if (list.list_id === source.droppableId) {
            return current;
        }
        if (list.list_id === destination?.droppableId) {
            return next;
        }
        return list;
    });
};
