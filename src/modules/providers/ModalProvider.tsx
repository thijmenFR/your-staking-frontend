import { FC, useCallback, useState } from 'react';
import { ModalContext } from '@modules/context/ModalContext';
import { IConfirmationProps, IModalSuccessProps, ModalType } from '../../types';

export const ModalProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IConfirmationProps>({} as IConfirmationProps);

  const modalDataSuccessHandler = useCallback(
    ({ txHash, userBalance, stakeInputValue, message }: IModalSuccessProps) => {
      setIsOpen(true);
      setData({
        type: ModalType.success,
        txHash: '',
        tokensCount: +stakeInputValue,
        newBalance: +userBalance - +stakeInputValue,
        message,
      });
    },
    [],
  );

  const modalErrorHandler = useCallback(() => {
    setIsOpen(true);
    setData({ type: ModalType.error });
  }, []);

  const resetData = useCallback(() => {
    setData({ type: ModalType.success, tokensCount: 0, txHash: '', newBalance: 0 });
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        setIsOpen,
        setData,
        modalDataSuccessHandler,
        modalErrorHandler,
        resetData,
        data,
        isOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
