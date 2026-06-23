(function(){ // MODULE-IIFE: isolate top-level declarations across <script> tags
// Curated charge library manifest. SVG sources live in src/charges/<name>.svg.
// Vendored from Armoria (https://github.com/Azgaar/Armoria): simple charges CC0,
// complex WappenWiki charges CC BY-NC(-SA) 3.0 — non-commercial use, see NOTICE.
// bbox = measured drawn extent of the artwork (in the 50..250 charge space).
const charges = {
  "lionRampant": {
    "label": "Lion Rampant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 63.6,
      "y": 58.8,
      "w": 72.8,
      "h": 91.2
    }
  },
  "lionPassant": {
    "label": "Lion Passant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 56.4,
      "y": 77.2,
      "w": 85.6,
      "h": 42.4
    }
  },
  "lionPassantGuardant": {
    "label": "Lion Passant Guardant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/5/59/Aquitaine.svg",
    "bbox": {
      "x": 54.8,
      "y": 68.4,
      "w": 90.4,
      "h": 63.2
    }
  },
  "lionSejant": {
    "label": "Lion Sejant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/f/f9/Langres_Livro.svg",
    "bbox": {
      "x": 59.6,
      "y": 74,
      "w": 80.8,
      "h": 52
    }
  },
  "lionHeadCaboshed": {
    "label": "Lion Head Caboshed",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/0/0d/Leijonansikte.svg",
    "bbox": {
      "x": 66,
      "y": 59.6,
      "w": 68,
      "h": 80.8
    }
  },
  "eagle": {
    "label": "Eagle",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 62,
      "y": 59.6,
      "w": 76,
      "h": 89.6
    }
  },
  "eagleTwoHeads": {
    "label": "Eagle Two Heads",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 61.2,
      "y": 59.6,
      "w": 77.6,
      "h": 90.4
    }
  },
  "bearRampant": {
    "label": "Bear Rampant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/2/2d/Smolensk_Bergshammar.svg",
    "bbox": {
      "x": 73.2,
      "y": 59.6,
      "w": 46.4,
      "h": 81.6
    }
  },
  "boarRampant": {
    "label": "Boar Rampant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 59.6,
      "y": 61.2,
      "w": 80.8,
      "h": 79.2
    }
  },
  "wolfRampant": {
    "label": "Wolf Rampant",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/0/05/Passau.svg",
    "bbox": {
      "x": 66.8,
      "y": 58,
      "w": 60.8,
      "h": 86.4
    }
  },
  "crossPotent": {
    "label": "Cross Potent",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossJerusalem": {
    "label": "Cross Jerusalem",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossPattee": {
    "label": "Cross Pattee",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 61.2,
      "y": 61.2,
      "w": 77.6,
      "h": 77.6
    }
  },
  "crossFleury": {
    "label": "Cross Fleury",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossMoline": {
    "label": "Cross Moline",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossFormee": {
    "label": "Cross Formee",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossBottony": {
    "label": "Cross Bottony",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crossMaltese": {
    "label": "Cross Maltese",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 58.8,
      "y": 58.8,
      "w": 82.4,
      "h": 82.4
    }
  },
  "crossSaltire": {
    "label": "Cross Saltire",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 65.2,
      "y": 65.2,
      "w": 69.6,
      "h": 69.6
    }
  },
  "crossCalvary": {
    "label": "Cross Calvary",
    "cat": "cross",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 64.4,
      "y": 54,
      "w": 71.2,
      "h": 96.8
    }
  },
  "fleurDeLis": {
    "label": "Fleur De lis",
    "cat": "nature",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 68.4,
      "y": 58.8,
      "w": 63.2,
      "h": 82.4
    }
  },
  "rose": {
    "label": "Rose",
    "cat": "nature",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 60.4,
      "y": 59.6,
      "w": 78.4,
      "h": 80
    }
  },
  "garb": {
    "label": "Garb",
    "cat": "nature",
    "viewBox": "50 50 400 400",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 57.2,
      "y": 55.6,
      "w": 35.2,
      "h": 38.4
    }
  },
  "castle": {
    "label": "Castle",
    "cat": "building",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/8/82/Alfonso_VIII_of_Castile.svg",
    "bbox": {
      "x": 66.8,
      "y": 59.6,
      "w": 66.4,
      "h": 80.8
    }
  },
  "tower": {
    "label": "Tower",
    "cat": "building",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/3/3c/Logudoro.svg",
    "bbox": {
      "x": 81.2,
      "y": 58.8,
      "w": 36.8,
      "h": 81.6
    }
  },
  "anchor": {
    "label": "Anchor",
    "cat": "object",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "",
    "source": "https://commons.wikimedia.org/wiki/File:Wappen_R%C3%BCdigheim_(Neuberg).svg",
    "bbox": {
      "x": 63.6,
      "y": 57.2,
      "w": 72.8,
      "h": 88.8
    }
  },
  "key": {
    "label": "Key",
    "cat": "object",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 84.4,
      "y": 59.6,
      "w": 30.4,
      "h": 80.8
    }
  },
  "sword": {
    "label": "Sword",
    "cat": "object",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 86.8,
      "y": 59.6,
      "w": 26.4,
      "h": 80.8
    }
  },
  "crown": {
    "label": "Crown",
    "cat": "object",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 59.6,
      "y": 66,
      "w": 80.8,
      "h": 68
    }
  },
  "mullet": {
    "label": "Mullet",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 60.4,
      "y": 58,
      "w": 79.2,
      "h": 76
    }
  },
  "mullet6": {
    "label": "Mullet6",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 63.6,
      "y": 58,
      "w": 72.8,
      "h": 84
    }
  },
  "estoile": {
    "label": "Estoile",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 64.4,
      "y": 59.6,
      "w": 71.2,
      "h": 80.8
    }
  },
  "sun": {
    "label": "Sun",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "sunInSplendour": {
    "label": "Sun In Splendour",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 59.6,
      "y": 59.6,
      "w": 80.8,
      "h": 80.8
    }
  },
  "crescent": {
    "label": "Crescent",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 63.6,
      "y": 64.4,
      "w": 72.8,
      "h": 69.6
    }
  },
  "moonInCrescent": {
    "label": "Moon In Crescent",
    "cat": "celestial",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org/images/4/46/Slatte.svg",
    "bbox": {
      "x": 71.6,
      "y": 59.6,
      "w": 57.6,
      "h": 80.8
    }
  },
  "annulet": {
    "label": "Annulet",
    "cat": "geometric",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 69.2,
      "y": 69.2,
      "w": 61.6,
      "h": 61.6
    }
  },
  "billet": {
    "label": "Billet",
    "cat": "geometric",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 78.8,
      "y": 64.4,
      "w": 42.4,
      "h": 71.2
    }
  },
  "escallop": {
    "label": "Escallop",
    "cat": "geometric",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 61.2,
      "y": 60.4,
      "w": 77.6,
      "h": 79.2
    }
  },
  "heart": {
    "label": "Heart",
    "cat": "geometric",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "Azgaar",
    "source": "",
    "bbox": {
      "x": 70,
      "y": 74.8,
      "w": 60,
      "h": 58.4
    }
  },
  "pomegranate": {
    "label": "Pomegranate",
    "cat": "nature",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "heraldric-coat-of-arms",
    "source": "",
    "bbox": {
      "x": 52.4,
      "y": 59.6,
      "w": 95.2,
      "h": 117.6
    }
  },
  "escarbuncle": {
    "label": "Escarbuncle (Navarre)",
    "cat": "geometric",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/publicdomain/zero/1.0",
    "author": "heraldric-coat-of-arms",
    "source": "",
    "bbox": {
      "x": 50,
      "y": 50,
      "w": 108,
      "h": 108
    }
  },
  "pike": {
    "label": "Pike (barbel)",
    "cat": "beast",
    "viewBox": "50 50 200 200",
    "license": "https://creativecommons.org/licenses/by-nc-sa/3.0",
    "author": "",
    "source": "http://wappenwiki.org",
    "bbox": {
      "x": 81.2,
      "y": 58,
      "w": 37.6,
      "h": 88
    }
  }
};

const categories = {"beast":"Beasts","cross":"Crosses","nature":"Nature","building":"Buildings","object":"Objects","celestial":"Celestial","geometric":"Geometric"};

const api = { charges, categories };
if (typeof module !== "undefined" && module.exports) module.exports = api;
if (typeof window !== "undefined") window.heraldryChargeManifest = api;
})();
