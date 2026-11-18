import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var block = function (event) {
                  var key = String(event.key || '').toLowerCase();
                  var control = event.ctrlKey || event.metaKey;
                  var devToolsShortcut =
                    event.key === 'F12' ||
                    (control && event.shiftKey && ['i', 'j', 'c', 'k'].indexOf(key) !== -1) ||
                    (control && ['u', 's', 'p'].indexOf(key) !== -1);
                  if (devToolsShortcut) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                  }
                };
                window.addEventListener('keydown', block, true);
                document.addEventListener('keydown', block, true);
                document.addEventListener('contextmenu', function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }, true);
                document.addEventListener('copy', function (event) {
                  event.preventDefault();
                  return false;
                }, true);
                document.addEventListener('dragstart', function (event) {
                  event.preventDefault();
                  return false;
                }, true);
                document.addEventListener('selectstart', function (event) {
                  event.preventDefault();
                  return false;
                }, true);

                var devToolsHidden = false;
                var checkDevTools = function () {
                  var widthDiff = window.outerWidth - window.innerWidth;
                  var heightDiff = window.outerHeight - window.innerHeight;
                  var isDevToolsOpen =
                    widthDiff > 180 ||
                    heightDiff > 180;

                  if (isDevToolsOpen && !devToolsHidden) {
                    devToolsHidden = true;
                    if (document.body) {
                      document.body.style.visibility = 'hidden';
                      document.documentElement.style.overflow = 'hidden';
                    }
                  } else if (!isDevToolsOpen && devToolsHidden) {
                    devToolsHidden = false;
                    if (document.body) {
                      document.body.style.visibility = 'visible';
                      document.documentElement.style.overflow = '';
                    }
                  }
                };
                window.addEventListener('resize', checkDevTools);
                setInterval(checkDevTools, 500);
                checkDevTools();
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
