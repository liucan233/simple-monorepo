import { createDiscuss } from "../../mobx/Discuss";
import { createUserInfo } from "../../mobx/UserInfo";
import { useMobxState } from "@site/src/hooks/useMobxState";
import { ArcoConfigProvider } from "../ArcoConfigProvider";
import { BottomDiscuss } from "../BottomDiscuss";
import { Signin } from "../Signin";
import { Message, Modal } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { ChangeUserInfo } from "../ChangeUserInfo";

export const MdxComment = () => {
  const signinState = useMobxState(createUserInfo);
  const mobxDiscuss = useMobxState(createDiscuss);

  const [showSiginModal, setShowSigninModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  // useEffect(()=>{
  //   if(showSiginModal || !signinState?.token){
  //     return;
  //   }
  //   if(!signinState.avatar){
  //     setShowChangeModal(true);
  //   }
  // },[showSiginModal, signinState])

  return (
    <ArcoConfigProvider>
      {mobxDiscuss && (
        <BottomDiscuss mobxDiscuss={mobxDiscuss} mobxUserInfo={signinState} onClickSignin={()=>setShowSigninModal(true)} />
      )}
      <Modal visible={showSiginModal} onCancel={()=>setShowSigninModal(false)} footer={null}>
        {signinState && <Signin state={signinState} onSignin={()=>{
          setShowSigninModal(false);
          if(!signinState?.avatar){
            setTimeout(()=>{
              setShowChangeModal(true);
              Message.info('请完善用户信息')
            }, 500);
          }
        }} />}
      </Modal>

      <Modal visible={showChangeModal} onCancel={()=>setShowChangeModal(false)} footer={null}>
        {signinState && <ChangeUserInfo state={signinState} onChanged={()=>{
          signinState.fetchUserInfo()
          setShowChangeModal(false);
        }} />}
      </Modal>
    </ArcoConfigProvider>
  );
};
