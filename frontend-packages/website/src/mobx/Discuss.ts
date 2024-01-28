import { makeObservable, observable, runInAction } from "mobx";
import { fetchJson } from "../libraries/wrappedFetch";
import { serverPrefix } from "../config";

type TPageDiscussData = {
  id: number;
  desc: string;
  externalId: string;
  userId: number;
  commentArr: TComment[];
};

type TCommentUser={
  avatar: string
  id: number;
  name: string;
}
export type TReplyInfo = {
  id: number;
  createdAt: string;
  sourceId: number;
  content: string;
  userId: number;
  replyUserId: number;
  user: TCommentUser;
  reply: TCommentUser;
};

export type TComment = {
  id: number;
  sourceId: number;
  createdAt: string;
  content: string;
  userId: number;
  replyArr?: TReplyInfo[];
  user: TCommentUser;
};

export class Discuss {
  pageId = "";
  commentArr: TComment[] = [];
  discussData: TPageDiscussData | null = null;
  constructor() {
    makeObservable(this, {
      commentArr: observable.ref,
      discussData: observable.ref,
    });
  }
  async loadCommentData(pageId: string) {
    const encodedId = encodeURIComponent(pageId);
    this.pageId = pageId;
    const discussData = await fetchJson(
      `${serverPrefix}/comment/list?externalId=${encodedId}`
    );
    if (!discussData || !discussData.commentArr) {
      alert("加载评论数据失败");
      return;
    }
    runInAction(() => {
      this.discussData = discussData;
      this.commentArr = discussData.commentArr;
    });
  }

  async createNewComment(text: string) {
    const newComment = await fetchJson(`${serverPrefix}/comment/newComment`, {
      method: "post",
      data: {
        externalId: this.pageId,
        content: text,
      },
    });
    if (!newComment) {
      alert("评论失败");
      return;
    }
    runInAction(() => {
      this.commentArr = [newComment, ...this.commentArr];
    });
  }

  async replyComment(
    text: string,
    sourceId: number,
    replyUserId: number,
    commentIndex: number
  ) {
    const replyInfo = await fetchJson(`${serverPrefix}/comment/replyComment`, {
      method: "post",
      data: {
        content: text,
        replyCommentId: sourceId,
        replyUserId: replyUserId,
      },
    });
    runInAction(() => {
      const repliedComment = this.commentArr[commentIndex];
      if (!repliedComment.replyArr) {
        repliedComment.replyArr = [replyInfo];
      } else {
        repliedComment.replyArr.push(replyInfo);
      }
      this.commentArr = [...this.commentArr];
    });
  }
}

export const createDiscuss = () => {
  return new Discuss();
};
