'use client';

import { Box, Button, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';

interface Props {
  page: number;
  totalPages: number;
  search?: string;
  sort?: string;
}

function buildHref(p: number, search?: string, sort?: string) {
  const params = new URLSearchParams();
  if (p > 1) params.set('page', String(p));
  if (search) params.set('search', search);
  if (sort && sort !== 'date-desc') params.set('sort', sort);
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ''}`;
}

export default function ProductsPagination({ page, totalPages, search, sort }: Props) {
  if (totalPages <= 1) return null;

  // Show max 7 page buttons with ellipsis logic
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (page >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} mt={6}>
      <IconButton
        component={Link}
        href={buildHref(page - 1, search, sort)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </IconButton>

      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <Box key={`ellipsis-${i}`} sx={{ px: 1, color: 'text.secondary' }}>
            …
          </Box>
        ) : (
          <Button
            key={p}
            component={Link}
            href={buildHref(Number(p), search, sort)}
            variant={p === page ? 'contained' : 'outlined'}
            size="small"
            sx={{ minWidth: 36, px: 0 }}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      )}

      <IconButton
        component={Link}
        href={buildHref(page + 1, search, sort)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
