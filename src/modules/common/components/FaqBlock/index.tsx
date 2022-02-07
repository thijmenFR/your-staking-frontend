import s from './FaqBlock.module.scss';

import { Collapse } from 'antd';
import cn from 'classnames';

const { Panel } = Collapse;

const FaqBlock = () => {
  function collapseCallback(key: any) {
    console.log(key);
  }

  const text = `
 Your stake will take 2-3 days to completely deactivate upon Unstaking. After that, you can use your wallet 
 (Phantom or Solflare) to withdraw the inactive stake.
`;

  interface CustomArrowProps {
    rotate: any;
  }

  const CustomArrow = ({ rotate }: CustomArrowProps) => {
    return <i className={cn(rotate && s.customArrow__active, s.customArrow)}> {'>'} </i>;
  };

  return (
    <div className={s.faqBlock}>
      <h3>FAQ</h3>

      <Collapse
        onChange={collapseCallback}
        bordered={false}
        expandIcon={({ isActive }) => <CustomArrow rotate={isActive} />}
        className={s.accordion}
        accordion
      >
        <Panel
          header="How long after unstaking can I withdraw my YOUR?"
          key="1"
          className={s.accordion__item}
        >
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel
          header="My stake has become inactive, how can I withdraw my YOUR?"
          key="2"
          className={s.accordion__item}
        >
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="What is YOUR for Solana?" key="3" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="How does YOUR for Solana work?" key="4" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="What is liquid staking?" key="5" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="6" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="What is $YOUR?" key="7" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
        <Panel header="How can I calculate my earnings?" key="8" className={s.accordion__item}>
          <p className={s.accordion__answer}>{text}</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FaqBlock;
