import React from "react";
import config from '../../config.json'
import { DisintComment } from "../../models/DisintComment";
import { CommentStandard } from "./CommentStandard";
import { Link } from "react-router-dom";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import { CommentBrief } from "./CommentBrief";
import './CommentNavigator.css'
import { IonAvatar, IonItem, IonLabel, IonList } from "@ionic/react";
import { LazyAvatar } from "../users/LazyAvatar";
import { PopoverButton } from "../shared/PopoverButton";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

class CommentNavigatorProps {
    query: CommentQuery;
    ref: any;
    component: string;
    id: string;
}

class CommentNavigatorState {
    comments: DisintComment<any>[] = [];
}

export class CommentNavigator extends React.Component<CommentNavigatorProps, CommentNavigatorState> {
    _parentComment: DisintComment<any>;
    _loading = false;
    _lastUsedQuery: CommentQuery;

    public constructor(props: CommentNavigatorProps) {
        super(props);
        this.state = new CommentNavigatorState();
    }

    async componentDidMount() {
        await this.loadComments();
    }

    async loadComments() {
        if (this._loading) return
        this._loading = true;

        this._lastUsedQuery = this.props.query;
        const comments = await commentQueryService.query(this.props.query);

        this.setState({ comments });

        this._loading = false;
    }

    commentComponent(comment: DisintComment<any>) {
        if (this.props.component == "CommentStandard") {
            return <CommentStandard comment={comment}></CommentStandard>
        } else if (this.props.component == "CommentBrief") {
            return <CommentBrief comment={comment}></CommentBrief>
        } else {
            return null;
        }
    }

    async reloadCommentsIfQueryChanged() {
        //console.log("CommentNavigator", this.props.query)
        if (!this._lastUsedQuery) return;

        const isSameQuery = await this._lastUsedQuery.isEqual(this.props.query);

        if (!isSameQuery) {
            await this.loadComments();
        }
    }


    render() {
        this.reloadCommentsIfQueryChanged();

        let comments = this.state.comments?.map((c: DisintComment<any>, index: number) => {
            return (
                <Draggable draggableId={this.props.id + '-' + c.id} index={index} key={c.id} >
                    {(provided, snapshot) => (
                        
                        <IonItem button style={{ marginBottom: '10px', left: '0px!important' }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <LazyAvatar userId={c.userId}>

                            </LazyAvatar>
                            <Link className="nostyle" to={"/comments/" + c.id} key={c.id} style={{ display: 'flex', flex: 'auto' }}>
                                {this.commentComponent(c)}
                                <div style={{ marginBottom: '10px' }}></div>
                            </Link>
                            <span style={{ marginBottom: 'auto' }}>
                                <PopoverButton>
                                </PopoverButton>
                            </span>

                        </IonItem>
                    )}
                </Draggable>
            )
            // return <div key={c.id}>
            //     {this.commentComponent(c)}
            // </div>
        })

        return (
            <Droppable droppableId={this.props.id} isCombineEnabled
                renderClone={(provided, snapshot, rubric) => {
                    /** This could use the id to look up the item height and return a cheaper render */
                    return <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <pre>
TODO: 
    * How to get DOM clone or simple div with matching height inside renderClone, rather than re-rendering the entire item?
    * Highlighting target drop node or placeholder
    * Scrolling while dragging
    * opening menus when close to sides in mobile mode
    * opening or toggling accordians while dragging
    * Dropping, copying, moving
    * Dragging multiple
    * Keyboard navigation and selecting multiple
                        </pre>
                    </div>
                }}
            >
                {(provided, snapshot) => (
                    <div>
                        {provided.placeholder}
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {comments}
                        </div>
                    </div>
                )}
            </Droppable>
        )

    }
}
