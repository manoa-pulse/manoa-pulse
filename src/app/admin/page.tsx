import Link from 'next/link';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Badge, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import {
  deletePulseSubmission,
  deleteUser,
  updateUserRole,
} from '@/lib/dbActions';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LOCATION_LABELS } from '@/lib/locationLabels';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUBMISSIONS_PER_PAGE = 25;

type AdminPageProps = {
  searchParams: Promise<{
    page?: string;
    showTestUsers?: string;
    userSearch?: string;
  }>;
};

const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}).format(date);

const getBusyBadgeVariant = (busyLevel: number) => {
  if (busyLevel <= 3) return 'success';
  if (busyLevel <= 7) return 'warning';
  return 'danger';
};

const getPageNumber = (pageParam?: string) => {
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
};

const testUserFilter = {
  NOT: [
    {
      email: {
        contains: 'chromium',
      },
    },
    {
      email: {
        contains: 'firefox',
      },
    },
    {
      email: {
        contains: 'webkit',
      },
    },
  ],
};

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  const params = await searchParams;
  const requestedPage = getPageNumber(params.page);
  const showTestUsers = params.showTestUsers === 'true';
  const userSearch = params.userSearch?.trim() ?? '';

  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser || currentUser.role !== Role.ADMIN) {
    redirect('/not-authorized');
  }

  const totalSubmissions = await prisma.entry.count();
  const totalSubmissionPages = Math.max(
    1,
    Math.ceil(totalSubmissions / SUBMISSIONS_PER_PAGE),
  );

  const currentPage = Math.min(requestedPage, totalSubmissionPages);
  const skip = (currentPage - 1) * SUBMISSIONS_PER_PAGE;

  const userWhere = {
    ...(showTestUsers ? {} : testUserFilter),
    ...(userSearch
      ? {
          email: {
            contains: userSearch,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  };

  const [users, recentSubmissions, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: userWhere,
      orderBy: {
        id: 'asc',
      },
    }),
    prisma.entry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: SUBMISSIONS_PER_PAGE,
    }),
    prisma.user.count({
      where: userWhere,
    }),
  ]);

  const previousPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalSubmissionPages ? currentPage + 1 : totalSubmissionPages;

  const previousHref = `/admin?page=${previousPage}&showTestUsers=${showTestUsers}&userSearch=${encodeURIComponent(userSearch)}`;
  const nextHref = `/admin?page=${nextPage}&showTestUsers=${showTestUsers}&userSearch=${encodeURIComponent(userSearch)}`;
  const toggleTestUsersHref = `/admin?page=${currentPage}&showTestUsers=${!showTestUsers}&userSearch=${encodeURIComponent(userSearch)}`;

  return (
    <main
      className="py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f4fbf6 0%, #eef3f8 45%, #ffffff 100%)',
      }}
    >
      <Container fluid className="px-4 px-md-5">
        <section
          className="text-white p-4 p-md-5 mb-4 shadow-lg"
          style={{
            borderRadius: '2rem',
            background: 'linear-gradient(135deg, #0b5d3b 0%, #117a65 55%, #2a9d8f 100%)',
          }}
        >
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <Badge
                bg="light"
                text="success"
                className="rounded-pill px-3 py-2 mb-3"
              >
                ADMIN DASHBOARD
              </Badge>

              <h1 className="display-5 fw-bold mb-3">Manage Manoa Pulse</h1>

              <p className="fs-5 mb-0" style={{ maxWidth: '760px' }}>
                Review recent pulse submissions, manage user accounts, and keep campus activity data organized.
              </p>
            </Col>

            <Col lg={4}>
              <Row className="g-3">
                <Col sm={6}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '1.5rem' }}>
                    <div className="card-body p-4 text-center">
                      <div className="display-6 fw-bold text-success">{totalUsers}</div>
                      <div className="text-secondary fw-semibold">
                        {showTestUsers ? 'Users' : 'Real Users'}
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col sm={6}>
                  <Card className="border-0 shadow-sm" style={{ borderRadius: '1.5rem' }}>
                    <div className="card-body p-4 text-center">
                      <div className="display-6 fw-bold text-success">{totalSubmissions}</div>
                      <div className="text-secondary fw-semibold">Submissions</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        <Row className="g-4">
          <Col xl={7}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '2rem' }}>
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h2 className="fw-bold text-success mb-1">Recent Pulse Submissions</h2>
                    <p className="text-secondary mb-0">
                      Latest user-submitted busyness reports.
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="success" className="rounded-pill px-3 py-2">
                      Page {currentPage} of {totalSubmissionPages}
                    </Badge>

                    <Badge bg="light" text="success" className="rounded-pill px-3 py-2">
                      25 per page
                    </Badge>
                  </div>
                </div>

                <Form method="get" action="/admin" className="mb-4">
                  <input type="hidden" name="showTestUsers" value={String(showTestUsers)} />
                  <input type="hidden" name="userSearch" value={userSearch} />

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <Form.Label className="mb-0 fw-semibold text-secondary">
                      Go to page:
                    </Form.Label>

                    <Form.Control
                      type="number"
                      name="page"
                      min={1}
                      max={totalSubmissionPages}
                      defaultValue={currentPage}
                      style={{ maxWidth: '120px' }}
                    />

                    <Button
                      type="submit"
                      variant="success"
                      className="rounded-pill px-4"
                    >
                      Go
                    </Button>
                  </div>
                </Form>

                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Busy</th>
                        <th>Comment</th>
                        <th>Submitted By</th>
                        <th>Submitted</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentSubmissions.map((entry) => (
                        <tr key={entry.id}>
                          <td className="fw-semibold">
                            {LOCATION_LABELS[entry.location] ?? entry.location}
                          </td>

                          <td>
                            <Badge
                              bg={getBusyBadgeVariant(entry.busyLevel)}
                              className="rounded-pill px-3 py-2"
                            >
                              {entry.busyLevel}/10
                            </Badge>
                          </td>

                          <td className="text-secondary" style={{ maxWidth: '260px' }}>
                            {entry.comment || 'No comment'}
                          </td>

                          <td className="text-secondary" style={{ maxWidth: '220px' }}>
                            {entry.submittedBy}
                          </td>

                          <td className="text-secondary">
                            {formatDate(entry.createdAt)}
                          </td>

                          <td className="text-end">
                            <form action={deletePulseSubmission}>
                              <input type="hidden" name="id" value={entry.id} />
                              <Button
                                type="submit"
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-3"
                              >
                                Delete
                              </Button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  {currentPage > 1 ? (
                    <Link href={previousHref} className="text-decoration-none">
                      <Button
                        variant="outline-success"
                        className="rounded-pill px-4"
                      >
                        ← Previous 25
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill px-4"
                      disabled
                    >
                      ← Previous 25
                    </Button>
                  )}

                  <span className="text-secondary fw-semibold">
                    Showing {totalSubmissions === 0 ? 0 : skip + 1}
                    {' '}
                    to
                    {' '}
                    {Math.min(skip + SUBMISSIONS_PER_PAGE, totalSubmissions)}
                    {' '}
                    of
                    {' '}
                    {totalSubmissions}
                  </span>

                  {currentPage < totalSubmissionPages ? (
                    <Link href={nextHref} className="text-decoration-none">
                      <Button
                        variant="success"
                        className="rounded-pill px-4"
                      >
                        Next 25 →
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill px-4"
                      disabled
                    >
                      Next 25 →
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </Col>

          <Col xl={5}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '2rem' }}>
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                  <div>
                    <h2 className="fw-bold text-success mb-1">User Management</h2>
                    <p className="text-secondary mb-0">
                      Modify account roles or remove users.
                    </p>
                  </div>

                  <Link href={toggleTestUsersHref} className="text-decoration-none">
                    <Button
                      variant={showTestUsers ? 'outline-success' : 'success'}
                      size="sm"
                      className="rounded-pill px-3"
                    >
                      {showTestUsers ? 'Hide Test Users' : 'Show Test Users'}
                    </Button>
                  </Link>
                </div>

                <Form method="get" action="/admin" className="mb-4">
                  <input type="hidden" name="page" value={currentPage} />
                  <input type="hidden" name="showTestUsers" value={String(showTestUsers)} />

                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      name="userSearch"
                      placeholder="Search users by email..."
                      defaultValue={userSearch}
                    />

                    <Button
                      type="submit"
                      variant="success"
                      className="rounded-pill px-4"
                    >
                      Search
                    </Button>

                    {userSearch && (
                      <Link
                        href={`/admin?page=${currentPage}&showTestUsers=${showTestUsers}`}
                        className="text-decoration-none"
                      >
                        <Button
                          variant="outline-secondary"
                          className="rounded-pill px-4"
                        >
                          Clear
                        </Button>
                      </Link>
                    )}
                  </div>
                </Form>

                <div className="d-flex flex-column gap-3">
                  {users.length > 0 ? (
                    users.map((user) => {
                      const isCurrentUser = user.id === currentUser.id;

                      return (
                        <div
                          key={user.id}
                          className="p-3 bg-light"
                          style={{ borderRadius: '1.25rem' }}
                        >
                          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">{user.email}</div>
                              <Badge
                                bg={user.role === Role.ADMIN ? 'success' : 'secondary'}
                                className="rounded-pill mt-2"
                              >
                                {user.role}
                              </Badge>
                            </div>

                            {isCurrentUser && (
                              <Badge bg="light" text="success" className="rounded-pill px-3 py-2">
                                Current User
                              </Badge>
                            )}
                          </div>

                          <div className="d-flex flex-wrap gap-2 mt-3">
                            <form action={updateUserRole} className="d-flex gap-2">
                              <input type="hidden" name="id" value={user.id} />

                              <Form.Select
                                name="role"
                                size="sm"
                                defaultValue={user.role}
                                disabled={isCurrentUser}
                                style={{ minWidth: '110px' }}
                              >
                                <option value={Role.USER}>USER</option>
                                <option value={Role.ADMIN}>ADMIN</option>
                              </Form.Select>

                              <Button
                                type="submit"
                                variant="success"
                                size="sm"
                                className="rounded-pill px-3"
                                disabled={isCurrentUser}
                              >
                                Save
                              </Button>
                            </form>

                            <form action={deleteUser}>
                              <input type="hidden" name="id" value={user.id} />

                              <Button
                                type="submit"
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-3"
                                disabled={isCurrentUser}
                              >
                                Delete
                              </Button>
                            </form>
                          </div>

                          {isCurrentUser && (
                            <p className="text-secondary small mt-3 mb-0">
                              You cannot change or delete your own admin account.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="bg-light text-center p-4"
                      style={{ borderRadius: '1.25rem' }}
                    >
                      <p className="text-secondary mb-0">
                        No users found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;