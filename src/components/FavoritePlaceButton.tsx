'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import { toggleFavoritePlace } from '@/lib/dbActions';

type FavoritePlaceButtonProps = {
  isFavorited: boolean;
  isLoggedIn: boolean;
  location: string;
  size?: 'sm' | 'lg';
};

const FavoritePlaceButton = ({
  isFavorited,
  isLoggedIn,
  location,
  size,
}: FavoritePlaceButtonProps) => {
  const router = useRouter();
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/signin"
        className={`btn btn-light border rounded-pill fw-semibold d-inline-flex align-items-center gap-2${
          size === 'lg' ? ' btn-lg' : size === 'sm' ? ' btn-sm' : ''
        }`}
      >
        <Star />
        Sign in to bookmark
      </Link>
    );
  }

  const handleToggleFavorite = () => {
    const nextFavorite = !optimisticFavorite;
    const formData = new FormData();
    formData.set('location', location);
    formData.set('favorited', String(nextFavorite));

    setOptimisticFavorite(nextFavorite);

    startTransition(async () => {
      try {
        await toggleFavoritePlace(formData);
        router.refresh();
      } catch {
        setOptimisticFavorite(!nextFavorite);
      }
    });
  };

  return (
    <Button
      type="button"
      variant={optimisticFavorite ? 'success' : 'light'}
      size={size}
      className="border rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
      aria-pressed={optimisticFavorite}
      disabled={isPending}
      onClick={handleToggleFavorite}
    >
      {optimisticFavorite ? <StarFill /> : <Star />}
      {isPending ? 'Saving...' : optimisticFavorite ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
};

export default FavoritePlaceButton;
