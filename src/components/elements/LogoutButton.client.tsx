import {Button} from '~/components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function LogoutButton(props: ButtonProps) {
  const logout = () => {
    fetch('/account/logout', {method: 'POST'}).then(() => {
      if (typeof props?.onClick === 'function') {
        props.onClick();
      }
      window.location.href = '/';
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={logout}>
      Logout
    </Button>
  );
}
