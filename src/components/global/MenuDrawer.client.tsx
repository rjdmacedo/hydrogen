import {Link} from '@shopify/hydrogen';
import {Text, Drawer} from '~/components';
import type {EnhancedMenu} from '~/lib/utils';

export function MenuDrawer({
  menu,
  isOpen,
  onClose,
}: {
  menu: EnhancedMenu;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <Link key={item.id} to={item.to} target={item.target} onClick={onClose}>
          <Text as="span" size="copy">
            {item.title}
          </Text>
        </Link>
      ))}
    </nav>
  );
}
