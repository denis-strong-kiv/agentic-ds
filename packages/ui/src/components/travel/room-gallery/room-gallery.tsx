'use client';

import * as React from 'react';
import { cn } from '../../../utils/cn.js';
import { Button } from '../../ui/button/index.js';
import { Badge } from '../../ui/badge/index.js';
import { AspectRatio } from '../../ui/aspect-ratio/index.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog/index.js';

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
      <div className="travel-room-gallery-main">
        <AspectRatio ratio={16 / 9}>
          {images.length > 0 ? (
            <img
              src={images[current]}
              alt={`${alt} (${current + 1})`}
              className="travel-room-gallery-image"
            />
          ) : (
            <div className="travel-room-gallery-empty">
              No image
            </div>
          )}
          {/* Fullscreen button */}
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className="travel-room-gallery-fullscreen-btn"
          >
            <svg className="travel-room-gallery-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              className="travel-room-gallery-nav travel-room-gallery-nav--prev"
              aria-label="Previous image"
            >‹</button>
            <button
              type="button"
              onClick={() => setCurrent(i => (i + 1) % images.length)}
              className="travel-room-gallery-nav travel-room-gallery-nav--next"
              aria-label="Next image"
            >›</button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="travel-room-gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-pressed={i === current}
              className={cn(
                'travel-room-gallery-thumb-btn',
                i === current
                  ? 'travel-room-gallery-thumb-btn--active'
                  : 'travel-room-gallery-thumb-btn--inactive',
              )}
            >
              <img src={src} alt="" className="travel-room-gallery-thumb-image" aria-hidden />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent size="full" className="travel-room-gallery-dialog">
          <DialogHeader className="travel-room-gallery-dialog-header">
            <DialogTitle className="travel-room-gallery-dialog-title">{alt}</DialogTitle>
          </DialogHeader>
          <div className="travel-room-gallery-dialog-body">
            {images.length > 0 && (
              <img
                src={images[current]}
                alt={`${alt} (${current + 1})`}
                className="travel-room-gallery-dialog-image"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
                  className="travel-room-gallery-dialog-nav travel-room-gallery-dialog-nav--prev"
                  aria-label="Previous image"
                >‹</button>
                <button
                  type="button"
                  onClick={() => setCurrent(i => (i + 1) % images.length)}
                  className="travel-room-gallery-dialog-nav travel-room-gallery-dialog-nav--next"
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
        'travel-room-card',
        isSelected
          ? 'travel-room-card--selected'
          : 'travel-room-card--idle',
      )}
    >
      <div className="travel-room-card-header">
        <div>
          <h4 className="travel-room-card-title">{room.name}</h4>
          {room.size && (
            <p className="travel-room-card-size">{room.size}</p>
          )}
        </div>
        <div className="travel-room-card-price-wrap">
          <p className="travel-room-card-price">{room.pricePerNight}</p>
          <p className="travel-room-card-price-meta">{room.currency ?? 'USD'}/night</p>
        </div>
      </div>

      <p className="travel-room-card-bed">{room.bedConfiguration}</p>

      {room.isLastFew && room.availability <= 3 && (
        <Badge variant="destructive" className="travel-room-card-alert-badge">
          Only {room.availability} room{room.availability > 1 ? 's' : ''} left at this price!
        </Badge>
      )}

      <div className="travel-room-card-amenities">
        {room.amenities.slice(0, 4).map(a => (
          <span key={a} className="travel-room-card-amenity-pill">
            {a}
          </span>
        ))}
        {room.amenities.length > 4 && (
          <span className="travel-room-card-amenity-more">+{room.amenities.length - 4}</span>
        )}
      </div>

      <Button
        variant={isSelected ? 'primary' : 'outline'}
        size="sm"
        className="travel-room-card-select-btn"
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
    <div className={cn('travel-room-gallery-layout', className)}>
      {/* Gallery area */}
      <div className="travel-room-gallery-column">
        {selectedRoom && (
          <>
            <ImageGallery images={selectedRoom.images} alt={selectedRoom.name} />
            {selectedRoom.description && (
              <p className="travel-room-gallery-description">{selectedRoom.description}</p>
            )}
          </>
        )}
      </div>

      {/* Room selector */}
      <div className="travel-room-selector-column">
        <h3 className="travel-room-selector-title">
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
