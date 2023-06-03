const urlParams = new URLSearchParams(window.location.search);
let searchTerm = urlParams.get('q');
if(searchTerm) {
  searchTerm = searchTerm.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
document.title = `${searchTerm} - Beamo`;
  
  const searchTermInput = document.getElementById('search-term');
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  
  function insertBefore(newNode, referenceNode) {
    if (referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode);
    } else {
      referenceNode.parentNode.appendChild(newNode);
    }
  }
  
  function insertAtTop(parentNode, newNode) {
    if (parentNode.childNodes.length > 0) {
      parentNode.insertBefore(newNode, parentNode.childNodes[0]);
    } else {
      parentNode.appendChild(newNode);
    }
  }
  
  function averageAbs(array) {
    return array.reduce((acc, val) => acc + Math.abs(val), 0) / array.length;
  }
  
  function averageAbs(array) {
    return array.reduce((acc, val) => acc + Math.abs(val), 0) / array.length;
  }
  
  function isValidJson(jsonString) {
    try {
      JSON.parse(jsonString);
    } catch (error) {
      return false;
    }
    return true;
  }
  
  function isValidJson(jsonString) {
    try {
      JSON.parse(jsonString);
    } catch (error) {
      return false;
    }
    return true;
  }
  
  function fetchDefinitions(searchTerm) {
    const cleanedSearchTerm = searchTerm.toLowerCase().replace('definition', '').replace('define', '').trim();
    const definitionContainer = document.getElementById('definition-container');
  
    definitionContainer.style.display = 'none';
  
    if (cleanedSearchTerm.split(' ').length <= 3) {
      const url = `api_request.php?apiType=merriamWebster&searchTerm=${encodeURIComponent(cleanedSearchTerm)}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const definitions = JSON.parse(data[0]);
  
          if (definitions && definitions[0] && typeof definitions[0] !== 'string') {
            definitionContainer.style.display = 'block';
            definitionContainer.innerHTML = '';
  
            definitions.slice(0, 3).forEach((entry) => {
              const definitionTitle = document.createElement('h3');
              definitionTitle.textContent = entry.hwi.hw;
              definitionContainer.appendChild(definitionTitle);
              definitionContainer.style.padding = '3.5vh';
              definitionContainer.style.borderRadius = '3.5vh';
              if (entry.shortdef && entry.shortdef.length > 0) {
                const definitionList = document.createElement('ul');
                entry.shortdef.forEach((definition) => {
                  const definitionItem = document.createElement('li');
                  definitionItem.textContent = definition;
                  definitionList.appendChild(definitionItem);
                });
                definitionContainer.appendChild(definitionList);
              }
            });
  
            const merriamWebsterAttribution = document.createElement('p');
            merriamWebsterAttribution.textContent = 'Results from Merriam-Webster';
            merriamWebsterAttribution.classList.add('mw-attribution');
            definitionContainer.appendChild(merriamWebsterAttribution);
          }
        })
        .catch((error) => console.error('Error fetching definition:', error));
    }
  }
  
    window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
  
    if (!searchTerm || searchTerm.trim() === '' || ' ') {
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
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  for (const prefix in searchEngines) {
    if (lowerCaseSearchTerm.startsWith(`!${prefix} `)) {
      const searchURL = searchEngines[prefix];
      const searchQuery = searchTerm.substring(prefix.length + 2);
      window.location.href = `${searchURL}${encodeURIComponent(searchQuery)}`;
      return;
    }
  }
  
  let apiCache = {};
  
  function fetchWikipediaSummary(searchTerm) {
    const apiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
  
    if (apiCache[searchTerm]) {
      displaySummary(apiCache[searchTerm]);
    } else {
      fetch(apiUrl + encodeURIComponent(searchTerm))
        .then(response => {
          if (!response.ok && response.status !== 404) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if(data.type === 'standard') {
            apiCache[searchTerm] = data;
            displaySummary(data);
          } else if(data.type === 'disambiguation') {
            console.log('The term is ambiguous. Please specify your search.');
          } else {
            console.log("No summary available for this term");
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }  
  
  function displaySummary(data) {
    if (!data || !data.extract) {
        console.error('Invalid data or extract is missing');
        return;
    }

    const containerEl = document.createElement('div');
    containerEl.id = 'wikipedia-container';
  
    const titleEl = document.createElement('h2');
    titleEl.id = 'title';
    titleEl.innerText = data.title;
  
    const contentEl = document.createElement('p');
    contentEl.id = 'content';
    const summary = data.extract.slice(0, 750) + '...';
    contentEl.innerText = summary;
  
    const linkEl = document.createElement('a');
    linkEl.id = 'link';
    linkEl.innerText = 'Wikipedia';
    linkEl.href = data.content_urls.desktop.page;
    linkEl.target = '_blank';
  
    contentEl.appendChild(document.createTextNode(' '));
    contentEl.appendChild(linkEl);
  
    if (data.thumbnail) {
      const imageContainer = document.createElement('div');
      imageContainer.id = 'image-container';
  
      const imageEl = document.createElement('img');
      imageEl.id = 'image';
      imageEl.src = data.thumbnail.source;
      imageEl.alt = data.title;
  
      imageContainer.appendChild(imageEl);
      containerEl.appendChild(imageContainer);
    }
  
    containerEl.appendChild(titleEl);
    containerEl.appendChild(contentEl);
  
    insertBefore(containerEl, document.getElementById('search-results'));
  
    const assistantResponseBox = document.getElementById('assistant-response-box');
    insertAfter(containerEl, assistantResponseBox);
  }
  
  fetchWikipediaSummary(searchTerm);
  
  const resultsTable = document.getElementById('search-results');
  
  async function send_prompt_to_server(prompt) {
    const data = {
      prompt: prompt
    };
  
    const response = await fetch("imageserver.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return await response.json();
  }
  
  let requestIsInProgress = false;
  
  async function main(searchedTerm) {
    if (requestIsInProgress) return;
    
    if (/^(create|make) (a picture|an? image|a photo) of /i.test(searchedTerm)) {
      searchedTerm = searchedTerm.replace(/^(create|make) (a picture|an? image|a photo) of /i, "");
      requestIsInProgress = true;
      const serverResponse = await send_prompt_to_server(searchedTerm);
      requestIsInProgress = false;
  
      if (serverResponse.status === "success") {
        const imageUrl = serverResponse.image_url;
        displayImage(imageUrl, searchedTerm);
      } else {
        alert('There was an error generating the image. Please try again later.');
      }
    } else {
      const response = await fetch();
      const data = await response.json();
      const searchResults = data.webPages ? data.webPages.value : [];
  
      if (searchResults.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = "No results found.";
        resultsTable.parentNode.insertBefore(noResults, resultsTable);
      } else {
        searchResults.forEach((result) => {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          const link = document.createElement("a");
          link.href = result.url;
          link.textContent = result.name;
          nameCell.appendChild(link);
          row.appendChild(nameCell);
          resultsTable.appendChild(row);
        });
      }
    }
  }
  
  function displayImage(imageUrl, searchedTerm) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Image of ${searchedTerm}`;
    img.style.width = '50%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';
    img.style.marginTop = '2.5vh';
    img.style.marginBottom = '1vh';
    img.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)';
    img.style.borderRadius = '4px';
    img.classList.add('fade-in-top');
    if (resultsTable.firstChild) {
      resultsTable.insertBefore(img, resultsTable.firstChild);
    } else {
      resultsTable.appendChild(img);
    }
  }
  
  main(searchTerm);
  
  let currentPage = 0;
  let requestInProgress = false;
  let isImageSearch = false;
  let isNewsSearch = false;
  let isVideoSearch = false;
  let isWeatherSearch = false;
  
  function showSkeletonLoader() {
    const skeletonLoader = document.createElement('div');
    skeletonLoader.id = 'skeletonLoader';
    skeletonLoader.classList.add('skeleton-loader');
    resultsTable.appendChild(skeletonLoader);
  }
  
  function hideSkeletonLoader() {
    const skeletonLoader = document.getElementById('skeletonLoader');
    if (skeletonLoader) {
      skeletonLoader.remove();
    }
  }
  
  let cache = JSON.parse(sessionStorage.getItem('apiData')) || {};
  
  function fetchResults(offset = 0, searchType = 'web') {
    function tryFetch(apiRequestUrl) {
      if (requestInProgress) {
        return;
      }
      requestInProgress = true;

      let cache = sessionStorage.getItem('apiData');
      if (cache) {
        cache = JSON.parse(cache);
      } else {
        cache = {};
      }

      if (cache[apiRequestUrl]) {
        console.log('Data loaded from cache');
        processResults(cache[apiRequestUrl]);
        requestInProgress = false;
      } else {
        fetch(apiRequestUrl)
          .then(response => {
            if (response.status === 404) {
              window.location.href = 'notfound.html';
            } else if (!response.ok) {
              throw new Error('API request failed');
            } else {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                return response.json();
              } else {
                throw new TypeError("Response from API was not JSON");
              }
            }
          })
          .then(data => {
            console.log('Data loaded from API');
            processResults(data);

            cache[apiRequestUrl] = data;
            sessionStorage.setItem('apiData', JSON.stringify(cache));
            requestInProgress = false;
          })
          .catch(error => {
            console.error('API request failed:', error);
            requestInProgress = false;
          });
      }
    }

    function safeEval(expression) {
      const isSafe = /^[\d\s+\-*/()]+$/.test(expression);
      if (!isSafe) throw new Error('Invalid expression');
      let balance = 0;
      for (const char of expression) {
          if (char === '(') balance++;
          if (char === ')') balance--;
          if (balance < 0) throw new Error('Invalid expression');
      }
      if (balance !== 0) throw new Error('Invalid expression');
      return eval(expression);
  }
  
  function generateCalculator() {
      const calculatorContainer = document.getElementById('calculator-container');
      calculatorContainer.innerHTML = '';
      const display = document.createElement('div');
      display.id = 'calculator-display';
      calculatorContainer.appendChild(display);
  
      const buttons = [
          ['7', '8', '9', '/'],
          ['4', '5', '6', '*'],
          ['1', '2', '3', '-'],
          ['0', '.', '=', '+'],
          ['(', ')', 'C', 'AC']
      ];
  
      let isRad = true;
      const radDegSwitch = document.createElement('button');
      radDegSwitch.textContent = 'Rad';
      radDegSwitch.addEventListener('click', function() {
          isRad = !isRad;
          radDegSwitch.textContent = isRad ? 'Rad' : 'Deg';
      });
      calculatorContainer.appendChild(radDegSwitch);
  
      const buttonElements = [];
      buttons.forEach((buttonRow, rowIndex) => {
          buttonRow.forEach((buttonValue, colIndex) => {
              const button = document.createElement('button');
              button.textContent = buttonValue;
              button.addEventListener('mousedown', function() {
                  this.classList.add('active');
              });
              button.addEventListener('mouseup', function() {
                  this.classList.remove('active');
              });
              button.addEventListener('click', function() {
                  if (buttonValue === '=') {
                      try {
                          display.textContent = safeEval(display.textContent);
                      } catch {
                          display.textContent = "Error";
                      }
                  } else if (buttonValue === 'AC') {
                      display.textContent = '';
                  } else if (buttonValue === 'C') {
                      display.textContent = display.textContent.slice(0, -1);
                  } else {
                      display.textContent += buttonValue;
                  }
              });
              calculatorContainer.appendChild(button);
              buttonElements[rowIndex * 4 + colIndex] = button;
          });
      });
  
      window.addEventListener('keydown', function(e) {
          const key = e.key;
          const keyMap = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', '(', ')', 'Backspace', 'Delete', 'Enter'];
          const buttonIndex = keyMap.indexOf(key);
          if (buttonIndex !== -1) {
              buttonElements[buttonIndex].classList.add('active');
              setTimeout(() => buttonElements[buttonIndex].classList.remove('active'), 100);
              if (key === 'Backspace') {
                  display.textContent = display.textContent.slice(0, -1);
              } else if (key === 'Delete') {
                  display.textContent = '';
              } else if (key === 'Enter') {
                  try {
                      display.textContent = safeEval(display.textContent);
                  } catch {
                      display.textContent = "Error";
                  }
              } else {
                  display.textContent += key;
              }
          }
      });
  }
  
  async function search() {
    showSkeletonLoader();
    let apiRequestUrl = `api_request.php?searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}&searchType=${searchType}`;
    tryFetch(apiRequestUrl);
    let searchTermWithoutSpaces = searchTerm.replace(/\s+/g, '');

    let calculatorContainer = document.getElementById('calculator-container');

    if (searchTermWithoutSpaces === 'calculator' || isValidMathExpression(searchTermWithoutSpaces)) {
        calculatorContainer.style.display = 'grid';
        generateCalculator();

        if (isValidMathExpression(searchTermWithoutSpaces)) {
            let calculatorDisplay = document.getElementById('calculator-display');
            try {
                calculatorDisplay.textContent = eval(searchTermWithoutSpaces);
            } catch (error) {
                calculatorDisplay.textContent = 'Error';
            }
        }
    } else {
        calculatorContainer.style.display = 'none';
    }
}

