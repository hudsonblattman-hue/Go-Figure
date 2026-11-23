import {bank as originalBank} from './questions-legacy.js';
import {dateKey} from './game.js';

export const BALANCED_FROM = '2026-11-23'; // Midnight in America/Los_Angeles.
export const MAX_STAT_RATIO = 5;
const opt=(label,unit,value)=>({label,unit,value});
const src=(label,url)=>({label,url});

const updates={
 eiffel:{
  note:'Height includes antennas. First-floor height uses the operator’s figure in feet; ground-level width uses its metric figure. The 72 names refer to the original frieze commissioned by Gustave Eiffel, excluding later additions.',
  options:[opt('Height','m',330),opt('First-floor height','ft',187),opt('Ground-level width','m',125),opt('Names on the original frieze','names',72)],
  sources:[src('Eiffel Tower — metric key figures','https://www.toureiffel.paris/fr/le-monument/chiffres-cle'),src('Eiffel Tower — imperial key figures','https://www.toureiffel.paris/en/the-monument/key-figures'),src('Eiffel Tower — the original 72 names','https://www.toureiffel.paris/en/news/130-years/whose-are-72-names-inscribed-eiffel-tower-and-why-are-they-there')]
 },
 romeo:{
  note:'Counts refer to the play in the Folger text, rather than to the physical book. The 24 scenes are counted from its act-and-scene listing: 5 + 6 + 5 + 5 + 3. Prologues are excluded from the scene count; the opening prologue has 14 lines.',
  options:[opt('Number of scenes','scenes',24),opt('Number of acts','acts',5),opt('Opening prologue length','lines',14),opt('Juliet’s age','years',13)],
  sources:[src('Folger — complete play and scene listing','https://www.folger.edu/explore/shakespeares-works/romeo-and-juliet/read/'),src('Folger — Juliet’s age','https://www.folger.edu/blogs/folger-spotlight/collection-connections-fair-rosaline/')]
 },
 whale:{
  note:'These are NOAA’s listed maximum size and upper ends of its estimated average-lifespan and gestation ranges, not measurements of one individual. The listed 330,000 lb is about 150 metric tonnes. The upper gestation estimate of 12 months is expressed as approximately 365 days. Rounded conversions are explicitly labeled.',
  options:[opt('Maximum length','ft',110),opt('Listed maximum weight','metric tonnes, approx.',150),opt('Estimated lifespan, upper end','years',90),opt('Gestation, upper estimate','days, approx.',365)]
 },
 liberty:{
  note:'Measurements and counts follow the National Park Service. Total height is ground to torch in meters. Right-arm length uses the published 42 feet. Nose length is 4 feet 6 inches, converted exactly to 54 inches.',
  options:[opt('Height, ground to torch','m',92.99),opt('Windows in the crown','windows',25),opt('Length of nose','inches',54),opt('Length of right arm','ft',42)]
 },
 bridge:{
  note:'Figures follow the Golden Gate Bridge district in the units shown. Roadway width is between curbs. Clearance is measured above mean higher high water; tower height is above water.',
  options:[opt('Clearance above high water','ft',220),opt('Tower height above water','m',227),opt('Bridge width','ft',90),opt('Roadway width','ft',62)],
  sources:[src('Bridge district — construction statistics','https://www.goldengate.org/bridge/history-research/statistics-data/design-construction-stats/')]
 },
 gold:{
  note:'Properties follow the Royal Society of Chemistry. Relative atomic mass is dimensionless. Its listed covalent radius of 1.30 angstroms and non-bonded atomic radius of 2.14 angstroms are expressed as 130 and 214 picometers (1 angstrom = 100 pm). Image is an element illustration.',
  options:[opt('Atomic number','',79),opt('Covalent radius','pm',130),opt('Relative atomic mass','',196.967),opt('Non-bonded atomic radius','pm',214)]
 },
 mars:{
  note:'The rotation period is rounded to 24.6 hours. Axial tilt of 25 degrees and atmospheric carbon dioxide of 95.3% follow the NASA JPL InSight press kit. Mean orbital speed of 24.08 km/s follows NASA’s Mars fact sheet.',
  options:[opt('Rotation period','Earth hours, approx.',24.6),opt('Axial tilt','degrees, approx.',25),opt('Atmospheric carbon dioxide','%',95.3),opt('Mean orbital speed','km/s',24.08)],
  sources:[src('NASA JPL — Mars at a glance','https://www.jpl.nasa.gov/news/press_kits/insight/landing/facts/mars-at-a-glance/'),src('NASA — Mars fact sheet','https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html')]
 },
 jupiter:{
  note:'Day length, Sun distance, and axial tilt follow NASA’s rounded figures. Year length follows ESA. An astronomical unit (AU) is the Earth–Sun distance.',
  options:[opt('Axial tilt','degrees, approx.',3),opt('Length of day','Earth hours',9.9),opt('Length of year','Earth years',11.86),opt('Distance from the Sun','AU',5.2)]
 },
 moon:{
  note:'Values follow NASA’s Moon fact sheet. Mean density of 3,344 kg/m³ is expressed as 3.344 g/cm³. Orbital inclination is relative to the ecliptic, the plane of Earth’s orbit around the Sun.',
  options:[opt('Surface gravity','m/s²',1.62),opt('Escape velocity','km/s',2.38),opt('Mean density','g/cm³',3.344),opt('Orbital tilt to the ecliptic','degrees',5.145)],
  sources:[src('NASA — Moon fact sheet','https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html')]
 }
};

export const balancedBank=originalBank.map(question=>({...question,...updates[question.id]}));

// Keep previously published questions and saved scores stable across the rollout.
export function bankFor(key){return key<BALANCED_FROM?originalBank:balancedBank;}

// Compatibility for a cached app.js that still imports the old named export.
export const bank=bankFor(dateKey());
