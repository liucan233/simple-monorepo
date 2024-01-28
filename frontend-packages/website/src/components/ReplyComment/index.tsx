import { Input, Comment, Button } from "@arco-design/web-react";
import { FC, useEffect, useState } from "react";

type TProps = {
  avatar: string;
  replyText?: string
  onReply?: (v: string)=>Promise<void>
  autoFocus?: true
  placeholder?: string
};

export const ReplyComment: FC<TProps> = ({ avatar, replyText, onReply, autoFocus, placeholder }) => {
  const [text, setText] = useState("");
  const handleSubmit = async () => {
    if(onReply){
        await onReply(text);
        setText('')
    }
  };

  return (
    <Comment
      avatar={avatar}
      actions={<Button onClick={handleSubmit} type="primary">{replyText||"回复"}</Button>}
      content={<Input.TextArea placeholder={placeholder} onChange={setText} value={text} autoFocus={autoFocus} />}
    />
  );
};
