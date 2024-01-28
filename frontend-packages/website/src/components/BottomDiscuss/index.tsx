import { FC, useEffect, useState } from "react";
import css from "./index.module.css";
import { observer } from "mobx-react-lite";
import { UserInfo } from "@mobx/UserInfo";
import { Discuss, TComment } from "@mobx/Discuss";
import { usePageId } from "@site/src/hooks/usePageId";
import { Comment, Input, Button } from "@arco-design/web-react";
import { ReplyComment } from "../ReplyComment";

type TProps = {
  mobxUserInfo: UserInfo;
  mobxDiscuss: Discuss;
  onClickSignin?: ()=>unknown
};

const defaultReplyInfo = {
  sourceId: -1,
  replyUserId: -1,
  replyCommentIndex: -1,
  replyReplyIndex: -1,
  replyUserName: "",
};

const avatar =
  "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp";

const renderCommentConent = (
  c: TComment,
  i: number,
  onClick: (v: TComment, i: number) => void
) => {
  return (
    <>
      {c.content}
      <span className={css.contentBtn} onClick={() => onClick(c, i)}>
        回复
      </span>
    </>
  );
};

const BottomDiscussUI: FC<TProps> = ({ mobxDiscuss, mobxUserInfo,onClickSignin }) => {
  const [replyInfo, setReplyInfo] = useState(defaultReplyInfo);
  const pageId = usePageId();

  const handleCreateNewComment = (v: string) => {
    if(!mobxUserInfo.email){
      onClickSignin?.();
      return;
    }
    return mobxDiscuss.createNewComment(v);
  };

  const handleReplyComment = (c: TComment, i: number) => {
    setReplyInfo({
      sourceId: c.id,
      replyUserId: c.userId,
      replyCommentIndex: i,
      replyReplyIndex: -1,
      replyUserName: `回复 @ ${c.user.name}`,
    });
  };

  useEffect(() => {
    mobxDiscuss.loadCommentData(pageId).catch(()=>{});
  }, [mobxDiscuss, pageId]);

  return (
    <div className={css.wrap}>
      <div className={css.title}>评论</div>
      <ReplyComment
        avatar={mobxUserInfo.avatar}
        replyText={mobxUserInfo.name?"发布": "登录"}
        placeholder={`${mobxUserInfo.name}，快发表你的看法吧`}
        onReply={handleCreateNewComment}
      />
      {mobxDiscuss.commentArr.map((c, i) => {
        return (
          <Comment
            key={c.id}
            author={c.user.name}
            content={renderCommentConent(c, i, handleReplyComment)}
            datetime={c.createdAt}
            avatar={c.user.avatar || avatar}
          >
            {/* 回复最外层评论 的 输入框 */}
            {i === replyInfo.replyCommentIndex &&
              replyInfo.replyReplyIndex === -1 && (
                <ReplyComment
                  autoFocus
                  placeholder={replyInfo.replyUserName}
                  onReply={async (text) => {
                    await mobxDiscuss.replyComment(text, c.id, c.userId, i);
                    setReplyInfo(defaultReplyInfo);
                  }}
                  avatar={mobxUserInfo.avatar}
                />
              )}
            {/* 嵌套评论 最多嵌套一层 */}
            {c.replyArr?.map((r, j) => {
              return (
                <div key={r.id} className={css.replyWrap}>
                  <Comment
                    author={r.user.name}
                    content={
                      <>
                        {r.content}
                        <span
                          className={css.contentBtn}
                          onClick={() => {
                            setReplyInfo({
                              sourceId: c.id,
                              replyUserId: r.userId,
                              replyCommentIndex: i,
                              replyReplyIndex: j,
                              replyUserName: `回复 @ ${c.user.name}`,
                            });
                          }}
                        >
                          回复
                        </span>
                      </>
                    }
                    datetime={
                      <>
                        @ {r.reply.name} {r.createdAt}
                      </>
                    }
                    avatar={r.user.avatar || avatar}
                  />
                  {/* 回复嵌套评论 的 输入框 */}
                  {i === replyInfo.replyCommentIndex &&
                    replyInfo.replyReplyIndex === j && (
                      <ReplyComment
                        autoFocus
                        placeholder={replyInfo.replyUserName}
                        onReply={async (text) => {
                          await mobxDiscuss.replyComment(
                            text,
                            c.id,
                            r.userId,
                            i
                          );
                          setReplyInfo(defaultReplyInfo);
                        }}
                        avatar={mobxUserInfo.avatar}
                      />
                    )}
                </div>
              );
            })}
          </Comment>
        );
      })}
    </div>
  );
};

export const BottomDiscuss = observer(BottomDiscussUI);
