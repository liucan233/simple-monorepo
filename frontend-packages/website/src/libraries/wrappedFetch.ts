import { Message } from "@arco-design/web-react";

type TErrorCallBack=(msg: string)=>void

export const onFetchErrorArr:TErrorCallBack[] = []

interface IRequestInit extends RequestInit{
  data?: unknown
}

const modifyRequestInit=(url: string, init: IRequestInit)=>{
  if(!init.headers){
    init.headers={};
  }

  if(init.data){
    if(typeof init.data==='object'){
      init.body=JSON.stringify(init.data);
      init.headers['content-type']='application/json';
    } else if(typeof init.data==='string'){
      init.body=init.data;
    } else {
      throw new TypeError('data类型不支持');
    }
  }
  if(url.includes('/api')){
    const token = localStorage.getItem('user_token');
    if(token){
      init.headers['authorization']=token;
    }
  }
}

const callAllErrorFunc=(err: unknown)=>{
  // if(context){
  //   console.info(context);
  // }
  let msg='';
  if(err instanceof Error){
    msg=err.message;
  } else if(typeof err ==='string'){
    msg=err
  } else if(err && typeof err==='object'){
    msg=JSON.stringify(err)
  } else {
    msg='网络请求发生未知错误';
  }
  for(const func of onFetchErrorArr){
    func(msg);
  }
  return new Error(msg);
}

export const wrappedFetch = async (url: string, init: IRequestInit) => {
  modifyRequestInit(url, init);
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (error) {
    throw callAllErrorFunc(error);
  }
  const resContentType = res.headers.get('content-type') || '';
  return {
    res,
    resContentType,
  }

  // if (resContentType?.includes('text')) {
  //   responseData.textResult = await res.text();
  //   return responseData;
  // }

  // if (resContentType?.includes('image')) {
  //   const arrayBuffer = await res.arrayBuffer();
  //   const imgBlob = new Blob([arrayBuffer]);
  //   const mimeType = resContentType.match(/image\/\w+/);
  //   responseData.blobResult = imgBlob;
  // }
};

interface IFetchJsonRequestInit extends IRequestInit{
  disableUnpack?: false
}

export const fetchJson=async <TRes>(url: string,init?: IFetchJsonRequestInit)=>{
  const newInit = {...init};

  const {res, resContentType}=await wrappedFetch(url, newInit);

  if(!resContentType.includes('json')){
    throw callAllErrorFunc('http响应头content-type不是application/json')
  }

    const jsonResult = await res.json();
    if(jsonResult.code!==0){
      throw callAllErrorFunc(jsonResult.msg || '服务端响应JSON数据的code不为0',);
    }
    
    if(newInit.disableUnpack){
      return jsonResult;
    }

    return jsonResult.data;
}

onFetchErrorArr.push(msg=>{
  Message.error(msg);
})