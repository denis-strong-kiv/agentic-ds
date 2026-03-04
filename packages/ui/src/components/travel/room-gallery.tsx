'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/button.js';
import { Badge } from '../ui/badge.js';
import { AspectRatio } from '../ui/aspect-ratio.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  size?: string;
  bedConfiguration: string;
  amenities: string[];
  pricePerNight: string;
  currency?: string;
  images: string[];
  availability: number;
  isLastFew?: boolean;
}

export interface RoomGalleryProps {
  rooms: RoomType[];
  onSelectRoom?: (roomId: string) => void;
  className?: string;
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);

  return (
    <>
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {images.length > 0 ? (
            <img
              src={images[current]}
              alt={`${alt} (${current + 1})`}
              className="h-full w-full object-cover rounded-[var(--shape-preset-card)]"
            />
          ) : (
            <div className="h-full w-full bg-[var(--color-background-subtle)] rounded-[var(--shape-preset-card)] flex items-center justify-center text-[var(--color-foreground-subtle)]">
              No image
            </div>
          )}
          {/* Fullscreen button */}
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </AspectRatio>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >‹</button>
            <button
              type="button"
              onClick={() => setCurrent(i => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >›</button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-pressed={i === current}
              className={cn(
                'flex-shrink-0 h-12 w-16 rounded overflow-hidden border-2 transition-colors',
                i === current
                  ? 'border-[var(--color-primary-default)]'
                  : 'border-transparent hover:border-[var(--color-border-default)]',
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" aria-hidden />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent size="full" className="p-0">
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white">{alt}</DialogTitle>
          </DialogHeader>
          <div className="relative h-full bg-black flex items-center justify-center">
            {images.length > 0 && (
              <img
                src={images[current]}
                alt={`${alt} (${current + 1})`}
                className="max-h-full max-w-full object-contain"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-4 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center text-2xl hover:bg-black/70"
                  aria-label="Previous image"
                >‹</button>
                <button
                  type="button"
                  onClick={() => setCurrent(i => (i + 1) % images.length)}
                  className="absolute right-4 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center text-2xl hover:bg-black/70"
                  aria-label="Next image"
                >›</button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── RoomTypeCard ─────────────────────────────────────────────────────────────

function RoomTypeCard({
  room,
  isSelected,
  onSelect,
}: {
  room: RoomType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--shape-preset-card)] border-2 transition-colors p-4',
        isSelected
          ? 'border-[var(--color-primary-default)] bg-[var(--color-primary-default)]/5'
          : 'border-[var(--color-border-default)] bg-[var(--color-surface-card)] hover:border-[var(--color-primary-default)]/50',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-medium text-[var(--color-foreground-default)]">{room.name}</h4>
          {room.size && (
            <p className="text-xs text-[var(--color-foreground-muted)]">{room.size}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--color-foreground-default)]">{room.pricePerNight}</p>
          <p className="text-xs text-[var(--color-foreground-muted)]">{room.currency ?? 'USD'}/night</p>
        </div>
      </div>

      <p className="text-sm text-[var(--color-foreground-muted)] mb-2">{room.bedConfiguration}</p>

      {room.isLastFew && room.availability <= 3 && (
        <Badge variant="destructive" className="mb-2 text-xs">
          Only {room.availability} room{room.availability > 1 ? 's' : ''} left at this price!
        </Badge>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {room.amenities.slice(0, 4).map(a => (
          <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)]">
            {a}
          </span>
        ))}
        {room.amenities.length > 4 && (
          <span className="text-xs text-[var(--color-foreground-subtle)]">+{room.amenities.length - 4}</span>
        )}
      </div>

      <Button
        variant={isSelected ? 'primary' : 'outline'}
        size="sm"
        className="w-full"
        onClick={onSelect}
        aria-pressed={isSelected}
      >
        {isSelected ? 'Selected' : 'Select Room'}
      </Button>
    </div>
  );
}

// ─── RoomGallery ──────────────────────────────────────────────────────────────

export function RoomGallery({
  rooms,
  onSelectRoom,
  className,
}: RoomGalleryProps) {
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | undefined>(rooms[0]?.id);
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) ?? rooms[0];

  function handleSelect(roomId: string) {
    setSelectedRoomId(roomId);
    onSelectRoom?.(roomId);
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
      {/* Gallery area */}
      <div className="lg:col-span-2">
        {selectedRoom && (
          <>
            <ImageGallery images={selectedRoom.images} alt={selectedRoom.name} />
            {selectedRoom.description && (
              <p className="mt-3 text-sm text-[var(--color-foreground-muted)]">{selectedRoom.description}</p>
            )}
          </>
        )}
      </div>

      {/* Room selector */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-foreground-default)]">
          {rooms.length} Room Type{rooms.length !== 1 ? 's' : ''} Available
        </h3>
        {rooms.map(room => (
          <RoomTypeCard
            key={room.id}
            room={room}
            isSelected={room.id === selectedRoomId}
            onSelect={() => handleSelect(room.id)}
          />
        ))}
      </div>
    </div>
  );
}
