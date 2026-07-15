/**
 * Freely-licensed construction photography used to dress up the marketing
 * pages until Fwangsat's own project photography library is wired in here
 * instead. All sourced from Wikimedia Commons via the stable Special:FilePath
 * endpoint (redirects to the current file regardless of upload path), and
 * released under Creative Commons / public domain terms that permit reuse.
 *
 * Swap any of these for real Fwangsat site photos whenever available —
 * just replace the URL string, the rest of the page keeps working.
 */
export const STOCK_IMAGES = {
  highRiseConstruction:
    "https://commons.wikimedia.org/wiki/Special:FilePath/One_World_Trade_Center,_Manhattan,_New_York_(7237112760).jpg?width=1600",
  bridgeConstruction:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Guy_West_Bridge_Construction,_Jedediah_Smith_Memorial_Loop_2014_(15554457126).jpg?width=1600",
  roadConstruction:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Roadtec_RP-190_Highway_Class_Asphalt_Pavel.jpg?width=1600",
  cranesSkyline:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Skyscraper_in_New_York_(7433994418).jpg?width=1600",
} as const;

/**
 * Real Swan Natural Spring Water brand assets, supplied directly by
 * Fwangsat Ventures (a registered distributor) and hosted locally in
 * /public. Includes the official Swan logo and real product photography.
 */
export const SWAN_BRAND = {
  logo: "/swan-logo.jpg",
  bottleLineup: "/swan-bottle-lineup.jpg",
  pourShot: "/swan-pour.jpg",
} as const;
