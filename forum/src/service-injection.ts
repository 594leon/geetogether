import Config from './config';
import { mongo, rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';
import { ProfileService } from './services/profile.service';
import { ProfileMongoService } from './services/profile.mongo.service';
import { PostService } from './services/post.service';
import { PostMongoService } from './services/post.mongo.service';
import { PlayerService } from './services/player.service';
import { PlayerMongoService } from './services/player.mongo.service';
import { RoomService } from './services/room.service';
import { RoomMongoService } from './services/room.mongo.service';
import { CommentService } from './services/comment.service';
import { CommentMongoService } from './services/comment.mongo.service';
import { ProfileCompletedSubscriber } from './events/subscribers/profile-completed-subscriber';
import { ProfileUpdatedSubscriber } from './events/subscribers/profile-updated-subscriber';
import { PostCreatedSubscriber } from './events/subscribers/post-created-subscriber';
import { PostClosedSubscriber } from './events/subscribers/post-closed-subscriber';
import { PostExpiredSubscriber } from './events/subscribers/post-expired-subscriber';

const initService = async () => {

    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME);
    console.log('Config.RABBIT_USERNAME: ' + Config.RABBIT_USERNAME);
    console.log('Config.RABBIT_PASSWORD: ' + Config.RABBIT_PASSWORD);
    await rabbit.connect(
        Config.RABBIT_HOST,
        Config.RABBIT_PORT,
        Config.RABBIT_QUEUE,
        Config.RABBIT_USERNAME,
        Config.RABBIT_PASSWORD,
        [Subjects.PostCreated, Subjects.PostClosed, Subjects.PostExpired, Subjects.ProfileCompleted, Subjects.ProfileUpdated, Subjects.RoomCreated],
        [new ProfileCompletedSubscriber(), new ProfileUpdatedSubscriber(), new PostCreatedSubscriber(), new PostClosedSubscriber(), new PostExpiredSubscriber()],
        Config.RABBIT_SECRET,
        Config.K8S_NAMESPACE
    );
}

const closeService = async () => {
    await mongo.close();
    await rabbit.close();
}

//factory pattern
const getProfileService = (): ProfileService => {
    //根據條件來決定使用哪一個database，目前只有mongodb所以直接創建ProfileMongoService
    return new ProfileMongoService();
}

//factory pattern
const getPostService = (): PostService => {
    return new PostMongoService();
}

//factory pattern
const getPlayerService = (): PlayerService => {
    return new PlayerMongoService();
}

//factory pattern
const getRoomService = (): RoomService => {
    return new RoomMongoService();
}

//factory pattern
const getCommentService = (): CommentService => {
    return new CommentMongoService();
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getProfileService, getPostService, getPlayerService, getRoomService, getCommentService, getMessageService };