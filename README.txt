GO FIGURE — THE DAILY STATS GUESSING GAME

Run locally:
  npm start
Then open http://localhost:3000
Requires Python 3 for the development server; no dependency installation needed.

Run rules and timezone tests:
  npm test
Requires Node.js 18 or later.

Rules:
Five daily questions, four hidden numerical statistics each. Select the largest
number using the units shown. Every pick earns its numeric value, even if it is
not the largest. All four values and proportional bars appear after each pick.
Daily total is the sum of the five chosen values, to three decimal places.

Daily reset is midnight America/Los_Angeles (San Diego), including DST changes.
Everyone on the same version gets the same daily questions and option order.
Open tabs automatically load the new day's game when the date changes.
Progress and streaks are saved in browser localStorage, with updates between
tabs. There are no accounts, cross-device syncing, or global leaderboards.
Clearing browser storage resets progress. The standalone file must keep the
same filename/location for consistent browser storage behavior; file-storage
policies vary by browser. Hosting the public folder gives more reliable storage.

CONTENT
The starter bank contains 10 researched subjects. Five are selected each day;
subjects repeat. It does not automatically research or generate new facts.
Source links and measurement notes appear after each choice and on the results
screen. Example cobra values from the conversation were not used as real facts.
Image credits appear under each subject. Gold uses an element illustration.
Book page count specifies an edition and ISBN. Approximate and upper-bound
animal values are labeled explicitly. Different units are compared as written.

Edit public/questions.js to add questions, preserving the format and source
links. To change the bank or ordering, create a new bank version and update
VERSION and the stable shuffle seed in public/game.js; deploy changes between
daily games to avoid altering an in-progress day's questions.

HOSTING
Deploy the public directory to any static website host. No backend is required.
The standalone Go-Figure.html file embeds all scripts, styles, and images and can
be opened directly. Its font falls back to installed system fonts offline.
Source links need internet. Scores rely on the device clock and browser storage;
this is a casual Wordle-style game, not a trusted competition backend.
The intended Sites deployment was unavailable because Sites was not enabled
for the connected workspace. No production site was published.
