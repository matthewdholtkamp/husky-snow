export interface Chapter {
  id: string;
  title: string;
  objective: string;
  sceneHint: string;
  intro: string;
  beats: string[];
  minBeats: number;
  climax: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter_1',
    title: 'Chapter 1: The Warning of Mist',
    objective: 'Investigate the Moonshine River and find out what is making the water sick.',
    sceneHint: 'river',
    intro: 'Shiver hears a telepathic warning from Mist about the river poisoning. The trainees must head to the Moonshine River to investigate.',
    beats: [
      'Discover sick river water and find oily, dark residue clinging to the rocks.',
      'Hear Mist\'s voice whispering warning signs and portents in Shiver\'s mind.',
      'Find a trail clue like a strange bird print or a blackened twig near the bank.',
      'Choose whether to help a struggling packmate (e.g. Oak navigating a slippery rock).',
      'Confront a minor threat like a frozen stream-weasel or a collapsing ice shelf.'
    ],
    minBeats: 3,
    climax: 'A sudden rush of poisoned, black-sludge water surges down the river. The pups must work together to escape to high ground.'
  },
  {
    id: 'chapter_2',
    title: 'Chapter 2: The Prophecy & The Seven',
    objective: 'Return to the pack camp and speak with Starwhirl about the prophecy.',
    sceneHint: 'forest',
    intro: 'The pups return to the camp to tell the elders, but Dragonfly is furious at Shiver. They must consult Starwhirl.',
    beats: [
      'Present the poisoned residue to Healer Sweetbrush in the Healer\'s Den.',
      'Confront Oak\'s mother, Dragonfly, and her intense, protective anger towards Shiver.',
      'Consult Starwhirl under the Star-stone to hear the ancient prophecy of the seven quest pups.',
      'Explain the dream that Flurry had, which matches the dark signs.',
      'Encounter Frostbite and Cold playing sillily near the elder den, providing a brief respite.'
    ],
    minBeats: 3,
    climax: 'Starwhirl gives a solemn blessing for the quest, but the pack elders vote to forbid the pups from leaving. The pups decide they must sneak away tonight.'
  },
  {
    id: 'chapter_3',
    title: 'Chapter 3: Escaping the Pack',
    objective: 'Sneak past the elders and leave the camp boundary toward the human road.',
    sceneHint: 'road',
    intro: 'The pups sneak out under the moon, avoiding the border guards.',
    beats: [
      'Avoid the sharp nose of Dragonfly guarding the main trail.',
      'Keep Spruce from making too loud a joke that might alert the nearby hunters.',
      'Navigate a steep, icy slope where Oak\'s missing leg makes descending difficult.',
      'Evade a pack patrol led by Storm (who has not yet joined the group\'s cause).',
      'Help Flurry overcome her anxiety as she gets stuck in a thicket.'
    ],
    minBeats: 3,
    climax: 'Storm corners the group at the boundary line. Instead of alerting the pack, he demands to join the quest, and Shiver agrees to let him.'
  },
  {
    id: 'chapter_4',
    title: 'Chapter 4: The Human Road',
    objective: 'Navigate the edges of the human road and look for a way around the coyote pack.',
    sceneHint: 'road',
    intro: 'The pups reach the dangerous human road, covered in strange lights and smells.',
    beats: [
      'Cross the wide, black path of the human road safely.',
      'Encounter Kitsune, the trickster fox spirit, who hides the road crossing with illusions.',
      'Evade a passing human vehicle with bright, blinding eyes.',
      'Forage for supplies or herbs like Soft Moss in the human trash or roadside hedges.',
      'Comfort Mist, whose voice grows agitated as they draw closer to the source of the rot.'
    ],
    minBeats: 3,
    climax: 'A giant metal beast (truck) zooms past, creating a massive snowdrift. The pups must dodge the flying ice and cross before the road is blocked.'
  },
  {
    id: 'chapter_5',
    title: 'Chapter 5: The Amberwood Coyotes',
    objective: 'Sneak through or confront the Amberwood coyotes to gain passage to the mountains.',
    sceneHint: 'coyote_camp',
    intro: 'The pups enter the territory of the Amberwood coyotes, who are suspicious of intruders.',
    beats: [
      'Face the fierce Amberwood pup Quicksand, who blocks the path with playful but dangerous hostility.',
      'Befriend Quicksand as Glacier challenges her to a show of strength or wit.',
      'De-escalate the growls of Quicksand\'s suspicious brother, Thorn.',
      'Interact with small coyote pup Floral, who talks in breathless sentences and wants to learn crafting from Shiver.',
      'Discover a hidden coyote cache containing a useful item (like Aloe Leaf or Snare Trap).'
    ],
    minBeats: 3,
    climax: 'A pack of feral wolves encroaches on the coyote camp. The pups and coyotes must form a temporary alliance to defend the territory.'
  },
  {
    id: 'chapter_6',
    title: 'Chapter 6: The Dreamlands',
    objective: 'Unlock your pack\'s inner magic by connecting with the spirits of the Dreamlands.',
    sceneHint: 'dreamland',
    intro: 'The pups sleep near the mountains and wake in the Dreamlands to awaken their magic.',
    beats: [
      'Meet the moon-spirit Lunarprie on her starry throne.',
      'Engage in a dream-trial where Shiver must craft a light key using spirit shards.',
      'Help Glacier and Storm unlock their water and red lightning magic by controlling their fierce tempers.',
      'Support Spruce in a fast-paced chase trial with the wind-spirit Aerwinden.',
      'Observe Mist\'s sorrow as she faces her past in the shadow corners of the Dreamlands.'
    ],
    minBeats: 3,
    climax: 'The Dreamlands begin to crack as a dark spirit, Kakos, tries to sever the connection. The pups must unite their newly-awakened magic to stabilize the dream.'
  },
  {
    id: 'chapter_7',
    title: 'Chapter 7: The Crystal Finale',
    objective: 'Reach the Frost Crystal and make the ultimate decision: restore or destroy.',
    sceneHint: 'cave',
    intro: 'The pups arrive at the icy cave where the Frost Crystal lies, pulsing with corrupted dark energy.',
    beats: [
      'Navigate the deep, narrow cracks of the frozen cavern.',
      'Overcome the dark wisps and shadow figures trying to drain the pups\' energy.',
      'Work together to clear the massive rocks blocking the chamber entrance.',
      'Comfort Mist as she hears the voices of the dark spirits trying to tempt her.',
      'Place the collected spirits on the sigil pedestals to open the crystal chamber.'
    ],
    minBeats: 3,
    climax: 'The pups stand before the Frost Crystal. It is time to make the choice: ignite the crystal with light to restore the river, or destroy it. The story ends here with a prompt for Quinn to write the true ending.'
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
