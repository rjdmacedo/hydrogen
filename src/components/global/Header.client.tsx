// @ts-ignore
import {Badge, Swap} from 'react-daisyui';
import {useWindowScroll} from 'react-use';
import type {EnhancedMenu} from '~/lib/utils';
import {Link, useUrl, useCart} from '@shopify/hydrogen';
import {
  SunIcon,
  MenuIcon,
  MoonIcon,
  UserIcon,
  SearchIcon,
  ShoppingBagIcon,
} from '@heroicons/react/outline';

import {CartDrawer} from './CartDrawer.client';
import {MenuDrawer} from './MenuDrawer.client';
import {Spinner} from '~/components/elements/Spinner';
import {useSettings} from '~/contexts/SettingsContext.client';
import {Input, Button, Heading, useDrawer} from '~/components';

/**
 * A client component that specifies the content of the header on the website
 */
export function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const {pathname} = useUrl();

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu!} />
      <DesktopHeader
        menu={menu}
        title={title}
        openCart={openCart}
        countryCode={countryCode}
      />
      <MobileHeader
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        countryCode={countryCode}
      />
    </>
  );
}

function MobileHeader({
  title,
  openCart,
  openMenu,
  countryCode,
}: {
  title: string;
  openCart: () => void;
  openMenu: () => void;
  countryCode?: string | null;
}) {
  const {y} = useWindowScroll();
  const {status, totalQuantity} = useCart();

  const styles = {
    header: `${
      y > 20 && 'drop-shadow-lg backdrop-blur-xl'
    } flex lg:hidden sticky top-0 z-40 w-full items-center justify-between gap-4 bg-base-100/70 p-4 leading-none transition duration-300 focus:hidden`,
    section: {
      left: 'flex w-full items-center justify-start gap-4',
      middle: 'flex w-full flex-grow items-center justify-center self-stretch',
      right: 'flex w-full items-center justify-end gap-4',
    },
  };

  return (
    <header role="banner" className={styles.header}>
      <div className={styles.section.left}>
        <Button
          size="sm"
          animation
          shape="circle"
          variant="outline"
          onClick={openMenu}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        <form
          className="items-center gap-4 outline-0 sm:flex"
          action={`/${countryCode ? countryCode + '/' : ''}search`}
        >
          <Button
            size="sm"
            animation
            shape="circle"
            variant="outline"
            type="submit"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Input
            name="q"
            size="sm"
            type="search"
            placeholder="Search"
            className="hidden md:block"
          />
        </form>
      </div>

      <Link to="/" className={styles.section.middle}>
        <Heading className="text-center font-bold" as="h1">
          {title}
        </Heading>
      </Link>

      <div className={styles.section.right}>
        <Button
          to="/account"
          size="sm"
          shape="circle"
          variant="outline"
          animation
        >
          <UserIcon className="h-4 w-4" />
        </Button>

        <div className="indicator">
          {totalQuantity > 0 && (
            <span className="badge indicator-item badge-error">
              {totalQuantity}
            </span>
          )}
          <Button
            size="sm"
            shape="circle"
            variant="outline"
            onClick={openCart}
            animation
          >
            {['idle', 'uninitialized'].includes(status) ? (
              <ShoppingBagIcon className="fade-in h-4 w-4" />
            ) : (
              <Spinner size="sm" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

function DesktopHeader({
  menu,
  title,
  openCart,
  countryCode,
}: {
  menu?: EnhancedMenu;
  title: string;
  openCart: () => void;
  countryCode?: string | null;
}) {
  const {y} = useWindowScroll();
  const {status, totalQuantity} = useCart();
  const {themeMode, onToggleMode} = useSettings();

  const styles = {
    header: `${
      y > 20 && 'drop-shadow-lg backdrop-blur-xl'
    } sticky top-0 z-40 hidden h-nav w-full items-center justify-between gap-8 bg-base-100/70 py-4 px-12 leading-none transition duration-300 focus:hidden lg:block lg:flex`,
    section: {
      left: 'flex items-center gap-8',
      right: 'flex items-center gap-3',
    },
  };

  return (
    <header role="banner" className={styles.header}>
      <div className={styles.section.left}>
        <Link className="font-bold" to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              className="link link-hover"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.section.right}>
        <form
          className="flex items-center gap-3 outline-0"
          action={`/${countryCode ? countryCode + '/' : ''}search`}
        >
          <Input
            name="q"
            size="sm"
            type="search"
            placeholder="Search"
            className="w-48 duration-500 focus:w-72 focus:outline-0"
          />
          <Button
            size="sm"
            type="submit"
            shape="circle"
            variant="outline"
            className="ml-1"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
        <Button
          size="sm"
          animation
          shape="circle"
          variant="outline"
          onClick={onToggleMode}
        >
          <Swap
            rotate
            onElement={<SunIcon className="h-4 w-4" />}
            offElement={<MoonIcon className="h-4 w-4" />}
            active={themeMode === 'dark'}
            onClick={(e: InputEvent) => e.preventDefault()}
          />
        </Button>
        <Button
          size="sm"
          animation
          shape="circle"
          to="/account"
          variant="outline"
        >
          <UserIcon className="h-4 w-4" />
        </Button>
        <div className="indicator">
          {totalQuantity > 0 && (
            <span className="badge indicator-item badge-error">
              {totalQuantity}
            </span>
          )}
          <Button
            size="sm"
            animation
            shape="circle"
            variant="outline"
            onClick={openCart}
          >
            {['idle', 'uninitialized'].includes(status) ? (
              <ShoppingBagIcon className="fade-in h-4 w-4" />
            ) : (
              <Spinner size="sm" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
