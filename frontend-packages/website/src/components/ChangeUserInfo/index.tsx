import { FC, useEffect, useRef, useState } from "react";
import css from "./index.module.css";
import { observer } from "mobx-react-lite";
import { TCaptchaSigninReq, TUpdateUserInfoReq, UserInfo } from "@mobx/UserInfo";
import { Form, Input, Button, Upload, Message } from "@arco-design/web-react";
import { fetchJson } from "../../libraries/wrappedFetch";
import { serverPrefix } from "@site/src/config";

type TProps = {
  state: UserInfo;
  onChanged?: ()=>unknown
};

type TUpdateUserInfoForm = {
  avatar?: [{
    response: {
      url: string
    }
  }];
  name?: string;
  password?: string;
};

const uploadFile = (f: File) => {
  return fetchJson(`${serverPrefix}/upload`, {
    method: "post",
    body: f,
    headers: {
      "x-custom-filename": encodeURIComponent(f.name),
    },
  }).then(res=>{
    res.url=`${serverPrefix}/upload?uri=${res.id}`
    return res
  });
};

const ChangeUserInfoUI: FC<TProps> = ({ state, onChanged }) => {
  const [form] = Form.useForm<TUpdateUserInfoForm>();
  const [saving, setSaving] = useState(false);
  return (
    <div className={css.wrap}>
      <Form
        form={form}
        title="完善信息"
        layout="vertical"
        onSubmit={(formdata) => {
          state.updateUserInfo({
            name: formdata.name||'',
            avatar: formdata.avatar?.[0].response.url||'',
            password: formdata.password||''
          }).then(onChanged);
        }}
      >
        <Form.Item label="头像" field="avatar">
          <Upload
            listType="picture-card"
            limit={1}
            imagePreview
            customRequest={(d) => {
              uploadFile(d.file).then(d.onSuccess).catch(d.onError);
            }}
          />
        </Form.Item>
        <Form.Item label="昵称" field="name">
          <Input placeholder={state.name || "请输入昵称"} autoComplete="off" />
        </Form.Item>
        <Form.Item label="登录密码" field="password">
          <Input placeholder="请输入新的登录密码" autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const ChangeUserInfo = observer(ChangeUserInfoUI);
