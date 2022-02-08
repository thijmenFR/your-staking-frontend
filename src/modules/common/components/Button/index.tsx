import s from './Button.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

interface ButtonProps {
  color?: 'primary-gradient' | 'gray' | 'darkGreen';
  text: string;
  linkPath?: string | undefined;
  iconPath?: string | undefined;
  widthFill?: boolean;
  onClick?: () => void;
  isSmallSize?: boolean;
}

const Button = ({
  color,
  text,
  linkPath,
  iconPath,
  widthFill,
  onClick,
  isSmallSize,
}: ButtonProps) => {
  return (
    <>
      {linkPath ? (
        <a
          className={cn(
            s.btn,
            color && s[color],
            widthFill && s.widthFill,
            isSmallSize && s.isSmallSize,
          )}
          href={linkPath}
          onClick={onClick}
        >
          {iconPath && (
            <div className={s.btn__icon}>
              <img src={iconPath} alt="icon" />
            </div>
          )}
          {text}
        </a>
      ) : (
        <button
          className={cn(
            s.btn,
            color && s[color],
            widthFill && s.widthFill,
            isSmallSize && s.isSmallSize,
          )}
          type="button"
          onClick={onClick}
        >
          {iconPath && (
            <div className={s.btn__icon}>
              <img src={iconPath} alt="icon" />
            </div>
          )}
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
