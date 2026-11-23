GO FIGURE — THE DAILY STATS GUESSING GAME

Run locally:
  npm start
Then open http://localhost:3000
Requires Python 3 for the development server; no dependency installation needed.

Run rules and timezone tests:
  npm ci
  npm test
Requires Node.js 18 or later.

Build the website for publication:
  npm run build
The dist folder contains the complete site. JavaScript and CSS use content-based
file names, so a game update cannot reuse an older cached script or stylesheet.

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
From the reissued November 22, 2026 Pacific game, every question's largest numeric
value is at most five times its smallest. Standard units and rounded conversions
are shown in the choices and explained in the source notes. Deployment checks
reject new question sets that exceed this spread.
Source links and measurement notes appear after each choice and on the results
screen. Example cobra values from the conversation were not used as real facts.
Image credits appear under each subject. Gold uses an element illustration.
Book page count specifies an edition and ISBN. Approximate and upper-bound
animal values are labeled explicitly. Different units are compared as written.

Edit public/questions.js to add future question sets, preserving the format,
five-to-one limit, and source links. public/questions-legacy.js preserves the
original bank. bankFor(date) selects a bank by Pacific date, so saved answers for
earlier games keep their original meaning. Stage future content changes behind
new effective dates or bank versions; do not edit a bank already in use for a
day. November 22 was explicitly reissued with a new attempt key so players can
replay the closer questions immediately. That day's earlier attempts remain in
browser storage but are excluded from active completion counts and streaks.
Other days' storage keys and the stable shuffle seed remain unchanged. The
current replay revision also starts fresh for players who finished the first
balanced release; both earlier attempts remain archived in browser storage.

HOSTING
GitHub Pages builds and publishes dist using .github/workflows/deploy-pages.yml.
Every push to main runs the game-rule and timezone checks, then publishes the
website. A failed check prevents that version from being published. The workflow
can also be started manually from the repository's Actions tab.
GitHub Pages must use GitHub Actions as its publishing source in Settings > Pages.
No backend is required. The built dist folder also works with other static hosts.
The standalone Go-Figure.html file embeds all scripts, styles, and images and can
be opened directly. Its font falls back to installed system fonts offline.
Source links need internet. Scores rely on the device clock and browser storage;
this is a casual Wordle-style game, not a trusted competition backend.
