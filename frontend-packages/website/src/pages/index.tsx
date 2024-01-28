import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import { Signin } from '../components/Signin';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useRef } from 'react';
import { useMobxState } from '../hooks/useMobxState';
import { UserInfo, createUserInfo } from '../mobx/UserInfo';
import { usePageId } from '../hooks/usePageId';
import { BottomDiscuss } from '../components/BottomDiscuss';
import { Discuss, createDiscuss } from '../mobx/Discuss';
import { ArcoConfigProvider } from '../components/ArcoConfigProvider';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            本项目正在快速更新中，敬请期待！
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Liu Can的技术Journey，存放一些业余因兴趣爱好倒腾的东西，主要涉及iOS和前端技术">
      <HomepageHeader />
    </Layout>
  );
}