function isValidMathExpression(expression) {
    let isValid = /^[\d+\-*/\(\)\.]+$/.test(expression);
    if (isValid) {
        try {
            eval(expression);
        } catch {
            isValid = false;
        }
    }
    return isValid;
}
  
    function displayRelatedSearches(relatedSearches) {
      const relatedSearchesContainer = document.getElementById('related-searches-container');
      relatedSearchesContainer.innerHTML = '';
  
      if (relatedSearches) {
          for (let i = 0; i < relatedSearches.length; i++) {
              let relatedSearch = relatedSearches[i];
              let button = document.createElement('button');
              button.textContent = relatedSearch.displayText;
              button.onclick = function() {
                  const searchTerm = relatedSearch.displayText;
                  const offset = 0;
                  const url = `results.html?q=${encodeURIComponent(searchTerm)}&offset=${offset}`;
                  window.location.href = url;
              };
              relatedSearchesContainer.appendChild(button);
          }
      }
  }
  
  function processResults(data) {
    console.log(data);
    resultsTable.innerHTML = '';
    hideSkeletonLoader();
    const content = document.getElementById('content');
    const definitionContainer = document.getElementById('definition-container');
    const assistantResponseBox = document.getElementById('assistant-response-box');
    const WikipediaContainer = document.getElementById('wikipedia-container');
    const timezoneContainer = document.getElementById('timezone-container');

    if (data.relatedSearches) {
        displayRelatedSearches(data.relatedSearches.value);
    }

    if (data.timeZone) {
        timezoneContainer.style.display = 'block';
        timezoneContainer.innerHTML = '';
        const divRow = document.createElement('div');
        const timeZone = document.createElement('div');
  
        let descriptionText;
        let formattedTime;
        if (data.timeZone.primaryCityTime) {
            const date = new Date(data.timeZone.primaryCityTime.time);
            let hours = date.getUTCHours();
            const minutes = ("0" + date.getUTCMinutes()).substr(-2);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            formattedTime = hours + ':' + minutes + ' ' + ampm;
            descriptionText = `The time in ${data.timeZone.primaryCityTime.location} right now is `;
        } else if (data.timeZone.primaryResponse) {
            descriptionText = data.timeZone.description;
            if (!descriptionText.includes(data.timeZone.primaryResponse)) {
                formattedTime = data.timeZone.primaryResponse;
            }
        }
  
        const textPart1 = document.createElement('span');
        textPart1.textContent = descriptionText;
        textPart1.style.fontSize = '1.5em';
  
        const textPart2 = document.createElement('strong');
        if (formattedTime) {
            textPart2.textContent = `${formattedTime}.`;
        }
        textPart2.style.fontSize = '2em';
  
        timeZone.appendChild(textPart1);
        if (formattedTime) {
            timeZone.appendChild(textPart2);
        }
  
        divRow.appendChild(timeZone);
        timezoneContainer.appendChild(divRow);
        assistantResponseBox.style.display = 'none';
    }
  
  function displayWeatherData(data) {
      const weatherContainer = document.getElementById('weather-container');
      let isImperial = (data.location.country === 'United States of America' || data.location.country === 'Myanmar' || data.location.country === 'Liberia');
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (data && data.current) {
          weatherContainer.classList.remove('hidden');
          while (weatherContainer.firstChild) {
              weatherContainer.firstChild.remove();
          }
  
          const currentWeatherDiv = document.createElement('div');
          currentWeatherDiv.className = 'current-weather';
          weatherContainer.appendChild(currentWeatherDiv);
  
          const weatherIcon = document.createElement('img');
          weatherIcon.className = 'weather-icon';
          weatherIcon.src = data.current.condition.icon;
          currentWeatherDiv.appendChild(weatherIcon);
  
          const temperatureDiv = document.createElement('div');
          temperatureDiv.className = 'temperature';
          currentWeatherDiv.appendChild(temperatureDiv);
  
          const feelsLikeDiv = document.createElement('div');
          feelsLikeDiv.className = 'feels-like';
          currentWeatherDiv.appendChild(feelsLikeDiv);
  
          updateTemperatures(isImperial, data, temperatureDiv, feelsLikeDiv);
      }
  
      if (data && data.forecast) {
          const nav = document.createElement('nav');
          weatherContainer.appendChild(nav);
  
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
          data.forecast.forecastday.forEach((forecastDay, i) => {
              const forecastDate = new Date(forecastDay.date);
              forecastDate.setHours(0, 0, 0, 0);
  
              const forecastButton = document.createElement('button');
              forecastButton.className = 'nav-button';
  
              const dayOfWeek = daysOfWeek[forecastDate.getDay()];
  
              const tempUnit = isImperial ? '°F' : '°C';
              const highTemp = isImperial ? forecastDay.day.maxtemp_f : forecastDay.day.maxtemp_c;
              const lowTemp = isImperial ? forecastDay.day.mintemp_f : forecastDay.day.mintemp_c;
  
              const forecastIcon = document.createElement('img');
              forecastIcon.src = forecastDay.day.condition.icon;
              forecastIcon.className = 'forecast-icon';
              forecastButton.appendChild(forecastIcon);
  
              const forecastTempText = document.createElement('span');
              forecastTempText.innerHTML = `${highTemp}${tempUnit} | ${lowTemp}${tempUnit}`;
              forecastButton.appendChild(forecastTempText);
  
              const forecastDayText = document.createElement('h3');
              forecastDayText.textContent = dayOfWeek;
              forecastButton.appendChild(forecastDayText);
  
              forecastButton.setAttribute('data-target', `day${i + 1}`);
              nav.appendChild(forecastButton);
  
              const forecastSection = document.createElement('section');
              forecastSection.id = `day${i + 1}`;
              forecastSection.className = 'weather-section hidden';
              weatherContainer.appendChild(forecastSection);
  
              let forecastCount = 0;
              forecastDay.hour.forEach((hour) => {
                  const forecastHour = new Date(hour.time);
                  if (forecastDate.getTime() === today.getTime() && forecastHour >= new Date() && forecastHour.getHours() % 3 === 0 && forecastCount < 7) {
                      displayForecast(isImperial, hour, forecastSection);
                      forecastCount++;
                  } else if (forecastDate.getTime() !== today.getTime() && forecastHour.getHours() % 3 === 0 && forecastCount < 7) {
                      displayForecast(isImperial, hour, forecastSection);
                      forecastCount++;
                  }
              });
          });
  
          Array.from(document.querySelectorAll('.nav-button')).forEach(button => {
              button.addEventListener('click', () => {
                  Array.from(document.querySelectorAll('.weather-section')).forEach(section => section.classList.add('hidden'));
                  document.getElementById(button.getAttribute('data-target')).classList.remove('hidden');
              });
          });
  
          if (nav.firstElementChild) {
              nav.firstElementChild.click();
          }
      }
  }
  
  function displayForecast(isImperial, hour, forecastSection) {
      const hourDiv = document.createElement('div');
      hourDiv.className = 'hour-weather';
  
      const hourTime = document.createElement('div');
      let forecastHour = new Date(hour.time).getHours();
      let period = forecastHour >= 12 ? 'PM' : 'AM';
      let displayHour = forecastHour % 12 || 12;
      hourTime.textContent = `${displayHour} ${period}`;
      hourDiv.appendChild(hourTime);
      hourDiv.appendChild(document.createElement('br'));
  
      const hourIcon = document.createElement('img');
      hourIcon.src = hour.condition.icon;
      hourIcon.className = 'hourly-forecast-icon';
      hourDiv.appendChild(hourIcon);
      hourDiv.appendChild(document.createElement('br'));
  
      const hourTemp = document.createElement('div');
      hourTemp.textContent = isImperial ? `${hour.temp_f}°F` : `${hour.temp_c}°C`;
      hourDiv.appendChild(hourTemp);
      hourDiv.appendChild(document.createElement('br'));
  
      if (hour.chance_of_rain >= 10) {
          const hourPrecipitation = document.createElement('div');
          hourPrecipitation.textContent = `${hour.chance_of_rain}% 💧`;
          hourDiv.appendChild(hourPrecipitation);
          hourDiv.appendChild(document.createElement('br'));
      }
  
      forecastSection.appendChild(hourDiv);
  }
  
  function updateTemperatures(isImperial, data, temperatureDiv) {
      const unit = isImperial ? '°F' : '°C';
      const temp = isImperial ? data.current.temp_f : data.current.temp_c;
  
      temperatureDiv.textContent = `${temp}${unit}`;
  }
  
  function fetchWeatherData(position, retryCount = 0) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiType = 'forecast';

    fetch(`api_request.php?apiType=${apiType}&lat=${lat}&lon=${lon}&days=7`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.current && data.forecast) {
                displayWeatherData(data);
            } else {
                throw new Error("Incomplete data");
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            if (retryCount < 10) {
                setTimeout(() => {
                    console.log("Retrying fetch...", retryCount);
                    fetchWeatherData(position, retryCount + 1);
                }, 1000 * retryCount);
            } else {
                console.error('Failed to load data after 10 attempts');
            }
        });
}

