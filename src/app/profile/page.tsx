import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import {
  CameraFill,
  EnvelopeFill,
  PersonFill,
  TrashFill,
} from 'react-bootstrap-icons';
import FavoritePlaceButton from '@/components/FavoritePlaceButton';
import { auth } from '@/lib/auth';
import {
  removeProfileImage,
  updateProfileName,
  updateProfileImage,
} from '@/lib/dbActions';
import { getCurrentUserFavoriteLocations } from '@/lib/favorites';
import { LOCATION_CONFIG } from '@/lib/locationConfig';
import { LOCATION_SLUGS } from '@/lib/locationSlugs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProfilePageProps = {
  searchParams: Promise<{
    profileError?: string;
    profileUpdated?: string;
  }>;
};

const profileErrorMessages: Record<string, string> = {
  'image-too-large': 'Choose an image smaller than 1 MB.',
  'invalid-image-type': 'Upload a JPG, PNG, WebP, or GIF image.',
  'invalid-name': 'Enter a valid first and last name.',
  'missing-image': 'Choose an image file before uploading.',
  'missing-name': 'First and last name are required.',
  'name-too-long': 'First and last name must each be 50 characters or fewer.',
};

const profileUpdatedMessages: Record<string, string> = {
  image: 'Profile image updated.',
  'image-removed': 'Profile image removed.',
  name: 'Name updated.',
};

const formatUserName = (firstName?: string | null, lastName?: string | null) => {
  const fullName = [firstName, lastName]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(' ');

  return fullName || null;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'U';

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const [user, favoriteLocations] = await Promise.all([
    prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
      },
    }),
    getCurrentUserFavoriteLocations(),
  ]);

  if (!user) {
    redirect('/auth/signin');
  }

  const profileError = params.profileError
    ? profileErrorMessages[params.profileError]
    : null;
  const profileUpdated = params.profileUpdated
    ? profileUpdatedMessages[params.profileUpdated]
    : null;
  const displayName = formatUserName(user.firstName, user.lastName) ?? user.email;

  return (
    <main
      className="py-5"
      style={{
        background: 'linear-gradient(180deg, #eef8f1 0%, #f6f8fb 50%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <Container className="py-4">
        <div
          className="text-white shadow-lg p-4 p-md-5 mb-4"
          style={{
            borderRadius: '2rem',
            background: 'linear-gradient(135deg, #0b5d3b 0%, #1a7f5b 55%, #54a67b 100%)',
          }}
        >
          <Row className="align-items-center g-4">
            <Col md="auto">
              <div
                className="bg-white text-success fw-bold d-flex align-items-center justify-content-center overflow-hidden shadow-sm"
                style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%',
                  fontSize: '3.5rem',
                }}
              >
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    unoptimized
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  getInitial(displayName)
                )}
              </div>
            </Col>

            <Col>
              <p className="text-uppercase fw-semibold small mb-2">User Profile</p>
              <h1 className="fw-bold display-5 mb-3">{displayName}</h1>
              <p className="fs-5 mb-0">{user.email}</p>
            </Col>
          </Row>
        </div>

        {profileError && (
          <div className="alert alert-danger rounded-4 fw-semibold" role="alert">
            {profileError}
          </div>
        )}

        {profileUpdated && (
          <div className="alert alert-success rounded-4 fw-semibold" role="status">
            {profileUpdated}
          </div>
        )}

        <Row className="g-4">
          <Col lg={6}>
            <div className="bg-white shadow-sm p-4 h-100" style={{ borderRadius: '1.5rem' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <PersonFill className="text-success" size={22} />
                <h2 className="fw-bold h4 mb-0">Profile Details</h2>
              </div>

              <form action={updateProfileName} className="d-flex flex-column gap-3">
                <Row className="g-3">
                  <Col sm={6}>
                    <label htmlFor="profile-first-name" className="form-label fw-semibold">
                      First name
                    </label>
                    <input
                      id="profile-first-name"
                      name="firstName"
                      type="text"
                      className="form-control form-control-lg"
                      defaultValue={user.firstName ?? ''}
                      maxLength={50}
                      required
                    />
                  </Col>
                  <Col sm={6}>
                    <label htmlFor="profile-last-name" className="form-label fw-semibold">
                      Last name
                    </label>
                    <input
                      id="profile-last-name"
                      name="lastName"
                      type="text"
                      className="form-control form-control-lg"
                      defaultValue={user.lastName ?? ''}
                      maxLength={50}
                      required
                    />
                  </Col>
                </Row>

                <div>
                  <label htmlFor="profile-email" className="form-label fw-semibold">
                    Email address
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light">
                      <EnvelopeFill className="text-secondary" />
                    </span>
                    <input
                      id="profile-email"
                      type="email"
                      className="form-control"
                      value={user.email}
                      readOnly
                      aria-readonly="true"
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn btn-success btn-lg fw-semibold px-4">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Col>

          <Col lg={6}>
            <div className="bg-white shadow-sm p-4 h-100" style={{ borderRadius: '1.5rem' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <CameraFill className="text-success" size={22} />
                <h2 className="fw-bold h4 mb-0">Profile Image</h2>
              </div>

              <form action={updateProfileImage} encType="multipart/form-data" className="mb-3">
                <label htmlFor="profile-image" className="form-label fw-semibold">
                  Upload image
                </label>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <input
                    id="profile-image"
                    name="profileImage"
                    type="file"
                    className="form-control form-control-lg"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                  />
                  <button type="submit" className="btn btn-success btn-lg fw-semibold px-4">
                    Upload
                  </button>
                </div>
                <p className="text-secondary small mt-2 mb-0">
                  JPG, PNG, WebP, or GIF. Maximum size: 1 MB.
                </p>
              </form>

              {user.profileImage && (
                <form action={removeProfileImage}>
                  <button type="submit" className="btn btn-light border fw-semibold">
                    <TrashFill className="me-2" />
                    Remove image
                  </button>
                </form>
              )}
            </div>
          </Col>
        </Row>

        <div className="bg-white shadow-sm p-4 p-md-5 mt-4" style={{ borderRadius: '1.5rem' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-2">Favorite Places</h2>
              <p className="text-secondary mb-0">
                Bookmarked campus spots for quicker check-ins.
              </p>
            </div>

            <Link href="/locations" className="btn btn-success rounded-pill fw-semibold px-4">
              Browse Locations
            </Link>
          </div>

          {favoriteLocations.length > 0 ? (
            <Row className="g-3">
              {favoriteLocations.map((location) => {
                const config = LOCATION_CONFIG[location];

                return (
                  <Col md={6} xl={4} key={location}>
                    <div className="border bg-light p-4 h-100" style={{ borderRadius: '1rem' }}>
                      <p className="text-uppercase text-muted fw-semibold small mb-2">
                        {config.category}
                      </p>
                      <h3 className="fw-bold h5 mb-2">{config.label}</h3>
                      <p className="text-secondary mb-4">{config.description}</p>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          href={`/locations/${LOCATION_SLUGS[location]}`}
                          className="btn btn-light border rounded-pill fw-semibold"
                        >
                          View Details
                        </Link>
                        <FavoritePlaceButton
                          isFavorited
                          isLoggedIn
                          location={location}
                          size="sm"
                        />
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <div className="bg-light rounded-4 p-4">
              <p className="text-secondary mb-0">
                No favorite places yet. Bookmark locations you check often.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

export default ProfilePage;
