import React from "react";
import config from '../../config.json'
import { DisintComment } from "../../models/DisintComment";
import { CommentStandard } from "./CommentStandard";
import { Link } from "react-router-dom";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import { CommentBrief } from "./CommentBrief";
//import './CommentNavigatorItem.css'
import { IonAvatar, IonItem, IonLabel, IonList } from "@ionic/react";
import { LazyAvatar } from "../users/LazyAvatar";
import { PopoverButton } from "../shared/PopoverButton";
import { DragDropContext, Draggable, DraggableProvided, DraggableRubric, DraggableStateSnapshot, Droppable } from 'react-beautiful-dnd';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

class CommentNavigatorItemProps {
    comment: DisintComment<any>;
    component: string;
    domId: string;
}

export const CommentNavigatorItem: React.FC<CommentNavigatorItemProps> = (props) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.domId});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '10px',
        left: '0px!important'
    };

    //console.log(attributes, listeners, setNodeRef, transform, transform);

    let commentComponent = (comment: DisintComment<any>) => {

        if (props.component == "CommentStandard") {
            return <CommentStandard comment={comment}></CommentStandard>
        } else if (props.component == "CommentBrief") {
            return <CommentBrief comment={comment}></CommentBrief>
        } else {
            return null;
        }
    }

    return (
        /*<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.id}    
        </div>*/
        <IonItem ref={setNodeRef} style={style} {...attributes} {...listeners} button>
            <LazyAvatar userId={props.comment.userId}>

            </LazyAvatar>
            <Link className="nostyle" to={"/comments/" + props.comment.id} style={{ display: 'flex', flex: 'auto' }}>
                {commentComponent(props.comment)}
                <div style={{ marginBottom: '10px' }}></div>
            </Link>
            <span style={{ marginBottom: 'auto' }}>
                <PopoverButton>
                </PopoverButton>
            </span>
        </IonItem>
    )
}
