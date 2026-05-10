import { Coffee } from 'lucide-react';
import { FunDisclaimer } from './FunDisclaimer';

const KOFI_URL = 'https://ko-fi.com/alexlympe';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <FunDisclaimer />
      <div className="site-footer-support">
        <p className="site-footer-support-lead">Finding this useful?</p>
        <a
          className="kofi-btn"
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Coffee className="kofi-btn-icon" strokeWidth={2.25} aria-hidden />
          <span>Buy me a coffee</span>
        </a>
        <p className="site-footer-support-hint">Ko-fi · supports hosting &amp; side projects</p>
      </div>
    </footer>
  );
}
