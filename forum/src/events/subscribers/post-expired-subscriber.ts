import { Subjects, MsgChecker, FormattedSubscriber, PostExpiredEvent } from '@serjin/common';
import { getPostService, getPlayerService, getRoomService, getCommentService } from '../../service-injection';
import { PostService } from '../../services/post.service';
import { PlayerService } from '../../services/player.service';
import { RoomService } from '../../services/room.service';
import { CommentService } from '../../services/comment.service';

export class PostExpiredSubscriber implements FormattedSubscriber<PostExpiredEvent> {
    subject: Subjects.PostExpired = Subjects.PostExpired;

    postService: PostService;
    playerService: PlayerService;
    roomService: RoomService;
    commentService: CommentService;

    constructor(postService = getPostService(), playerService = getPlayerService(), roomService = getRoomService(), commentService = getCommentService()) {
        this.postService = postService
        this.playerService = playerService
        this.roomService = roomService
        this.commentService = commentService
    }

    async onMessage(content: { accountId: string; postId: string; }, checker: MsgChecker) {
        //清除所有相關資料
        const postId = content.postId;
        const post = await this.postService.findById(postId);
        if (post) {
            const room = await this.roomService.findByPostId(post.id);
            if (room) {
                await this.commentService.deleteMany(room.id);
                await this.roomService.delete(room.id);
            }
            await this.playerService.deleteMany(postId);
            await this.postService.delete(postId);
        }

        checker.ack();
    }
}