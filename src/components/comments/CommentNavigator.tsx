import React from "react";
import config from '../../config.json'
import { DisintComment } from "../../models/DisintComment";
import { CommentStandard } from "./CommentStandard";
import { Link } from "react-router-dom";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import { CommentBrief } from "./CommentBrief";

class CommentNavigatorProps {
    query: CommentQuery;
    ref: any;
    component: string;
}

class CommentNavigatorState {
    comments: DisintComment<any>[] = [];
}

export class CommentNavigator extends React.Component<CommentNavigatorProps, CommentNavigatorState> {
    _parentComment: DisintComment<any>;
    _loading = false;

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

    render() {

        let comments = this.state.comments?.map((c: DisintComment<any>) => {
            return <Link to={"/comments/" + c.id} key={c.id}>
                {this.commentComponent(c)}
            </Link>
        })

        return <div>
            <h3>
                Comments
            </h3>
            {comments}
        </div>

    }
}
