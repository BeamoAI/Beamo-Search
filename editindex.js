window.onload = function() {
  const placeholders = ["Find out anything...", "What's on your mind?", "What do you want to know?", "Search anything...", "Sharing the world's knowledge."];
  const searchTerm = document.getElementById("search-term");
  const suggestionsList = document.getElementById("suggestions-list");
  const searchForm = document.getElementById("search-form");

  const randomIndex = Math.floor(Math.random() * placeholders.length);
  searchTerm.placeholder = placeholders[randomIndex];

  searchTerm.addEventListener('input', searchWithAutosuggest);

  searchTerm.addEventListener('keydown', function(event) {
    if ((event.keyCode === 13 || event.keyCode === 9) && suggestionsList.style.display !== 'none') {
      event.preventDefault();
      if (suggestionsList.firstChild) {
        suggestionsList.firstChild.click();
      }
    }
  });  
  
  suggestionsList.addEventListener('click', function (event) {
    if(event.target && event.target.nodeName == "LI") {
      const selectedSuggestion = event.target.textContent;
      searchTerm.value = searchTerm.value.startsWith('!') ? selectedSuggestion + " " : selectedSuggestion;
      suggestionsList.style.display = 'none';
      if(!searchTerm.value.startsWith('!')) {
        searchForm.submit();
      }
    }
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('#search-wrapper') === null) {
      suggestionsList.style.display = 'none';
    }
  });
};

