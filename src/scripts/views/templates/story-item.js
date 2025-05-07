// src/scripts/views/templates/story-item.js

const StoryItemTemplate = (story) => {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // Icon untuk status offline/online
  const statusIcon = story.isOffline
    ? '<span class="offline-indicator" title="Data dari penyimpanan lokal"><i class="fas fa-database"></i></span>'
    : "";

  return `
    <div class="story-item" id="story-${story.id}">
      <div class="story-image">
        <img src="${story.photoUrl}" alt="${story.name}" loading="lazy">
      </div>
      <div class="story-content">
        <h3 class="story-title">${story.name} ${statusIcon}</h3>
        <p class="story-date">Diunggah pada ${formatDate(story.createdAt)}</p>
        <p class="story-description">${truncateText(story.description, 150)}</p>
        <div class="story-footer">
          <div class="story-location">
            ${
              story.lat && story.lon
                ? `<i class="fas fa-map-marker-alt"></i> Lokasi tersedia`
                : '<i class="fas fa-map-marker-alt text-muted"></i> Tidak ada lokasi'
            }
          </div>
          <button class="delete-button" data-id="${story.id}">
            <i class="fas fa-trash"></i> Hapus Cerita
          </button>
        </div>
      </div>
    </div>
  `;
};

export default StoryItemTemplate;
