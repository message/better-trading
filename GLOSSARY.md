# Better Trading

A browser extension for the Path of Exile trade site (PoE 1 and PoE 2) that adds saved searches, history,
pinned items and result-list enhancements on top of the site.

## Language

**Game Version**:
Which Path of Exile the trade site is showing: PoE 1 (`'1'`) or PoE 2 (`'2'`).

**Folder**:
A named, optionally iconed group of Trades belonging to one Game Version. Can be archived.

**Trade**:
A saved search on the trade site, kept in a Folder with a title and a completed/not-completed flag.

**Bookmarks**:
The feature (and page) where Folders and Trades are managed.

**Search Location**:
Where a Trade lives on the site: Game Version, search type (`search` or `exchange`) and the site's search id (slug). Combined with the current league it forms the Trade's URL. The league is never stored.

**Search Query**:
The search itself as the site understands it: the `query` and `sort` JSON the site accepts in `?q=`. Unlike a slug it is stable across site URL changes.

**Legacy Trade**:
A Trade saved before Search Queries were stored; it has a Search Location only.

**Export String**:
A versioned, shareable text form of one Folder and its Trades. The version prefix (`2:`, `3:`, ...) says which format it uses.

**Backup**:
A text dump of all Folders and Trades, used to restore the Bookmarks data in full.

**Trade History**:
The list of recent searches the user ran on the trade site, recorded automatically.

**Pinned Item**:
An item from the trade results that the user pinned to keep it in view across searches.

**Item Enhancer**:
A toggleable tweak applied to rows of the trade results (pinning, equivalent pricings, regrouping similar items, highlighting stat filters, maximum sockets).