const weatherContainer = document.getElementById('weather-container');

const weatherRegex = /(what('?s| is) the weather|weather forecast|current weather|today('?s| is) weather)/i;

if (weatherRegex.test(searchTerm) || searchTerm.trim().toLowerCase() === "weather") {
    weatherContainer.classList.remove('hidden');
    
    navigator.permissions.query({name:'geolocation'})
        .then(function(permissionStatus) {
            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                navigator.geolocation.getCurrentPosition(fetchWeatherData);
                weatherContainer.style.display = 'flex';
            } else {
                console.error('Location permission denied');
                weatherContainer.style.display = 'none';
            }
        });
} 
    if (data.webPages && data.webPages.value && data.webPages.value.length > 0) {
      const searchResults = document.getElementById('search-results');
      const pagination = document.getElementById('pagination');
      const content = document.getElementById('content');
      const relatedSearchesContainer = document.getElementById('related-searches-container');
      const newsGrid = document.getElementById('newsGrid');
      const videoGrid = document.getElementById('videoGrid');
      const timezoneContainer = document.getElementById('timezone-container');
      const imageGrid = document.getElementById('imageGrid');
  
      if (videoGrid) {
        videoGrid.remove();
      }
      if (timezoneContainer) {
        timezoneContainer.style.display = 'none';
      }
      if (content) {
        content.style.display = 'block';
      }
      if (relatedSearchesContainer) {
        relatedSearchesContainer.style.display = 'block';
      }
      if (searchResults) {
        searchResults.style.visibility = 'visible';
      }
      if (pagination) {
        pagination.style.visibility = 'visible';
      }
      if (newsGrid) {
        newsGrid.remove();
      }
      if (imageGrid) {
        imageGrid.remove();
      }
    const maxConcurrentRequests = 5;
    const requestQueue = data.webPages.value.slice();
    const processQueue = async () => {
      if (requestQueue.length === 0) return;
      const currentBatch = requestQueue.splice(0, maxConcurrentRequests);
      const promises = currentBatch.map(result => processResult(result));
      await Promise.all(promises);
      processQueue();
    };
    const processResult = async (result) => {
      const divRow = document.createElement('div');
      const title = document.createElement('h3');
      const link = document.createElement('a');
      const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(result.url).hostname}`;
      const favicon = document.createElement('img');
      const description = document.createElement('div');
      divRow.appendChild(favicon);
      divRow.appendChild(link);
      divRow.appendChild(title);
      resultsTable.appendChild(divRow);
      divRow.appendChild(description);
      title.style.cursor = 'pointer';
      divRow.id = 'divRow';
      divRow.classList.add('indent');
      link.textContent = result.url.length > 50 ? result.url.slice(0, 30) + "..." : result.url;
      link.style.display = 'inline-block';
      link.style.verticalAlign = 'middle';
      favicon.src = faviconUrl;
      favicon.width = 24;
      favicon.height = 24;
      favicon.style.marginRight = '1vh';
      favicon.style.display = 'inline-block';
      favicon.style.verticalAlign = 'middle';
      title.textContent = result.name.length > 70 ? result.name.slice(0, 50) + "..." : result.name;
      divRow.style.padding = '1vh';
      title.onclick = function () {
        window.location.href = result.url;
      };
      title.style.fontSize = '4';
      title.id = 'title';
      description.textContent = result.snippet.substr(0, 200) + '...';
      createPaginationButtons(data.webPages.totalEstimatedMatches);
    };
    processQueue();
    let offset = 0;
    } else if (isNewsSearch) {
        const pagination = document.getElementById('pagination');
        const relatedSearchesContainer = document.getElementById('related-searches-container');
        if (pagination) {
          pagination.style.visibility = 'hidden';
        }
        if (relatedSearchesContainer) {
          relatedSearchesContainer.style.display = 'none';
        }
        const content = document.getElementById('content');
        if (content) {
          content.style.display = 'none';
        }
        const definitionContainer = document.getElementById('definition-container');
        if (definitionContainer) {
          definitionContainer.style.display = 'none';
        }
        const assistantResponseBox = document.getElementById('assistant-response-box');
        if (assistantResponseBox) {
          assistantResponseBox.style.display = 'none';
        }
        const WikipediaContainer = document.getElementById('WikipediaContainer');
        if (WikipediaContainer) {
          WikipediaContainer.style.display = 'none';
        }
        const timezoneContainer = document.getElementById('timezone-container');
        if (timezoneContainer) {
          timezoneContainer.style.display = 'none';
        }
        let newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) {
          newsGrid = document.createElement('div');
          newsGrid.id = 'newsGrid';
          newsGrid.classList.add('news-grid');
          newsGrid.style.gridGap = '0.25%';
          document.body.appendChild(newsGrid);
        }
        data.value.forEach((newsItem) => {
          const newsLink = document.createElement('a');
          const newsContainer = document.createElement('div');
          const newsContent = document.createElement('div');
          const newsProvider = document.createElement('p');
          const newsProviderIcon = document.createElement('img');
          const newsTitle = document.createElement('h4');
          const newsDescription = document.createElement('p');
          const newsPublishedDate = document.createElement('p');
          const newsThumbnail = document.createElement('img');
    
          newsLink.href = newsItem.url;
          newsContainer.classList.add('news-container');
          newsContent.classList.add('news-content');
    
          newsProviderIcon.src = `https://www.google.com/s2/favicons?domain=${new URL(newsItem.url).hostname}`;
          newsProviderIcon.style.display = 'inline-block';
          newsProviderIcon.style.marginRight = '0.5vw';
          
          newsProvider.textContent = newsItem.provider[0].name;
          newsProvider.style.display = 'inline-block';
          
          newsProvider.prepend(newsProviderIcon);
          
          newsTitle.textContent = newsItem.name;
          newsDescription.textContent = newsItem.description;
          newsPublishedDate.textContent = new Date(newsItem.datePublished).toLocaleDateString();
    
          if(newsItem.image) {
            newsThumbnail.src = newsItem.image.thumbnail.contentUrl;
            newsThumbnail.classList.add('news-thumbnail');
          }
    
          newsContent.appendChild(newsProvider);
          newsContent.appendChild(newsTitle);
          newsContent.appendChild(newsDescription);
          newsContent.appendChild(newsPublishedDate);
    
          newsContainer.appendChild(newsContent);
          if(newsItem.image) {
            newsContainer.appendChild(newsThumbnail);
          }
          
          newsLink.appendChild(newsContainer);
          newsGrid.appendChild(newsLink);
        });
        const firstNewNews = newsGrid.querySelectorAll('.news-container')[offset];
        if (firstNewNews) {
          firstNewNews.scrollIntoView({ behavior: 'smooth' });
          window.addEventListener('scroll', () => {
            if (isNewsSearch && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
              offset += data.value.length;
              const apiRequestUrl = `api_request.php?apiType=news&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}&originalImg=${true}`;              
              tryFetch(apiRequestUrl);
            }
          });      
        }    
      } else if (isVideoSearch) {
        const relatedSearchesContainer = document.getElementById('related-searches-container');
        if (relatedSearchesContainer) {
          relatedSearchesContainer.style.display = 'none';
        }
        const content = document.getElementById('content');
        if (content) {
          content.style.display = 'none';
        }
        const assistantResponseBox = document.getElementById('assistant-response-box');
        if (assistantResponseBox) {
          assistantResponseBox.style.display = 'none';
        }
        const WikipediaContainer = document.getElementById('WikipediaContainer');
        if (WikipediaContainer) {
          WikipediaContainer.style.display = 'none';
        }
        const timezoneContainer = document.getElementById('timezone-container');
        if (timezoneContainer) {
          timezoneContainer.style.display = 'none';
        }
        const definitionContainer = document.getElementById('definition-container');
        if (definitionContainer) {
          definitionContainer.style.display = 'none';
        }
        const pagination = document.getElementById('pagination');
        if (pagination) {
          pagination.style.display = 'none';
        }
let videoGrid = document.getElementById('videoGrid');
if (!videoGrid) {
  videoGrid = document.createElement('div');
  videoGrid.id = 'videoGrid';
  videoGrid.classList.add('video-grid');
  document.body.appendChild(videoGrid);
}
data.value.forEach((videoItem) => {
  const videoLink = document.createElement('a');
  const videoContainer = document.createElement('div');
  const videoContent = document.createElement('div');
  const videoProvider = document.createElement('p');
  const videoTitle = document.createElement('h4');
  const videoDescription = document.createElement('p');
  const videoThumbnail = document.createElement('img');
  const videoDatePublished = document.createElement('p');
  const videoViewCount = document.createElement('p');

  videoLink.href = videoItem.hostPageUrl;
  videoContainer.classList.add('news-container');
  videoContent.classList.add('news-content');

  videoProvider.textContent = videoItem.publisher[0].name;
  videoTitle.textContent = videoItem.name;
  videoDescription.textContent = videoItem.description;
  videoDatePublished.textContent = new Date(videoItem.datePublished).toLocaleDateString();
  videoViewCount.textContent = `${videoItem.viewCount} Views`;

  if(videoItem.thumbnailUrl) {
    videoThumbnail.src = videoItem.thumbnailUrl;
    videoThumbnail.classList.add('news-thumbnail');
  }

  videoContent.appendChild(videoProvider);
  videoContent.appendChild(videoTitle);
  videoContent.appendChild(videoDescription);
  videoContent.appendChild(videoDatePublished);
  videoContent.appendChild(videoViewCount);

  videoContainer.appendChild(videoContent);
  if(videoItem.thumbnailUrl) {
    videoContainer.appendChild(videoThumbnail);
  }
  
  videoLink.appendChild(videoContainer);
  videoGrid.appendChild(videoLink);
});
const firstNewVideos = videoGrid.querySelectorAll('.news-container')[offset];
if (firstNewVideos) {
  firstNewVideos.scrollIntoView({ behavior: 'smooth' });
  window.addEventListener('scroll', () => {
    if (isVideoSearch && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      offset += data.value.length;
      const apiRequestUrl = `api_request.php?apiType=videos&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;           
      tryFetch(apiRequestUrl);
    }
  });      
}  
} else if (isImageSearch) {
  const pagination = document.getElementById('pagination');
  const newsGrid = document.getElementById('newsGrid');
  const videoGrid = document.getElementById('videoGrid');
  const timezoneContainer = document.getElementById('timezone-container');

  if (pagination) {
    pagination.style.visibility = 'hidden';
  }
  if (newsGrid) {
    newsGrid.remove();
  }
  if (videoGrid) {
    videoGrid.remove();
  }
  if (timezoneContainer) {
    timezoneContainer.style.display = 'none';
  }
  if (content) {
    content.style.display = 'none';
  }
  if (assistantResponseBox) {
    assistantResponseBox.style.display = 'none';
  }
  if (WikipediaContainer) {
    WikipediaContainer.style.display = 'none';
  }
  if (definitionContainer) {
    definitionContainer.style.display = 'none';
  }

  let imageGrid = document.getElementById('imageGrid');
  let currentIndex = 0;
  let fullScreenImageOverlay;
  let fullScreenImage;
  let arrowNext;
  let arrowPrev;
  let downloadButton;
  let printButton;
  let copyButton;
  const imagesData = data.value;
  
  if (!imageGrid) {
    imageGrid = document.createElement('div');
    imageGrid.id = 'imageGrid';
    imageGrid.classList.add('image-grid');
    document.body.appendChild(imageGrid);
  }
  
  function showFullScreenImage(index) {
    fullScreenImage.src = imagesData[index].thumbnailUrl;
    fullScreenImageOverlay.style.display = 'flex';
    currentIndex = index;
    document.body.style.overflow = 'hidden';
  }
  
  function hideFullScreenImage() {
    fullScreenImageOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }  
  
  fullScreenImageOverlay = document.createElement('div');
  fullScreenImageOverlay.id = 'fullScreenImageOverlay';
  fullScreenImageOverlay.classList.add('full-screen-image-overlay');
  document.body.appendChild(fullScreenImageOverlay);
  
  fullScreenImage = document.createElement('img');
  fullScreenImageOverlay.appendChild(fullScreenImage);
  
  arrowNext = document.createElement('button');
  arrowNext.textContent = '>';
  arrowNext.classList.add('next-image');
  fullScreenImageOverlay.appendChild(arrowNext);
  
  arrowPrev = document.createElement('button');
  arrowPrev.textContent = '<';
  arrowPrev.classList.add('prev-image');
  fullScreenImageOverlay.appendChild(arrowPrev);
  
  arrowNext.addEventListener('click', () => {
    if (currentIndex < imagesData.length - 1) {
      currentIndex++;
      showFullScreenImage(currentIndex);
    }
  });
  
  arrowPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showFullScreenImage(currentIndex);
    }
  });
  
  let closeButton;
  closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');
  fullScreenImageOverlay.appendChild(closeButton);
  
  closeButton.addEventListener('click', () => {
    hideFullScreenImage();
  });
  
  imagesData.forEach((image, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('image-container');
    const img = document.createElement('img');
    img.src = image.thumbnailUrl;
    img.style.objectFit = 'cover';
    img.addEventListener('click', () => showFullScreenImage(index));
    const imgTitle = document.createElement('h4');
    imgTitle.textContent = image.name.substring(0,40) + (image.name.length > 40 ? '...' : '');
    imgContainer.appendChild(img);
    imgContainer.appendChild(imgTitle);
    imageGrid.appendChild(imgContainer);
  });  

  const firstNewImage = imageGrid.querySelectorAll('.image-container')[offset];
  if (firstNewImage) {
    firstNewImage.scrollIntoView({ behavior: 'smooth' });
  }
  }
  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const nearBottom = scrollPosition >= document.body.offsetHeight * 0.9;
    if (isImageSearch && nearBottom) {
        offset += data.value.length;
        showSkeletonLoader();
        const apiRequestUrl = `api_request.php?apiType=images&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
        tryFetch(apiRequestUrl);
    }
});
  }

  async function fetchAssistantResponse(searchTerm, onUpdate, isWeatherSearch) {
    let searchTermWithoutSpaces = searchTerm.replace(/\s+/g, '');
    let assistantResponseBox = document.getElementById('assistant-response-box'); 

    if (isWeatherSearch) {
        assistantResponseBox.style.display = 'none';
        return null;
    }

    if (/^(create|make) (a picture|an? image|a photo) of /i.test(searchTerm) || 
        searchTermWithoutSpaces === 'calculator' || 
        isValidMathExpression(searchTermWithoutSpaces)) {
      
        assistantResponseBox.style.display = 'none';
        return null;
    }

    assistantResponseBox.style.display = 'block';

    const eventSource = new EventSource(`openai_request.php?searchTerm=${encodeURIComponent(searchTerm)}`);
    let result = "";
    
    return new Promise((resolve, reject) => {
      eventSource.onmessage = (event) => {
        const jsonString = event.data.replace(/^data:\s*/, '');
  
        if (!isValidJson(jsonString)) {
          return;
        }
  
        let data = JSON.parse(jsonString);
  
        if (data.timeZone) {
          eventSource.close();
          resolve(null);
          return;
        }
  
        if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
          const content = data.choices[0].delta.content;
          result += content;
          onUpdate(result);
        } else if (data.finish_reason) {
          resolve(result);
        }
      };
  
      eventSource.onerror = (error) => {
        reject(null);
        eventSource.close();
      };
    });
}

  const assistantResponseBox = document.getElementById("assistant-response-box");

  function updateResults() {
    if (assistantResponseBox.innerText === "Getting response...") {
      fetchAssistantResponse(searchTerm, (updatedResponse) => {
        assistantResponseBox.innerText = updatedResponse;
      })
      .then((response) => {
        if (response !== undefined) {
          assistantResponseBox.innerText = response;
        }
      })
      .catch((error) => console.error(error));
    }
  }

