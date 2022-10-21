import React from "react";
import { DisintComment } from "../../models/DisintComment";
import "./CommentEditor.css"
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { commentService } from "../../services/comments/CommentService";
import { commentQueryService } from "../../services/comments/CommentQueryService";
import { debounceTime, Subscription, tap } from "rxjs";
import { serviceBus } from "../../services/bus/ServiceBus";
import { EditExistingCommentEvent } from "../../services/bus/EditExistingCommentEvent";
import { IServiceBusEvent } from "../../services/bus/IServiceBusEvent";
import { RequestSaveCommentEvent } from "../../services/bus/RequestSaveCommentEvent";
import { userService } from "../../services/users/UserService";
import { UserProfile } from "../../models/UserProfile";

export class CommentEditorProps {
  comment?: DisintComment<any>;
  commentId?: string;
}

export class CommentEditorState {
  constructor(state?: any) {
    if (state) {
      Object.assign(this, state);
    }
  }

  public comment: DisintComment<any>;
  public readonly: boolean = true;
}

export class CommentEditor extends React.Component<CommentEditorProps, CommentEditorState> {
  loadCommentPromise: Promise<DisintComment<any>>;
  markdownController: MarkdownController = new MarkdownController();
  markdownControllerSubscription: Subscription;
  serviceBusSubscription: Subscription;
  originalMarkdown: string;
  user: UserProfile;

  constructor(props: CommentEditorProps) {
    super(props);
    this.state = new CommentEditorState({ comment: this.props.comment });
    this.setCommentState(new DisintComment({ comment: this.props.comment }));
    userService.readCurrentUserProfile().then(u => this.user = u);
  }

  componentDidMount() {
    this.serviceBusSubscription = serviceBus.subscribe(this.onServiceBusEvent.bind(this));
  }

  async onServiceBusEvent(serviceBusEvent: IServiceBusEvent) {
    if (serviceBusEvent instanceof RequestSaveCommentEvent) {
      let e = serviceBusEvent as RequestSaveCommentEvent;
      if (e.id == this.state?.comment?.id) {
        await this.updateContent(this.markdownController.getMarkdown());
      }
    }
  }

  loadComment() {
    if (!this.props.comment && !this.state.comment && this.props.commentId) {
      this.loadCommentPromise = this.loadCommentPromise || commentService.load(this.props.commentId)
        .then(comment => this.setCommentState(comment));
    }
  }

  async updateContent(content: string) {
    let comment = new DisintComment(this.state.comment);
    comment.content = content;
    await commentService.save(comment.id, content);
    await this.setCommentState(comment);
  }

  async setCommentState(comment: DisintComment<any>) {
    let readonly = this.user?.userId != comment.userId;
    this.setState({ comment, readonly });
    //this.setState({ comment});
    this.originalMarkdown = comment.content;
    serviceBus.emit(new EditExistingCommentEvent(comment.id, false)); // hide the save fab button

  }

  updateMarkdownController(markdownController: MarkdownController) {
    this.markdownController = markdownController;
    if (this.markdownControllerSubscription) this.markdownControllerSubscription.unsubscribe();
    this.markdownControllerSubscription = markdownController.$input()
      .pipe(
        //debounceTime(10), // covers up a bug where this is being called twice in a row some how
        // tap(markdown => {
        //   console.log("**", markdown)
        // })
      )
      .subscribe((markdown: string) => {
        let active = markdown !== this.originalMarkdown;
        serviceBus.emit(new EditExistingCommentEvent(this.state?.comment.id || "", active));
        //console.log("updated markdown:", markdown)
      });
  }


  render() {
    this.loadComment();

    if (!this.state.comment) return null;
    else return <div >
      <MarkdownEditor readonly={this.state.readonly} markdown={this.state.comment.content} onMarkdownControllerChange={(_) => this.updateMarkdownController(_)}></MarkdownEditor>
    </div>
  }
} 
