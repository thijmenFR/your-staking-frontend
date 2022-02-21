import AppLogo from '@modules/common/components/Logo';
import { Link } from 'react-router-dom';
import ToggleThemeMode from '@modules/common/components/ToggleThemeMode';
import { useMediaQuery } from '@modules/common/hooks';

import s from './Footer.module.scss';

const communitylinks = [
  { id: 1, url: '/', title: 'Twitter' },
  { id: 2, url: '/', title: 'Telegram' },
  { id: 3, url: '/', title: 'Discord' },
  { id: 4, url: '/', title: 'Reddit' },
  { id: 5, url: '/', title: 'Github' },
  { id: 6, url: '/', title: 'Blog' },
];

const resourceslinks = [
  { id: 1, url: '#stakeBlock', title: 'Stake with YOUR' },
  { id: 2, url: '/', title: 'Primer' },
  { id: 3, url: '/', title: 'Terms of Use' },
  { id: 4, url: '/', title: 'Privacy Policy' },
  { id: 5, url: '#faqBlock', title: 'FAQ' },
  { id: 6, url: '/', title: 'Press kit' },
];

const contactslinks = [
  { id: 1, url: 'mailto:info@yournetwork.io', title: 'info@yournetwork.io' },
  { id: 2, url: '/', title: 'Help Center' },
];

const Footer = () => {
  const isBreakpoint = useMediaQuery(992);

  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footer__inner}>
          <aside className={s.footer__aside}>
            <AppLogo />
            <p className={s.footer__desc}>
              YOUR is the Wikipedia of product content. Everyone around the world can create content
              and earn money.
            </p>
          </aside>
          <nav>
            <ul className={s.navList}>
              <li className={s.navList__item}>
                <h4>Resources</h4>
                <ul>
                  {resourceslinks.map((item: any) => (
                    <li key={item.id}>
                      <Link to={item.url}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={s.navList__item}>
                <h4>Community</h4>
                <ul>
                  {communitylinks.map((item: any) => (
                    <li key={item.id}>
                      <a target="_blank" href={item.url}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={s.navList__item}>
                <h4>Contacts</h4>
                <ul>
                  {contactslinks.map((item: any) => (
                    <li key={item.id}>
                      <a href={item.url}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        {isBreakpoint && (
          <div className={s.toggleThemeWrapp}>
            <ToggleThemeMode />
          </div>
        )}
      </div>
    </footer>
  );
};
export default Footer;
