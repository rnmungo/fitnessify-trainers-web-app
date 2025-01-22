import { AnchorHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';

interface NextLinkComposedProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, Omit<NextLinkProps, 'href' | 'as'> {
  to: string | { pathname: string; query?: Record<string, any> };
  linkAs?: string | { pathname: string; query?: Record<string, any> };
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  prefetch?: boolean;
  locale?: string | false;
}

const Anchor = styled('a')({});

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(function NextLinkComposed(props, ref) {
  const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  );
});

interface LinkProps {
  activeClassName?: string;
  as?: string | { pathname: string; query?: Record<string, any> };
  className?: string;
  href: string | { pathname: string; query?: Record<string, any> };
  linkAs?: string | { pathname: string; query?: Record<string, any> };
  noLinkStyle?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  role?: string;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  color?: MuiLinkProps['color'];
  [key: string]: any; // Add index signature to allow other props
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function CustomLink(props, ref) {
  const {
    activeClassName = 'active',
    as,
    className: classNameProps,
    href,
    linkAs: linkAsProp,
    locale,
    noLinkStyle,
    prefetch,
    replace,
    role, // Link don't have roles.
    scroll,
    shallow,
    color,
    ...other
  } = props;

  const pathname = usePathname();
  const hrefPathname = typeof href === 'string' ? href : href.pathname;
  const className = classNames(classNameProps, {
    [activeClassName]: pathname === hrefPathname && activeClassName,
  });

  const isExternal =
    typeof href === 'string' &&
    (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return <Anchor className={className} href={href} ref={ref} {...other} />;
    }

    return <MuiLink className={className} href={href} ref={ref} {...other} />;
  }

  const linkAs = linkAsProp || as;
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  };

  if (noLinkStyle) {
    return (
      <NextLinkComposed
        className={className}
        ref={ref}
        {...nextjsProps}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      className={className}
      ref={ref}
      {...nextjsProps}
      {...other}
    />
  );
});

export default Link;