async function getBingAutoSuggest(query) {
  const url = `api_request.php?apiType=autosuggest&searchTerm=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (response.status === 200) {
    const data = await response.json();
    return data.suggestionGroups[0].searchSuggestions;
  } else {
    return [];
  }
}

async function fetchSuggestions(query) {
  let suggestions = await getBingAutoSuggest(query);
  displaySuggestions(suggestions);
}

function displaySuggestions(suggestions) {
  const suggestionsList = document.getElementById('suggestions-list');
  let html = '';
  if (suggestions.length > 0) {
    suggestions.forEach(function (suggestion) {
      html += '<li>' + suggestion.displayText + '</li>';
    });
    suggestionsList.innerHTML = html;
    suggestionsList.style.display = 'block';
  } else {
    suggestionsList.style.display = 'none';
  }
}

function searchWithAutosuggest(event) {
  const searchTerm = event.target;
  const value = searchTerm.value.trim();

  if (value.startsWith('!')) {
    provideEngineSuggestions(value, searchTerm);
    return;
  }

  if (value.length > 2) {
    fetchSuggestions(value);
  } else {
    displaySuggestions([]);
  }
}

const searchEngines = {
  amazon: 'https://www.amazon.com/s?field-keywords=',
  google: 'https://www.google.com/search?q=',
  zillow: 'https://www.zillow.com/homes/',
  stackoverflow: 'https://stackoverflow.com/search?q=',
  imdb: 'https://www.imdb.com/find/?s=all&q=',
  microsoft: 'https://www.microsoft.com/en-us/search/result.aspx?q=',
  wikipedia: 'https://en.wikipedia.org/w/index.php?title=Special:Search&search=',
  wowhead: 'https://www.wowhead.com/search?q=',
  wikihow: 'https://www.wikihow.com/wikiHowTo?search=',
  bbb: 'https://www.bbb.org/search?find_country=USA&find_text=',
  huffpost: 'https://www.huffpost.com/search/?keywords=',
  roblox: 'https://www.roblox.com/search/?keyword=',
  apartments: 'https://www.apartments.com/search/?',
  chase: 'https://www.chase.com/digital/resources/search-results.html?q=',
  steamcommunity: 'https://steamcommunity.com/search/users/#text=',
  yellowpages: 'https://www.yellowpages.com/search?search_terms=',
  investopedia: 'https://www.investopedia.com/search/?q=',
  techradar: 'https://www.techradar.com/search?searchTerm=',
  xfinity: 'https://www.xfinity.com/search?q=',
  accuweather: 'https://www.accuweather.com/search-locations?query=',
  macys: 'https://www.macys.com/shop/featured/',
  wayfair: 'https://www.wayfair.com/keyword.php?keyword=',
  cbssports: 'https://www.cbssports.com/search/?query=',
  hulu: 'https://www.hulu.com/search?q=',
  foodnetwork: 'https://www.foodnetwork.com/search/',
  paypal: 'https://www.paypal.com/us/smarthelp/search?q=',
  wiktionary: 'https://en.wiktionary.org/wiki/Special:Search?search=',
  retailmenot: 'https://www.retailmenot.com/s/',
  office: 'https://office.com/search/results.aspx?omkt=en-US&q=',
  usps: 'https://www.usps.com/search/?q=',
  washingtonpost: 'https://www.washingtonpost.com/newssearch/?query=',
  steampowered: 'https://store.steampowered.com/search/?term=',
  lowes: 'https://www.lowes.com/search?searchTerm=',
  irs: 'https://www.irs.gov/search/all?keywords=',
  yahoofinance: 'https://finance.yahoo.com/quote/',
  forbes: 'https://www.forbes.com/search/?q=',
  spotify: 'https://open.spotify.com/search/',
  allrecepies: 'https://www.allrecipes.com/search?q=',
  genius: 'https://genius.com/search?q=',
  foxnews: 'https://www.foxnews.com/search-results/search?q=',
  usnews: 'https://www.usnews.com/search?q=',
  urbandictionary: 'https://www.urbandictionary.com/define.php?term=',
  medicalnewstoday: 'https://www.medicalnewstoday.com/search?q=',
  usatoday: 'https://www.usatoday.com/search/?q=',
  msn: 'https://www.msn.com/en-us/search?q=',
  yahoo: 'https://www.yahoo.com/search/?p=',
  mayoclinic: 'https://www.mayoclinic.org/search/search-results?q=',
  dictionary: 'https://www.dictionary.com/browse/',
  businessinsider: 'https://www.businessinsider.com/s?q=',
  britannica: 'https://www.britannica.com/search?query=',
  mapquest: 'https://www.mapquest.com/search/results?query=',
  weather: 'https://weather.com/search/enhancedlocalsearch?where=',
  netflix: 'https://www.netflix.com/search?q=',
  rottentomatoes: 'https://www.rottentomatoes.com/search?search=',
  quora: 'https://www.quora.com/search?q=',
  homedepot: 'https://www.homedepot.com/s/',
  target: 'https://www.target.com/s?searchTerm=',
  gamepedia: 'https://www.fandom.com/?s=',
  merriamwebster: 'https://www.merriam-webster.com/dictionary/',
  cnn: 'https://www.cnn.com/search/?size=10&q=',
  newyorktimes: 'https://www.nytimes.com/search?query=',
  webmd: 'https://www.webmd.com/search/search_results/default.aspx?query=',
  espn: 'https://www.espn.com/search/_/q/',
  indeed: 'https://www.indeed.com/jobs?q=',
  etsy: 'https://www.etsy.com/search?q=',
  healthline: 'https://www.healthline.com/search?q=',
  googleplay: 'https://play.google.com/store/search?q=',
  linkedin: 'https://www.linkedin.com/search/results/all/?keywords=',
  ebay: 'https://www.ebay.com/sch/i.html?_nkw=',
  walmart: 'https://www.walmart.com/search/?query=',
  instagram: 'https://www.instagram.com/explore/tags/',
  tripadvisor: 'https://www.tripadvisor.com/Search?q=',
  pinterest: 'https://www.pinterest.com/search/pins/?q=',
  fandom: 'https://www.fandom.com/?s=',
  reddit: 'https://www.reddit.com/search/?q=',
  yelp: 'https://www.yelp.com/search?find_desc=',
  twitter: 'https://twitter.com/search?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  depositphotos: 'https://depositphotos.com/stock-photos/',
  makeuseof: 'https://www.makeuseof.com/search/',
  biblegateway: 'https://www.biblegateway.com/quicksearch/?quicksearch=',
  cbsnews: 'https://www.cbsnews.com/search/?q=',
  thehindu: 'https://www.thehindu.com/search/?q=',
  xdadevelopers: 'https://www.xda-developers.com/search/?q=',
  myntra: 'https://www.myntra.com/',
  marketwatch: 'https://www.marketwatch.com/search?q=',
  curseforge: 'https://www.curseforge.com/search?search=',
  spectrum: 'https://www.spectrum.net/search-results?k=',
  dw: 'https://www.dw.com/search/?searchNavigationId=9097&languageCode=en&origin=gN&item=',
  pcgamer: 'https://www.pcgamer.com/search/?searchTerm=',
  epicgames: 'https://store.epicgames.com/browse?q=',
  audible: 'https://www.audible.com/search?keywords='
};

function provideEngineSuggestions(searchValue, searchTerm) {
  const lowerCaseValue = searchValue.toLowerCase();
  const suggestions = [];

  for (const key in searchEngines) {
    if (key.startsWith(lowerCaseValue.substring(1))) {
      suggestions.push({
        displayText: `!${key}`,
        url: searchEngines[key] + searchTerm.value.substring(lowerCaseValue.indexOf(' ')+1)
      });
    }
  }

  suggestions.sort((a, b) => a.displayText.localeCompare(b.displayText));
  displaySuggestions(suggestions.slice(0, 10));
}