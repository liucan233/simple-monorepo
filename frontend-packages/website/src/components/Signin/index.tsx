import { FC, useEffect, useRef, useState } from "react";
import css from "./index.module.css";
import { observer } from "mobx-react-lite";
import { TCaptchaSigninReq, UserInfo } from "@mobx/UserInfo";
import { Form, Input, Button, Checkbox, Message } from "@arco-design/web-react";

type TProps = {
  state: UserInfo;
  onSignin?: ()=>unknown
};

const createCountDown = (num: number, cb: (curNum: number) => void) => {
  let cnt = num;
  let timeoutTask: ReturnType<typeof setTimeout> | null = null;

  const cancelCountDown = () => {
    clearTimeout(timeoutTask);
  };

  const countDownLoop = () => {
    cb(cnt--);
    if (cnt < 0) {
      return;
    }
    timeoutTask = setTimeout(countDownLoop, 1000);
  };
  countDownLoop();
  return cancelCountDown;
};

const SigninUI: FC<TProps> = ({ state, onSignin }) => {
  const [form] = Form.useForm<TCaptchaSigninReq>();
  const [countDown, setCountDown] = useState(0);
  const [sending, setSending] = useState(false);
  const cancelCountDownRef = useRef<ReturnType<typeof createCountDown>>();

  const handleSendCaptcha = async () => {
    const { email } = form.getFields();
    if (!email) {
      Message.warning("请输入邮箱");
      return;
    }
    setSending(true);
    await state.sendCaptcha(email);
    Message.success("邮件发送成功");
    cancelCountDownRef.current = createCountDown(9, setCountDown);
    setSending(false);
  };

  useEffect(() => {
    return cancelCountDownRef.current;
  }, []);

  const SendCaptcha = (
    <Button
      loading={sending}
      onClick={handleSendCaptcha}
      type="text"
      size="small"
      disabled={countDown > 0}
    >
      {countDown > 0 ? `${countDown}秒后可再次获取` : "获取验证码"}
    </Button>
  );
  return (
    <div className={css.wrap}>
      <Form
        form={form}
        title="登录"
        layout="vertical"
        onSubmit={(formdata) => {
          state.signinByCaptcha({
            email: formdata.email,
            captcha: formdata.captcha,
          }).then(onSignin)
        }}
      >
        <Form.Item required label="邮箱" field="email">
          <Input placeholder="请输入邮箱" autoComplete="off" />
        </Form.Item>
        <Form.Item required label="验证码" field="captcha">
          <Input
            placeholder="请输入验证码"
            addAfter={SendCaptcha}
            afterStyle={{ padding: 0 }}
            autoComplete="off"
          />
        </Form.Item>
        {/* <Form.Item label="昵称" field="name">
          <Input
            placeholder="请输入昵称"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item label="登录密码" field="password">
          <Input
            placeholder="请输入密码"
            autoComplete="off"
          />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            {state.signinup?'注册并登录':'登录'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const Signin = observer(SigninUI);
