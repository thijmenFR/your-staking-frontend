import { FC } from 'react';
import { Modal } from 'antd';
import cn from 'classnames';

import './index.scss';

const ModalContainer: FC<{
  title?: string;
  isVisible: boolean;
  handleCancel: () => void;
  children: any;
  className?: string | number;
  isClosable?: boolean;
  width?: number;
  noBorderTitle?: boolean;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
}> = ({
  title,
  isVisible,
  handleCancel,
  isClosable,
  maskClosable,
  width,
  children,
  className,
  noBorderTitle = false,
  destroyOnClose = false,
}) => (
  <Modal
    title={title}
    visible={isVisible}
    onCancel={handleCancel}
    className={cn('Modal-container', className, noBorderTitle && 'No-border-title')}
    footer={false}
    closeIcon={<i className="icon icon-close" />}
    closable={isClosable}
    width={width}
    destroyOnClose={destroyOnClose}
    maskClosable={maskClosable}
    centered
  >
    {children}
  </Modal>
);

export default ModalContainer;
