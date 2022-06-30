export function HeaderFallback({isHome}: {isHome?: boolean}) {
  const styles = isHome
    ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
    : 'bg-contrast/80 text-primary';
  return (
    <header
      role="banner"
      className={`${styles} h-nav top-0 z-40 flex w-full items-center justify-between gap-8 px-12 py-8 leading-none backdrop-blur-lg`}
    >
      <div className="flex space-x-4">
        <Box wide isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
        <Box isHome={isHome} />
      </div>
      <Box isHome={isHome} wide={true} />
    </header>
  );
}

function Box({wide, isHome}: {wide?: boolean; isHome?: boolean}) {
  return (
    <div
      className={`h-8 rounded-sm ${wide ? 'w-32' : 'w-16'} ${
        isHome ? 'bg-primary/60' : 'bg-primary/20'
      }`}
    />
  );
}
