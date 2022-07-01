// @ts-ignore
import {Badge, Button} from 'react-daisyui';
import {useWindowScroll} from 'react-use';
import type {EnhancedMenu} from '~/lib/utils';
import {Link, useUrl, useCart} from '@shopify/hydrogen';

import {
  Input,
  Heading,
  IconBag,
  IconMenu,
  useDrawer,
  IconSearch,
  IconAccount,
} from '~/components';
import {CartDrawer} from './CartDrawer.client';
import {MenuDrawer} from './MenuDrawer.client';
import {Spinner} from '~/components/elements/Spinner';

/**
 * A client component that specifies the content of the header on the website
 */
export function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const {pathname} = useUrl();

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

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
        isHome={isHome}
        openCart={openCart}
        countryCode={countryCode}
      />
      <MobileHeader
        title={title}
        isHome={isHome}
        openCart={openCart}
        openMenu={openMenu}
        countryCode={countryCode}
      />
    </>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
  countryCode,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
  countryCode?: string | null;
}) {
  const {y} = useWindowScroll();
  const {totalQuantity} = useCart();

  const styles = {
    button: 'relative flex items-center justify-center w-8 h-8',
    container: `${
      y > 20 && 'drop-shadow-lg backdrop-blur-xl'
    } flex lg:hidden sticky top-0 z-40 w-full items-center justify-between gap-4 bg-base-100/70 p-4 leading-none transition duration-300 focus:hidden`,
  };

  return (
    <header role="banner" className={styles.container}>
      <div className="flex w-full items-center justify-start gap-4">
        <button onClick={openMenu} className={styles.button}>
          <IconMenu />
        </button>
        <form
          action={`/${countryCode ? countryCode + '/' : ''}search`}
          className="items-center gap-2 sm:flex"
        >
          <button type="submit" className={styles.button}>
            <IconSearch />
          </button>
          <Input
            name="q"
            size="sm"
            type="search"
            placeholder="Search"
            className="hidden md:block"
          />
        </form>
      </div>

      <Link
        className="flex h-full w-full flex-grow items-center justify-center self-stretch leading-[3rem] md:leading-[4rem]"
        to="/"
      >
        <Heading className="text-center font-bold" as={isHome ? 'h1' : 'h2'}>
          {title}
        </Heading>
      </Link>

      <div className="flex w-full items-center justify-end gap-4">
        <Link to={'/account'} className={styles.button}>
          <IconAccount />
        </Link>
        <button onClick={openCart} className={styles.button}>
          <IconBag />
          {totalQuantity > 0 && (
            <Badge
              size="sm"
              color="primary"
              className="absolute -right-3 -top-2"
            >
              {totalQuantity}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
}

function DesktopHeader({
  menu,
  title,
  isHome,
  openCart,
  countryCode,
}: {
  menu?: EnhancedMenu;
  title: string;
  isHome: boolean;
  openCart: () => void;
  countryCode?: string | null;
}) {
  const {y} = useWindowScroll();
  const {status, totalQuantity} = useCart();

  const styles = {
    container: `${
      y > 20 && 'drop-shadow-lg backdrop-blur-xl'
    } hidden lg:block sticky top-0 z-40 h-nav w-full items-center justify-between gap-8 bg-base-100/70 py-4 px-12 leading-none transition duration-300 focus:hidden lg:flex`,
  };

  return (
    <header role="banner" className={styles.container}>
      <div className="flex gap-12">
        <Link className="font-bold" to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link key={item.id} to={item.to} target={item.target}>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <form
          className="flex items-center gap-2"
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
            <IconSearch />
          </Button>
        </form>
        <Button
          size="sm"
          href="/account"
          shape="circle"
          variant="outline"
          className="ml-1"
        >
          <IconAccount />
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
            className="ml-1"
            onClick={openCart}
          >
            {status !== 'idle' ? (
              <Spinner size="sm" />
            ) : (
              <IconBag className="fade-in" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
