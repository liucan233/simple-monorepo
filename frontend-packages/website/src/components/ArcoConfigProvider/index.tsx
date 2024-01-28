import { ConfigProvider } from "@arco-design/web-react"
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { FC, ReactElement } from "react"
import "@arco-design/web-react/dist/css/arco.css";

type TProps = {
    children?: ReactElement | ReactElement[]
}

export const ArcoConfigProvider:FC<TProps> = ({children})=>{
    return <ConfigProvider locale={zhCN}>
        {children}
    </ConfigProvider>
}