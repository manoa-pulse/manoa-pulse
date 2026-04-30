'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
} from 'react-bootstrap-icons';

type NavItem = {
  label: string;
  href: string;
  protected?: boolean;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Pulse Feed',
    href: '/pulse-feed',
  },
  {
    label: 'Locations',
    href: '/locations',
  },
  {
    label: 'Map View',
    href: '/map-view',
  },
  {
    label: 'Submit Update',
    href: '/submit',
    protected: true,
  },
  {
    label: 'Profile',
    href: '/profile',
    protected: true,
  },
  {
    label: 'Admin',
    href: '/admin',
    protected: true,
    adminOnly: true,
  },
];

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') {
    return null;
  }

  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathName === '/';
    }

    return pathName === href || pathName.startsWith(`${href}/`);
  };

  const visibleNavItems = navItems.filter((item) => {
    if (item.protected && !currentUser) {
      return false;
    }

    if (item.adminOnly && role !== 'ADMIN') {
      return false;
    }

    return true;
  });

  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom shadow-sm py-3 sticky-top"
      style={{
        zIndex: 1000,
      }}
    >
      <Container fluid className="px-4 px-lg-5">
        <Navbar.Brand
          as={Link}
          href="/"
          className="fw-bold text-success fs-2 me-5"
          style={{
            letterSpacing: '-0.04rem',
          }}
        >
          Manoa Pulse
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="main-navbar">
          <Nav className="mx-auto gap-lg-3 align-items-lg-center">
            {visibleNavItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Nav.Link
                  key={item.href}
                  as={Link}
                  href={item.href}
                  className="fw-semibold px-3 py-2 rounded-pill"
                  style={{
                    color: active ? '#0b5d3b' : '#5f6b76',
                    backgroundColor: active ? '#dff8e7' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Nav.Link>
              );
            })}
          </Nav>

          <Nav className="align-items-lg-center">
            {session ? (
              <NavDropdown
                id="login-dropdown"
                title={currentUser}
                align="end"
                className="fw-semibold"
                menuVariant="light"
              >
                <NavDropdown.Item
                  id="login-dropdown-change-password"
                  as={Link}
                  href="/auth/change-password"
                >
                  <Lock className="me-2" />
                  Change Password
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  id="login-dropdown-sign-out"
                  href="/api/auth/signout"
                >
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                id="login-dropdown"
                title="Login"
                align="end"
                className="fw-semibold"
                menuVariant="light"
              >
                <NavDropdown.Item
                  id="login-dropdown-sign-in"
                  as={Link}
                  href="/auth/signin"
                >
                  <PersonFill className="me-2" />
                  Sign in
                </NavDropdown.Item>

                <NavDropdown.Item
                  id="login-dropdown-sign-up"
                  as={Link}
                  href="/auth/signup"
                >
                  <PersonPlusFill className="me-2" />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;