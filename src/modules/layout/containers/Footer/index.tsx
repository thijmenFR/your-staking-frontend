import styles from './Footer.module.scss';
import AppLogo from '@modules/layout/containers/Header/components/Logo';

const Socialslinks = [
  { url: '/', title: 'Twitter' },
  { url: '/', title: 'Telegram' },
  { url: '/', title: 'Discord' },
  { url: '/', title: 'Reddit' },
  { url: '/', title: 'Github' },
  { url: '/', title: 'Blog' },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className={styles.footer__row}>
        <div>
          <AppLogo />
          <p className={styles.footer__title}>The New Creative Economy.</p>
        </div>
        <nav className={styles.footer__nav}>
          <div>
            <h5 className={styles.footer__subTitle}>Company</h5>
            <ul>
              <li>
                <a href="https://littlestar.com" target="_blank">
                  About
                </a>
              </li>
              <li>
                <a href="mailto:content@rad.live">Partnerships</a>
              </li>
              <li>
                <a href="https://angel.co/company/watchrad" target="_blank">
                  Careers
                </a>
              </li>
              <li>
                <a href="mailto:support@rad.live">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className={styles.footer__subTitle}>Helpful links</h5>
            <ul>
              <li>
                <a
                  href="https://littlstar.zendesk.com/hc/en-us/categories/360001797351-FAQ"
                  target="_blank"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a href="https://support.rad.live" target="_blank">
                  Support
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/terms" target="_blank">
                  Terms
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/copyright" target="_blank">
                  Copyright
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/privacy" target="_blank">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
