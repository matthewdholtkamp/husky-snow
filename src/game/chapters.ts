export interface Chapter {
  id: string;
  title: string;
  objective: string;
  sceneHint: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter_1',
    title: 'Chapter 1: The Warning of Mist',
    objective: 'Investigate the Moonshine River and find out what is making the water sick.',
    sceneHint: 'river'
  },
  {
    id: 'chapter_2',
    title: 'Chapter 2: The Prophecy & The Seven',
    objective: 'Return to the pack camp and speak with Starwhirl about the prophecy.',
    sceneHint: 'forest'
  },
  {
    id: 'chapter_3',
    title: 'Chapter 3: Escaping the Pack',
    objective: 'Sneak past the elders and leave the camp boundary toward the human road.',
    sceneHint: 'road'
  },
  {
    id: 'chapter_4',
    title: 'Chapter 4: The Human Road',
    objective: 'Navigate the edges of the human road and look for a way around the coyote pack.',
    sceneHint: 'road'
  },
  {
    id: 'chapter_5',
    title: 'Chapter 5: The Amberwood Coyotes',
    objective: 'Sneak through or confront the Amberwood coyotes to gain passage to the mountains.',
    sceneHint: 'coyote_camp'
  },
  {
    id: 'chapter_6',
    title: 'Chapter 6: The Dreamlands',
    objective: 'Unlock your pack\'s inner magic by connecting with the spirits of the Dreamlands.',
    sceneHint: 'dreamland'
  },
  {
    id: 'chapter_7',
    title: 'Chapter 7: The Crystal Finale',
    objective: 'Reach the Frost Crystal and make the ultimate decision: restore or destroy.',
    sceneHint: 'cave'
  }
];

export const getChapter = (id: string): Chapter | undefined => {
  return CHAPTERS.find(c => c.id === id);
};

export const getNextChapter = (currentId: string): Chapter | undefined => {
  const currentIndex = CHAPTERS.findIndex(c => c.id === currentId);
  if (currentIndex !== -1 && currentIndex < CHAPTERS.length - 1) {
    return CHAPTERS[currentIndex + 1];
  }
  return undefined;
};