updateResults();
  
  function createPaginationButtons(totalEstimatedMatches) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalEstimatedMatches / 50);
    if (currentPage > 0) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.onclick = () => {
        currentPage--;
        fetchResults(currentPage * 50, searchType);
      };
      pagination.appendChild(prevButton);
    }
    if (currentPage < totalPages - 1) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.onclick = () => {
        currentPage++;
        fetchResults(currentPage * 50, searchType);
      };
      pagination.appendChild(nextButton);
    }
  }
  
  search();

  document.getElementById('videoBtn').addEventListener('click', (e) => {
    isNewsSearch = false;
    isImageSearch = false;
    isVideoSearch = true;
    document.getElementById('related-searches-container').classList.add('not-visible');
    const pagination = document.getElementById('pagination');
    const timezoneContainer = document.getElementById('timezone-container');
    const newsGrid = document.getElementById('newsGrid');
    if (newsGrid) {
      newsGrid.remove();
    }
    if (timezoneContainer) {
      timezoneContainer.style.display = 'none';
    }
    if (pagination) {
      pagination.style.visibility = 'hidden';
    }
    if (resultsTable) {
      resultsTable.style.display = 'none';
    }
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid || newsGrid.querySelectorAll('.video-container').length === 0) {
      showSkeletonLoader();
      const apiRequestUrl = `api_request.php?apiType=videos&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
      tryFetch(apiRequestUrl);
    }
    fetchResults(0, 'videos');
  });

  document.getElementById('imagesBtn').addEventListener('click', (e) => {
    isImageSearch = true;
    isNewsSearch = false;
    isVideoSearch = false;

    if (resultsTable) {
      resultsTable.style.display = 'none';
    }
    const imageGrid = document.getElementById('imageGrid');
    if (!imageGrid || imageGrid.querySelectorAll('.image-container').length === 0) {
      showSkeletonLoader();
      const apiRequestUrl = `api_request.php?apiType=images&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
      tryFetch(apiRequestUrl);
    }
    fetchResults(0, 'images');
  });

  document.getElementById('newsBtn').addEventListener('click', (e) => {
    isNewsSearch = true;
    isImageSearch = false;
    isVideoSearch = false;
    document.getElementById('related-searches-container').classList.add('not-visible');
    const pagination = document.getElementById('pagination');
    const definitionContainer = document.getElementById('definition-container');
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
      videoGrid.remove();
    }
    if (pagination) {
      pagination.style.visibility = 'hidden';
    }
    if (definitionContainer) {
      definitionContainer.style.display = 'none';
    }
    const timezoneContainer = document.getElementById('timezone-container');
    if (timezoneContainer) {
      timezoneContainer.style.display = 'none';
    }
    if (resultsTable) {
      resultsTable.style.display = 'none';
    }
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid || newsGrid.querySelectorAll('.news-container').length === 0) {
      showSkeletonLoader();
      const apiRequestUrl = `api_request.php?apiType=news&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
      tryFetch(apiRequestUrl);
    }
    fetchResults(0, 'news');
  });
  
  document.getElementById('searchBtn').addEventListener('click', (e) => {
    isImageSearch = false;
    isNewsSearch = false;
    isVideoSearch = false;

    const definitionContainer = document.getElementById('definition-container');
    if (definitionContainer) {
      definitionContainer.style.display = 'block'
    }

    if (resultsTable) {
      resultsTable.style.display = 'block';
    }

    currentPage = 0;
    document.getElementById('related-searches-container').classList.remove('not-visible');
    fetchResults(0, 'web');
});

  let disableAllExceptMaps = () => {
    Array.from(document.body.children).forEach((el) => {
      if (el.id !== 'maps-container') el.setAttribute('disabled', 'true');
    });
  };
  
  let enableAll = () => {
    Array.from(document.body.children).forEach((el) => {
      el.removeAttribute('disabled');
    });
  };
  
  document.getElementById('mapsBtn').addEventListener('click', (e) => {
    isNewsSearch = false;
    isImageSearch = false;
    window.scrollTo(0,0);
  
    document.body.style.overflow = 'hidden';
  
    let mapsContainer = document.getElementById('maps-container');
    mapsContainer.style.display = 'block';
    mapsContainer.style.position = 'fixed';
    mapsContainer.style.top = '0';
    mapsContainer.style.left = '0';
    mapsContainer.style.width = '135vw';
    mapsContainer.style.height = '100vh';
    mapsContainer.style.zIndex = '1000';
    mapsContainer.style.overflow = 'auto';
  
    disableAllExceptMaps();
  
    if (!mapsContainer.hasChildNodes()) {
        fetch('api_request.php?apiType=maps&searchTerm=' + encodeURIComponent(searchTerm))
        .then(response => response.text())
        .then(data => {
            let iframe = document.createElement('iframe');
            iframe.src = data;
            iframe.style.border = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.allowFullscreen = true;
  
            let closeButtonTop = document.createElement('div');
            closeButtonTop.innerHTML = 'X';
            closeButtonTop.className = 'close-button';
  
            let closeButtonBottom = document.createElement('div');
            closeButtonBottom.innerHTML = 'X';
            closeButtonBottom.className = 'close-button bottom';
  
            let closeAction = (e) => {
                e.currentTarget.parentNode.style.display = 'none';
                document.body.style.overflow = 'auto';
                enableAll();
                e.preventDefault();
            };
  
            closeButtonTop.addEventListener('click', closeAction);
            closeButtonTop.addEventListener('touchend', closeAction);
            closeButtonBottom.addEventListener('click', closeAction);
            closeButtonBottom.addEventListener('touchend', closeAction);
  
            mapsContainer.appendChild(iframe);
            mapsContainer.appendChild(closeButtonTop);
            mapsContainer.appendChild(closeButtonBottom);
        });
    }
});  

  const definitionContainer = document.getElementById('definition-container');
  const WikipediaContainer = document.getElementById('wikipedia-container');
  
  if (definitionContainer && definitionContainer.querySelector('h3')) {
    definitionContainer.style.display = 'block';
  }
  
  if (WikipediaContainer) {
    WikipediaContainer.style.display = 'block';
  }
  }

  fetchResults();
  fetchDefinitions(searchTerm);
  
  return;
  }