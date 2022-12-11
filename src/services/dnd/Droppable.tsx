import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export interface DroppableProps {
    id: string;
    containerId?: string;
    index?: number;
    children?: any;
    isTrash?: boolean;

}

export function Droppable(props: DroppableProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
        data: props
    });

    const style = {
    } as any;

    if (props.isTrash) {
        style.opacity = isOver ? 1 : 0.2;
    }

    return (
        <div ref={setNodeRef} style={style} >
            {props.children}
        </div>
    );
}