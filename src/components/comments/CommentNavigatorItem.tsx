import React, { useState } from "react";
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
import { commentService } from "../../services/comments/CommentService";
import { selectionService } from "../../services/dnd/SelectionService";

class CommentNavigatorItemProps {
    comment?: DisintComment<any>;
    commentId?: string;
    component?: string;
    containerId: string;
    domId: string;
    overlay?: boolean = false;
}


export const CommentNavigatorItem: React.FC<CommentNavigatorItemProps> = (props) => {

    const component = props.component || "CommentBrief";
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.domId || "", data: { itemId: props.comment?.id || "", containerId: props.containerId } });

    const [comment, setComment] = useState<DisintComment<any> | undefined>(props.comment);

    if (!comment) console.log("current dragId", selectionService.activeDomId, props.commentId, component);
    if (!comment && props.commentId) {

        // TODO: load up component view somehow?  look at target container, or source dnd item to determine which view to use?
        commentService.load(props.commentId).then(c => {
            console.log("loaded", c)
            setComment(c)
        });
    }

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        left: '0px!important'
    };

    //console.log(attributes, listeners, setNodeRef, transform, transform);

    let commentComponent = (comment: DisintComment<any> | undefined) => {
        if (!comment) {
            return <div>{props.containerId}</div>;
        } else {
            if (component == "CommentStandard") {
                return <CommentStandard comment={comment}></CommentStandard>
            } else if (component == "CommentBrief") {
                return <CommentBrief comment={comment}></CommentBrief>
            } else {
                return null;
            }

        }
    }

    //if (props.overlay) console.log(comment);
    return (
        /*<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.id}    
        </div>*/
        <div className="dnd-droppable" id={props.domId}>
            <IonItem ref={setNodeRef} style={style} {...attributes} {...listeners} button>
                <LazyAvatar userId={comment?.userId || ""}>

                </LazyAvatar>
                <Link className="nostyle" to={"/comments/" + props.comment?.id} style={{ display: 'flex', flex: 'auto' }}>
                    {commentComponent(props.comment || comment)}
                    <div style={{ marginBottom: '10px' }}></div>
                </Link>
                <span style={{ marginBottom: 'auto' }}>
                    <PopoverButton>
                    </PopoverButton>
                </span>
            </IonItem>
        </div>
    )
}
