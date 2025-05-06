const StoryItemTemplate = (story) => {
  const createdAt = new Date(story.createdAt);
  const formattedDate = createdAt.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
      <div class="story-item">
        <img src="${story.photoUrl}" alt="${
    story.name
  }" class="story-item__thumbnail">
        <div class="story-item__content">
          <h3 class="story-item__name">${story.name}</h3>
          <p class="story-item__date"><i class="fas fa-calendar"></i> ${formattedDate}</p>
          <p class="story-item__description">${story.description.substring(
            0,
            100
          )}${story.description.length > 100 ? "..." : ""}</p>
        </div>
      </div>
    `;
};

export default StoryItemTemplate;
