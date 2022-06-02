import { FC } from 'react';
import { Modal } from 'antd';
import cn from 'classnames';

const ModalContainer: FC<{
  isVisible: boolean;
  handleCancel: () => void;
  children: any;
  className?: string | number;
  isClosable?: boolean;
  width?: number;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
}> = ({
  isVisible,
  handleCancel,
  isClosable,
  maskClosable,
  width,
  children,
  className,
  destroyOnClose = false,
}) => (
  <Modal
    visible={isVisible}
    onCancel={handleCancel}
    className={cn('modalContainer', className)}
    footer={null}
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
