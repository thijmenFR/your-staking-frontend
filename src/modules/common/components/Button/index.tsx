import s from './Button.module.scss';
import cn from 'classnames';

interface ButtonProps {
  color?: 'primary-gradient' | 'gray' | 'darkGreen';
  text: string;
  linkPath?: string | undefined;
  iconPath?: string | undefined;
  widthFill?: boolean;
  onClick?: () => void;
  isSmallSize?: boolean;
  isWaitingMode?: boolean;
  isStateIndicator?: boolean;
}

const Button = ({
  color,
  text,
  linkPath,
  iconPath,
  widthFill,
  onClick,
  isSmallSize,
  isWaitingMode,
  isStateIndicator,
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
            isWaitingMode && s.isWaitingMode,
            iconPath && s.icon,
          )}
          onClick={onClick}
          href={linkPath}
        >
          {iconPath && (
            <div className={s.iconItem}>
              <img src={iconPath} alt="icon" />
            </div>
          )}
          <p className={isStateIndicator ? s.isStateIndicator : ''}>{text}</p>
        </a>
      ) : (
        <button
          className={cn(
            s.btn,
            color && s[color],
            widthFill && s.widthFill,
            isSmallSize && s.isSmallSize,
            isWaitingMode && s.isWaitingMode,
            iconPath && s.icon,
          )}
          type="button"
          onClick={onClick}
        >
          {iconPath && (
            <div className={s.iconItem}>
              <img src={iconPath} alt="icon" />
            </div>
          )}
          <p className={isStateIndicator ? s.isStateIndicator : ''}>{text}</p>
        </button>
      )}
    </>
  );
};

export default Button;
