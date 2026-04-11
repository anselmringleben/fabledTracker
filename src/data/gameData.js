/**
 * Default character template based on the Fabled Lands adventure sheet.
 */
export const PROFESSIONS = [
  'Warrior',
  'Mage',
  'Priest',
  'Rogue',
  'Troubadour',
  'Wayfarer',
];

export const ABILITIES = [
  { key: 'charisma', label: 'Charisma', icon: '💬' },
  { key: 'combat', label: 'Combat', icon: '⚔️' },
  { key: 'magic', label: 'Magic', icon: '✨' },
  { key: 'sanctity', label: 'Sanctity', icon: '🛡️' },
  { key: 'scouting', label: 'Scouting', icon: '🔍' },
  { key: 'thievery', label: 'Thievery', icon: '🗝️' },
];

/** Default starting scores by profession (book 1, rank 1) */
export const STARTING_SCORES = {
  Warrior: { charisma: 3, combat: 6, magic: 2, sanctity: 4, scouting: 3, thievery: 2, defence: 8, stamina: 9 },
  Mage: { charisma: 2, combat: 2, magic: 6, sanctity: 1, scouting: 5, thievery: 3, defence: 4, stamina: 9 },
  Priest: { charisma: 4, combat: 2, magic: 3, sanctity: 6, scouting: 4, thievery: 2, defence: 4, stamina: 9 },
  Rogue: { charisma: 5, combat: 4, magic: 4, sanctity: 1, scouting: 2, thievery: 6, defence: 6, stamina: 9 },
  Troubadour: { charisma: 6, combat: 3, magic: 4, sanctity: 3, scouting: 2, thievery: 4, defence: 5, stamina: 9 },
  Wayfarer: { charisma: 2, combat: 5, magic: 2, sanctity: 3, scouting: 6, thievery: 4, defence: 7, stamina: 9 },
};

export const BOOKS = [
  { number: 1, title: 'The War-Torn Kingdom' },
  { number: 2, title: 'Cities of Gold and Glory' },
  { number: 3, title: 'Over the Blood-Dark Sea' },
  { number: 4, title: 'The Plains of Howling Darkness' },
  { number: 5, title: 'The Court of Hidden Faces' },
  { number: 6, title: 'Lords of the Rising Sun' },
  { number: 7, title: 'The Serpent King\'s Domain' },
  { number: 8, title: 'The Lone and Level Sands' },
  { number: 9, title: 'The Isle of a Thousand Spires' },
  { number: 10, title: 'Legions of the Labyrinth' },
  { number: 11, title: 'The City in the Clouds' },
  { number: 12, title: 'Into the Underworld' },
];

export const CODEWORDS_BY_BOOK = {
  1: [
    'Acid', 'Afraid', 'Ague', 'Aid', 'Aklar', 'Alissia', 'Almanac', 'Aloft', 'Altitude',
    'Altruist', 'Ambuscade', 'Amcha', 'Amends', 'Anchor', 'Anger', 'Animal', 'Anthem', 'Anvil',
    'Apache', 'Appease', 'Apple', 'Ark', 'Armour', 'Artefact', 'Artery', 'Ashen', 'Aspen',
    'Assassin', 'Assault', 'Assist', 'Attar', 'Auric', 'Avenge', 'Avert', 'Axe', 'Azure'
  ],
  2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
};

const FIRST_NAMES = [
  'Aethel', 'Bor', 'Cale', 'Dorin', 'Elias', 'Fen', 'Garran', 'Haldor', 'Iskander', 'Jorin',
  'Kael', 'Lys', 'Marek', 'Niamh', 'Orin', 'Pelor', 'Quinn', 'Rolan', 'Silas', 'Thalassa',
  'Ulf', 'Valerius', 'Wren', 'Xander', 'Yara', 'Zane',
  'Alara', 'Bess', 'Cassia', 'Dara', 'Elysia', 'Fiona', 'Gael', 'Hera', 'Isolde', 'Juno',
  'Kira', 'Lyra', 'Mira', 'Nia', 'Orla', 'Penelope', 'Qira', 'Ria', 'Sera', 'Talia',
  'Uma', 'Valeria', 'Wynne', 'Xanthe', 'Yselle', 'Zita'
];

const BYNAMES = [
  'the Bold', 'the Swift', 'the Shadow', 'of Yellowport', 'the Wanderer', 'the Brave',
  'the Cunning', 'of Sokar', 'the Fierce', 'the Silent', 'the Just', 'the Seeker',
  'Stormborn', 'Ironhand', 'the Restless', 'the Merciful', 'the Exile', 'the Stalwart',
  'of Metriciens', 'the Fox', 'the Bear', 'the Wolf', 'the Eagle', 'the Hawk',
  'of the Isle', 'the Blessed', 'the Cursed', 'the Relentless', 'of Metriciens',
  'the Far-Traveled', 'the Keeper', 'the Unbroken', 'the Valiant', 'the Golden',
  'of Marlock City', 'the Silver', 'the Hunter', 'the Scholar', 'the Mystic'
];

export function generateRandomName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const byname = BYNAMES[Math.floor(Math.random() * BYNAMES.length)];
  return `${firstName} ${byname}`;
}

export function createCharacter(name = '', profession = 'Warrior') {
  const scores = STARTING_SCORES[profession] || STARTING_SCORES.Warrior;
  return {
    id: crypto.randomUUID(),
    name,
    profession,
    rank: 1,
    defence: scores.defence,
    staminaMax: scores.stamina,
    staminaCurrent: scores.stamina,
    charisma: scores.charisma,
    combat: scores.combat,
    magic: scores.magic,
    sanctity: scores.sanctity,
    scouting: scores.scouting,
    thievery: scores.thievery,
    shards: 16,
    possessions: ['Sword', 'Leather Jerkin (Defence +1)', 'Map'],
    codewords: [],
    blessings: [],
    titles: [],
    resurrection: '',
    currentBook: 1,
    currentSection: 1,
    journeyLog: [],
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
