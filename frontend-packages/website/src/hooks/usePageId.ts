import useIsBrowser from "@docusaurus/useIsBrowser";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const usePageId = ()=>{
    const isBrowser =useIsBrowser();
    const {siteConfig}=useDocusaurusContext()
    if(isBrowser){
        const {pathname}=location;
        const {baseUrl}=siteConfig
        return `/${pathname.replace(baseUrl,'')} of monorepo website`;
    }
    return null;
}