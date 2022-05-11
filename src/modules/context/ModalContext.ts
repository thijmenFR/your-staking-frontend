import { createContext, Dispatch, SetStateAction } from 'react';
import { IConfirmationProps, IModalSuccessProps } from '../../types';

interface IContext {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<IConfirmationProps>>;
  modalDataSuccessHandler: (data: IModalSuccessProps) => void;
  modalErrorHandler: () => void;
  resetData: () => void;
  isOpen: boolean;
  data: IConfirmationProps;
}

export const ModalContext = createContext<IContext>({} as IContext);
