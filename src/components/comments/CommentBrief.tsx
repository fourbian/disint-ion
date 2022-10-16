import React from "react";
import { DisintComment } from "../../models/DisintComment";
import "./CommentBrief.css"
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { commentService } from "../../services/comments/CommentService";
import { commentQueryService } from "../../services/comments/CommentQueryService";

export class CommentBriefProps {
  comment?: DisintComment<any>;
  commentId?: string;
}

export class CommentBriefState {
  constructor(state?: any) {
    if (state) {
      Object.assign(this, state);
    }
  }

  public comment: DisintComment<any>;
}

export class CommentBrief extends React.Component<CommentBriefProps, CommentBriefState> {
  loadCommentPromise: Promise<DisintComment<any>>;
  markdownController: MarkdownController = new MarkdownController();

  constructor(props: CommentBriefProps) {
    super(props);
    this.state = new CommentBriefState({ comment: this.props.comment });
  }

  loadComment() {
    if (!this.props.comment && !this.state.comment && this.props.commentId) {
      this.loadCommentPromise = this.loadCommentPromise || commentService.load(this.props.commentId)
        .then(comment => this.setState({ comment }));
    }
  }

  render() {
    this.loadComment();

    if (!this.state.comment) return null;
    else return <div className="comment-hover" >
      <MarkdownEditor readonly={true} markdown={this.state.comment.content} onMarkdownControllerChange={(_) => this.markdownController = _}></MarkdownEditor>
    </div>
  }
} 
