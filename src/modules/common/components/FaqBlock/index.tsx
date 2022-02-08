import s from './FaqBlock.module.scss';
import { Collapse } from 'antd';
import cn from 'classnames';
import { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

import arrowDown from '@assets/images/arrow-down.svg';
import arrowDownPrimary from '@assets/images/arrow-down--primary.svg';

const { Panel } = Collapse;

const FaqBlock = () => {
  const { isLightMode } = useContext(AppContext);

  function collapseCallback(key: any) {
    console.log(key);
  }

  const text = `
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper velit non nulla interdum dapibus ut at
  nulla. Etiam imperdiet leo justo, id venenatis risus aliquet sed. Etiam at erat libero. Vestibulum eu nisl fermentum,
   laoreet tortor ut, tempus arcu. Duis hendrerit pellentesque eros, eu bibendum massa porttitor sit amet. Suspendisse
    faucibus malesuada facilisis. Vestibulum porttitor lectus a neque scelerisque vulputate.
`;

  interface CustomArrowProps {
    rotate: any;
  }

  const CustomArrow = ({ rotate }: CustomArrowProps) => {
    return (
      <i className={cn(rotate && s.customArrow__active, s.customArrow)}>
        <img src={isLightMode ? arrowDown : arrowDownPrimary} alt="dropdown icon" />
      </i>
    );
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
