'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') return null;

  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm py-3">
      <Container fluid className="px-4 position-relative">
        <Navbar.Brand
          href="/"
          className="position-absolute opacity-0"
          style={{ pointerEvents: 'none' }}
        >
          Manoa Pulse
        </Navbar.Brand>

        <Navbar.Brand href="/" className="fw-bold text-success fs-2">
          Manoa Pulse
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-4 fw-medium">
            <Nav.Link href="/" active={pathName === '/'} className="text-success">
              Home
            </Nav.Link>

            <Nav.Link
              href="/pulse-feed"
              active={pathName === '/pulse-feed'}
              className="text-secondary"
            >
              Pulse Feed
            </Nav.Link>

            <Nav.Link
              href="/locations"
              active={pathName === '/locations'}
              className="text-secondary"
            >
              Locations
            </Nav.Link>

            <Nav.Link
              href="/map-view"
              active={pathName === '/map-view'}
              className="text-secondary"
            >
              Map View
            </Nav.Link>

            {currentUser && (
              <>
                <Nav.Link
                  href="/submit"
                  active={pathName === '/submit'}
                  className="text-secondary"
                >
                  Submit Update
                </Nav.Link>

                <Nav.Link
                  href="/profile"
                  active={pathName === '/profile'}
                  className="text-secondary"
                >
                  Profile
                </Nav.Link>
              </>
            )}

            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                id="admin-stuff-nav"
                href="/admin"
                active={pathName === '/admin'}
                className="text-secondary"
              >
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {session ? (
              <NavDropdown
                id="login-dropdown"
                title={currentUser}
                align="end"
                className="fw-semibold"
              >
                <NavDropdown.Item
                  id="login-dropdown-sign-out"
                  href="/api/auth/signout"
                >
                  <BoxArrowRight className="me-2" />
                  Sign Out
                </NavDropdown.Item>

                <NavDropdown.Item
                  id="login-dropdown-change-password"
                  href="/auth/change-password"
                >
                  <Lock className="me-2" />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                id="login-dropdown"
                title="Login"
                align="end"
                className="fw-semibold text-success"
              >
                <NavDropdown.Item
                  id="login-dropdown-sign-in"
                  href="/auth/signin"
                >
                  <PersonFill className="me-2" />
                  Sign in
                </NavDropdown.Item>

                <NavDropdown.Item
                  id="login-dropdown-sign-up"
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