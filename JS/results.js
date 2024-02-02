const urlParams = new URLSearchParams(window.location.search);
const resultsTable = document.getElementById('search-results');
const assistantResponseBox = document.getElementById("assistant-response-box");
const searchTerm = urlParams.get('q');
const words = searchTerm.trim().split(/\s+/);
const searchbutton = document.getElementById('searchBtn');
const imagebutton = document.getElementById('imagesBtn');
const newsbutton = document.getElementById('newsBtn');
const videobutton = document.getElementById('videoBtn');
const chatbutton = document.getElementById('chatBtn');
const searchForm = document.getElementById('search-form');
const buttons = document.querySelectorAll('.custom-button');
const definitionContainer = document.getElementById('definition-container');
const submitsearchterm = document.getElementById('search-term');
let searchresultstable = [];
let shouldloadnewimageresults = true;
let shouldloadnewimagescrollresults = false;
let bufferedMessage = "";
let i = 0;
let isNewMessage = true;
let isWaitingForData = false;
let shouldContinueTyping = false;
let searchesloaded = false;
let offset = 105;
let allresultspushed = false;
let assistantresponse
let requestIsInProgress = false;
let apiCache = {};
let loadingAnimation = '.';
let loadingInterval;
let currentPage = 0;
let requestInProgress = false;
let isImageSearch = false;
let isNewsSearch = false;
let isVideoSearch = false;
let isAllSearch = true;
let isChatSearch = false;
let isFirstMessage = true;

searchbutton.classList.add('blueunderline');
document.getElementById('search-term').value = searchTerm;
document.title = searchTerm;

  searchForm.addEventListener('submit', function(event) {
  if (!submitsearchterm.value.trim()) {
    event.preventDefault();
  }
  });

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
  
    if (cleanedSearchTerm.split(' ').length <= 3) {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanedSearchTerm)}`;
      fetch(url)
        .then((response) => {
          if (response.status === 404) {
            throw new Error('404');
          }
          return response.json();
        })
        .then((data) => {
          if (data && data[0] && typeof data[0] !== 'string') {
            definitionContainer.style.display = 'block';
            definitionContainer.innerHTML = '';
  
            data.forEach((entry) => {
              const definitionTitle = document.createElement('h3');
              definitionTitle.textContent = entry.word;
              definitionContainer.appendChild(definitionTitle);
              definitionContainer.style.padding = '3.5vh';
              definitionContainer.style.borderRadius = '3.5vh';
  
              if (entry.meanings && entry.meanings.length > 0) {
                const definitionList = document.createElement('ul');
                entry.meanings.forEach((meaning) => {
                  if (meaning.definitions && meaning.definitions.length > 0) {
                    meaning.definitions.forEach((definition) => {
                      const definitionItem = document.createElement('li');
                      definitionItem.textContent = definition.definition;
                      definitionList.appendChild(definitionItem);
                    });
                  }
                });
                definitionContainer.appendChild(definitionList);
              }
            });
  
            const attribution = document.createElement('p');
            attribution.textContent = 'Results from Dictionary API';
            attribution.classList.add('mw-attribution');
            definitionContainer.appendChild(attribution);
          } else {
            definitionContainer.style.display = 'none';
          }
        })
        .catch((error) => {
          if (error.message !== '404') {
            console.error('Error fetching definition:', error);
          }
          definitionContainer.style.display = 'none';
        });
    }
    if (definitionContainer && definitionContainer.querySelector('h3')) {
      definitionContainer.style.display = 'block';
    } else {
      definitionContainer.style.display = 'none';
    }
  }

    if (!searchTerm || searchTerm.trim() === '' || ' ') {
  }

  async function send_prompt_to_server(prompt) {
    const data = {
      prompt: prompt
    };

    const response = await fetch("/PHP/imageserver.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  function showLoader() {
    const loader = document.createElement('img');
    loader.className = 'loading-image loader-style';
    loader.src = '/images/loading.webp';
    document.body.appendChild(loader);
  }
  
  function hideLoader() {
      const loader = document.querySelector('.loading-image');
      if (loader) {
          loader.parentNode.removeChild(loader);
      }
  }

  function displayImage(imageUrl, searchedTerm) {
    new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    }).then(() => {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `Image of ${searchedTerm}`;
      img.classList.add('image-style', 'fade-in-top', 'bounce-animation');
      document.body.appendChild(img);
      hideLoader();
    });
  }

  async function main(searchedTerm) {
    try {
      if (requestIsInProgress) return;

      if (/^(create|make|generate|produce|draw|paint|design|craft|show me) (a|an)? (picture|image|photo|illustration|graphic|visual|representation|depiction|rendering|portrayal) of /i.test(searchedTerm)) {
        searchedTerm = searchedTerm.replace(/^(create|make|generate|produce|draw|paint|design|craft|show me) (a|an)? (picture|image|photo|illustration|graphic|visual|representation|depiction|rendering|portrayal) of /i, "");
        requestIsInProgress = true;
        const assistantResponseBox = document.getElementById('assistant-response-box');
        assistantResponseBox.style.display = 'none';
        showLoader();
        const serverResponse = await send_prompt_to_server(searchedTerm);
        requestIsInProgress = false;

        if (serverResponse.status === "success") {
          const imageUrl = serverResponse.image_url;
          displayImage(imageUrl, searchedTerm);
        } else {
          alert('There was an error generating the image. Please try again later.');
          hideLoader();
        }
            } else if (/^((https?:\/\/)?[^\s]+\.[^\s]+)$/i.test(searchTerm)) {
              let url = searchTerm.match(/^((https?:\/\/)?[^\s]+\.[^\s]+)$/i)[0];
              if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
              }
              window.location.href = url;
            } else if (/weather|forecast|temperature|rain|snow|storm|what'?s the weather|current weather|weather today|weekend weather|weather report|is it going to rain|will it snow|storm prediction|temperature today|temperature tomorrow/i.test(searchTerm)) {
            const redirectToWeatherForecast = async () => {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(async position => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        window.location.href = `https://weather.com/weather/today/l/${latitude},${longitude}`;
                    }, error => {
                        console.error('Geolocation error:', error);
                    });
                } else {
                    console.log("Geolocation is not supported by this browser.");
                }
            };
            redirectToWeatherForecast();
          }
            if (words.length <= 2) {
              const assistantResponseBox = document.getElementById('assistant-response-box');
              assistantResponseBox.style.display = 'none';
            }
    } catch (error) {
      requestIsInProgress = false;
      hideLoader();
    }
  }

  async function fetchAssistantResponse(searchTerm, onUpdate) {
      if (/^(create|make|generate|produce|draw|paint|design|craft) (a|an)? (picture|image|photo|illustration|graphic|visual|representation|depiction|rendering|portrayal) of /i.test(searchTerm)) {
      return null;
    } else if (/^((https?:\/\/)?[^\s]+\.[^\s]+)$/i.test(searchTerm)) {
      return null;
    } else if (/weather|forecast|temperature|rain|snow|storm|what'?s the weather|current weather|weather today|weekend weather|weather report|is it going to rain|will it snow|storm prediction|temperature today|temperature tomorrow/i.test(searchTerm)) {
      return null;
    }
      if (words.length <= 2) {
      return null;
    }

    while (searchresultstable.length < 2) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const resultsToSend = searchresultstable.slice(0, 5);

    const encodedSearchResults = encodeURIComponent(JSON.stringify(resultsToSend));

    const cachedResponse = sessionStorage.getItem(`response-${searchTerm}`);
    if (cachedResponse) {
      assistantresponse = cachedResponse;
      const assistantResponseBox = document.getElementById("assistant-response-box");
      assistantResponseBox.innerHTML = cachedResponse;
      if (typeof onUpdate === "function") {
        onUpdate(cachedResponse, resultsToSend);
      }
      return Promise.resolve(cachedResponse);
    }

    const eventSource = new EventSource(`/PHP/summary.php?searchTerm=${encodeURIComponent(searchTerm)}&searchResults=${encodedSearchResults}`);
    let result = "";

    let cycle = 1;
    let firstChunkReceived = false;
    let timer = setInterval(() => {
      if (!firstChunkReceived) {
        let text = ".".repeat(cycle);
        try {
          if (typeof onUpdate === "function") {
            onUpdate(text || ".", resultsToSend);
          }
        } catch {}
        cycle = (cycle % 3) + 1;
      }
    }, 100);

    const connectionTimeout = setTimeout(() => {
      eventSource.close();
      clearInterval(timer);
      throw new Error('Connection timeout');
    }, 10000);

    return new Promise((resolve, reject) => {
      eventSource.onmessage = (event) => {
        try {
          clearTimeout(connectionTimeout);
          clearInterval(timer);

          const jsonString = event.data.replace(/^data:\s*/, '');
          let data = JSON.parse(jsonString);

          if (!isValidJson(jsonString)) {
            return;
          }

          if (data.timeZone) {
            eventSource.close();
            resolve(null);
            return;
          }

          if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
            const content = data.choices[0].delta.content;
            result += content;
            assistantresponse = result;
            firstChunkReceived = true;
            try {
              if (typeof onUpdate === "function") {
                onUpdate(result, resultsToSend);
              }
            } catch {}
          } else if (data.finish_reason) {
            sessionStorage.setItem(`response-${searchTerm}`, result);
            const assistantResponseBox = document.getElementById("assistant-response-box");
            assistantResponseBox.innerHTML = result;
            resolve(result);
          }
        } catch (e) {
            }
          };

      eventSource.onerror = (error) => {
        clearTimeout(connectionTimeout);
        clearInterval(timer);
        eventSource.close();
        reject(error);
      };
    });
  }

  function fetchResults(offset, searchType = 'web') {
  async function tryFetch(apiRequestUrl) {
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
        processResults(cache[apiRequestUrl]);
        requestInProgress = false;
      } else {
        try {
          const response = await fetch(apiRequestUrl);
          if (response.status === 404) {
            window.location.href = '/html/notfound.html';
            return;
          } else if (!response.ok) {
            throw new Error('API request failed');
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Response from API was not JSON");
          }
          const data = await response.json();
          processResults(data);
          cache[apiRequestUrl] = data;
          sessionStorage.setItem('apiData', JSON.stringify(cache));
        } catch (error) {
          console.error('API request failed:', error);
        } finally {
          requestInProgress = false;
        }
      }
  }
  
  async function search() {
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
              button.style.cursor = 'pointer';
              button.addEventListener('mousedown', function() {
                  this.classList.add('active');
              });
              button.addEventListener('mouseup', function() {
                  this.classList.remove('active');
              });
              button.addEventListener('click', function() {
                  if (buttonValue === '=') {
                      try {
                          display.textContent = Function('"use strict";return (' + display.textContent + ')')();
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
                      display.textContent = Function('"use strict";return (' + display.textContent + ')')();
                  } catch {
                      display.textContent = "Error";
                  }
              } else {
                  display.textContent += key;
              }
          }
      });
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

    async function sendRequestWithGeoData(searchTerm, latitude, longitude) {
      let apiRequestUrl = `/PHP/api_request.php?searchTerm=${encodeURIComponent(searchTerm)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
      if (typeof tryFetch === 'function') {
        await tryFetch(apiRequestUrl);
      }
    }
    
    async function sendRequestWithIP(searchTerm) {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      let ipData = await ipResponse.json();
    
      localStorage.setItem('ipData', JSON.stringify(ipData));
      localStorage.setItem('ipDataTime', Date.now());
    
      let apiRequestUrl = `/PHP/api_request.php?searchTerm=${encodeURIComponent(searchTerm)}&userIp=${encodeURIComponent(ipData.ip)}`;
      if (typeof tryFetch === 'function') {
        await tryFetch(apiRequestUrl);
      }
    }
    let searchTermWithoutSpaces = searchTerm.replace(/\s+/g, '');
  
    let calculatorContainer = document.getElementById('calculator-container');
  
    const handleCalculator = () => {
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
    };
  
    const handleGeoLocationRequest = async () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          localStorage.setItem('latitude', latitude);
          localStorage.setItem('longitude', longitude);
          localStorage.setItem('geoDataTime', Date.now());
  
          resolve({ latitude, longitude });
        }, error => {
          console.error('Geolocation error:', error);
          reject(error);
        });
      });
    };
  
    const handleSearchRequest = async () => {
      if (!/^(create|make|generate|produce|draw|paint|design|craft|show me) (a|an)? (picture|image|photo|illustration|graphic|visual|representation|depiction|rendering|portrayal) of /i.test(searchTerm) && !/^((https?:\/\/)?[^\s]+\.[^\s]+)$/i.test(searchTerm) && !/weather|forecast|temperature|rain|snow|storm|what'?s the weather|current weather|weather today|weekend weather|weather report|is it going to rain|will it snow|storm prediction|temperature today|temperature tomorrow/i.test(searchTerm)) {
        
        const startTime = performance.now();
  
        let latitude = localStorage.getItem('latitude');
        let longitude = localStorage.getItem('longitude');
        let geoDataTime = localStorage.getItem('geoDataTime');
  
        if (latitude && longitude && geoDataTime && (Date.now() - geoDataTime < 2 * 60 * 60 * 1000)) {
          await sendRequestWithGeoData(searchTerm, latitude, longitude);
        } else if ('geolocation' in navigator) {
          try {
            const position = await handleGeoLocationRequest();
            await sendRequestWithGeoData(searchTerm, position.latitude, position.longitude);
          } catch (error) {
            await sendRequestWithIP(searchTerm);
          }
        } else {
          await sendRequestWithIP(searchTerm);
        }
  
        const endTime = performance.now();
        console.log(`Search request time: ${endTime - startTime}ms`);
      }
    };
  
    handleCalculator();
    await handleSearchRequest();
  }

  function processResults(data) {

    resultsTable.innerHTML = '';

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
                  const url = `/html/results.html?q=${encodeURIComponent(searchTerm)}&offset=${offset}`;
                  window.location.href = url;
              };
              relatedSearchesContainer.appendChild(button);
          }
      }
  }

    if (data.relatedSearches) {
        displayRelatedSearches(data.relatedSearches.value);
    }
if (data.webPages && data.webPages.value && data.webPages.value.length > 0) {
  isAllSearch = true;
  const searchResults = document.getElementById('search-results');
  const pagination = document.getElementById('pagination');
  const content = document.getElementById('content');
  const relatedSearchesContainer = document.getElementById('related-searches-container');
  const newsGrid = document.getElementById('newsGrid');
  const videoGrid = document.getElementById('videoGrid');
  const timezoneContainer = document.getElementById('timezone-container');
  const imageGrid = document.getElementById('imageGrid');

  videoGrid && (videoGrid.style.display = 'none');
  timezoneContainer && (timezoneContainer.style.display = 'none');
  content && (content.style.display = 'block');
  relatedSearchesContainer && (relatedSearchesContainer.style.display = 'block');
  searchResults && (searchResults.style.display = 'block');
  pagination && (pagination.style.display = 'block');
  newsGrid && (newsGrid.style.display = 'none');
  imageGrid && (imageGrid.style.display = 'none');
  if (assistantResponseBox && words.length > 2) {
      assistantResponseBox.style.display = 'block';
  }
  searchResults.style.marginTop = '3.5vh';

  const maxConcurrentRequests = 20; 
  const requestQueue = data.webPages.value.slice();

  const processQueue = async () => {
      if (requestQueue.length === 0) {
          return;
      }
      const currentBatch = requestQueue.splice(0, maxConcurrentRequests);
      const promises = currentBatch.map(result => processResult(result));
      await Promise.all(promises);
      await processQueue();
      processQueue();
  };

  const processResult = async (result) => {
    try {
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

      const fullResult = {...result};
      fullResult.snippet = result.snippet;

      searchresultstable.push(fullResult);

      createPaginationButtons(data.webPages.totalEstimatedMatches);
    } catch (error) {
      if (error.status !== 404) {
      }
    }
  };   
  
  processQueue();

} else if (isNewsSearch) {
  clearAll();
  searchbutton.classList.remove('blueunderline');
  chatbutton.classList.remove('blueunderline');
  imagebutton.classList.remove('blueunderline');
  videobutton.classList.remove('blueunderline');
  newsbutton.classList.add('blueunderline');
  readytoloadmore = false;
  let newsGrid = document.getElementById('newsGrid');

  const createNewsItem = async (newsItem) => {
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

    if (newsItem.image) {
      newsThumbnail.src = newsItem.image.thumbnail.contentUrl;
      newsThumbnail.classList.add('news-thumbnail');
    }

    newsContent.appendChild(newsProvider);
    newsContent.appendChild(newsTitle);
    newsContent.appendChild(newsDescription);
    newsContent.appendChild(newsPublishedDate);

    newsContainer.appendChild(newsContent);
    if (newsItem.image) {
      newsContainer.appendChild(newsThumbnail);
    }

    newsLink.appendChild(newsContainer);
    return newsLink;
  };

  if (!newsGrid) {
    newsGrid = document.createElement('div');
    newsGrid.id = 'newsGrid';
    newsGrid.classList.add('news-grid');
    newsGrid.style.gridGap = '0.25%';
    document.body.appendChild(newsGrid);

    Promise.all(data.value.map(newsItem => createNewsItem(newsItem)))
      .then(newsElements => {
        newsElements.forEach(newsElement => newsGrid.appendChild(newsElement));
      });
  } else {
    newsGrid.style.display = 'block';
  } 
} else if (isVideoSearch) {
  clearAll();
  searchbutton.classList.remove('blueunderline');
  chatbutton.classList.remove('blueunderline');
  imagebutton.classList.remove('blueunderline');
  newsbutton.classList.remove('blueunderline');
  videobutton.classList.add('blueunderline');
  readytoloadmore = false;
  let videoGrid = document.getElementById('videoGrid');

  const createVideoItem = async (videoItem) => {
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

    if (videoItem.thumbnailUrl) {
      videoThumbnail.src = videoItem.thumbnailUrl;
      videoThumbnail.classList.add('news-thumbnail');
    }

    videoContent.appendChild(videoProvider);
    videoContent.appendChild(videoTitle);
    videoContent.appendChild(videoDescription);
    videoContent.appendChild(videoDatePublished);
    videoContent.appendChild(videoViewCount);

    videoContainer.appendChild(videoContent);
    if (videoItem.thumbnailUrl) {
      videoContainer.appendChild(videoThumbnail);
    }

    videoLink.appendChild(videoContainer);
    return videoLink;
  };

  if (!videoGrid) {
    videoGrid = document.createElement('div');
    videoGrid.id = 'videoGrid';
    videoGrid.classList.add('video-grid');
    document.body.appendChild(videoGrid);
  } else {
    videoGrid.style.display = 'block';
  }

  if (!videoGrid.hasChildNodes()) {
    Promise.all(data.value.map(videoItem => createVideoItem(videoItem)))
      .then(videoElements => {
        videoElements.forEach(videoElement => videoGrid.appendChild(videoElement));
      });
  }
} else if (isImageSearch) {
  clearAll();
  searchbutton.classList.remove('blueunderline');
  chatbutton.classList.remove('blueunderline');
  newsbutton.classList.remove('blueunderline');
  videobutton.classList.remove('blueunderline');
  imagebutton.classList.add('blueunderline');
  shouldloadnewimagescrollresults = false;
  setTimeout(() => {
    shouldloadnewimagescrollresults = true;
  }, 2000);
  function setElementVisibility(id, visibility) {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = visibility ? 'block' : 'none';
    }
  }

  let imageGrid = document.getElementById('imageGrid');
  let fullScreenImageOverlay;
  let fullScreenImage;
  const imagesData = data.value || [];

  if (!imageGrid) {
    imageGrid = document.createElement('div');
    imageGrid.id = 'imageGrid';
    imageGrid.classList.add('image-grid');
    imageGrid.style.justifyContent = 'center';
    imageGrid.style.alignItems = 'center';
    document.body.appendChild(imageGrid);
  } else {
    setElementVisibility('imageGrid', true);
    return;
  }

  function showFullScreenImage(index) {
    fullScreenImage.src = imagesData[index].thumbnailUrl;
    fullScreenImage.style.cursor = 'pointer';
    fullScreenImageOverlay.style.display = 'flex';
    fullScreenImageOverlay.style.alignItems = 'center';
    fullScreenImageOverlay.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';
    currentIndex = index;

    fullScreenImageOverlay.style.padding = '0';
    fullScreenImage.style.width = 'auto';
    fullScreenImage.style.height = 'auto';
    fullScreenImage.style.minWidth = '35vw';
    fullScreenImage.style.minHeight = '35vh';
    fullScreenImage.style.maxWidth = '80vw';
    fullScreenImage.style.maxHeight = '80vh';
    fullScreenImage.style.objectFit = 'contain';
    fullScreenImageOverlay.style.overflowY = 'scroll';

    fullScreenImage.dataset.hostPageUrl = imagesData[index].hostPageUrl;
  }

  function hideFullScreenImage() {
    fullScreenImageOverlay.style.display = 'none';
    fullScreenImageOverlay.style.height = 'auto';
    document.body.style.overflow = 'auto';
    fullScreenImageOverlay.style.padding = '2vh 2vw';
    fullScreenImageOverlay.style.alignItems = 'center';
  }

  fullScreenImageOverlay = document.createElement('div');
  fullScreenImageOverlay.id = 'fullScreenImageOverlay';
  fullScreenImageOverlay.style.position = 'fixed';
  fullScreenImageOverlay.style.top = '0';
  fullScreenImageOverlay.style.right = '0';
  fullScreenImageOverlay.style.bottom = '0';
  fullScreenImageOverlay.style.left = '0';
  fullScreenImageOverlay.style.display = 'none';
  fullScreenImageOverlay.style.alignItems = 'center';
  fullScreenImageOverlay.style.justifyContent = 'center';
  fullScreenImageOverlay.classList.add('full-screen-image-overlay');
  document.body.appendChild(fullScreenImageOverlay);

  fullScreenImage = document.createElement('img');
  fullScreenImageOverlay.appendChild(fullScreenImage);

  fullScreenImage.addEventListener('click', () => {
    window.open(fullScreenImage.dataset.hostPageUrl, '_blank');
  });

  let closeButton;
  closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');
  fullScreenImageOverlay.appendChild(closeButton);

  closeButton.addEventListener('click', () => {
    hideFullScreenImage();
  });

  if (shouldloadnewimageresults) {
    const imagePromises = imagesData.map((image, index) => {
      return new Promise((resolve, reject) => {
        if (!image.thumbnailUrl) return resolve();
  
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');
        imgContainer.style.display = 'block';
        imgContainer.style.justifyContent = 'center';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.marginBottom = '0.75vh';
  
        const img = document.createElement('img');
        img.style.display = 'none';
        img.onload = function () {
          img.style.display = 'block';
          resolve(img);
        };
        img.onerror = function () {
          reject();
        };
        img.src = image.thumbnailUrl;
        img.style.objectFit = 'cover';
        img.classList.add('image-hover');
        img.style.cursor = 'pointer';
        img.style.transition = 'transform 0.15s';
        img.addEventListener('click', () => {
          lastScrollTop = window.scrollY;
          showFullScreenImage(index);
        });
        img.addEventListener('mousedown', () => {
          img.style.transform = 'scale(0.95)';
        });
        img.addEventListener('mouseup', () => {
          img.style.transform = 'scale(1)';
        });
  
        imgContainer.appendChild(img);
        imageGrid.appendChild(imgContainer);
      });
    });
  
    Promise.all(imagePromises)
      .then((images) => {
        images.forEach(img => {
          if (img) img.style.display = 'block';
        });
        imageGrid.style.display = 'block';
        shouldloadnewimageresults = false;
        shouldloadnewimagescrollresults = true;
      });
  }  
}

  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const nearBottom = scrollPosition >= document.body.offsetHeight * 0.9;
    if (isImageSearch && nearBottom && shouldloadnewimagescrollresults) {
      shouldloadnewimageresults = true;
  
      offset += 105;

      const apiRequestUrl = `/PHP/api_request.php?apiType=images&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
      tryFetch(apiRequestUrl);
      shouldloadnewimagescrollresults = false;
    }
  });
  
  setTimeout(() => {
    shouldloadnewimagescrollresults = true;
  }, 4000);
  }

  function updateResults(searchResults) {
    function startLoadingAnimation() {
      loadingInterval = setInterval(() => {
        loadingAnimation = loadingAnimation.length < 3 ? loadingAnimation + '.' : '.';
        assistantResponseBox.innerText = loadingAnimation;
      }, 100);
    }
  
    function stopLoadingAnimation() {
      clearInterval(loadingInterval);
    }
    if (assistantResponseBox.innerText === "Getting response...") {
      startLoadingAnimation();
      if (typeof fetchAssistantResponse !== "undefined") {
        fetchAssistantResponse(searchTerm,(updatedResponse) => {
          stopLoadingAnimation();
          if (updatedResponse !== undefined) {
            assistantResponseBox.innerText = updatedResponse;
          } else {
            console.error("fetchAssistantResponse returned an undefined response");
          }
        }).catch((error) => {
          stopLoadingAnimation();
        });
      } else {
        stopLoadingAnimation();
        console.error("fetchAssistantResponse is not defined");
      }
    }
  }

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
        fetchResults(currentPage * 10, searchType);
      };
      pagination.appendChild(nextButton);
    }
  }

  function clearAll() {
    const elementsToHide = ['search-results', 'newsGrid', 'videoGrid', 'imageGrid', 'timezone-container', 'related-searches-container', 'chat-interface', 'pagination', 'definition-container', 'content', 'assistant-response-box', 'calculator-container', 'chatContainer', 'chat-interface'];

    for (let elementId of elementsToHide) {
      try {
        let element = document.getElementById(elementId);
        if (element) {
          element.style.display = 'none';
        }
      } catch (error) {
        console.error(`Failed to hide element with id ${elementId}.`, error);
      }
    }

    try {
    } catch (error) {
      console.error('Failed to hide skeleton loader.', error);
    }
  }

  document.getElementById('videoBtn').addEventListener('click', (e) => {
    if (isVideoSearch) {
      return;
    }
    isNewsSearch = false;
    isImageSearch = false;
    isVideoSearch = true;
    isAllSearch = false;
    isChatSearch = false;
    const apiRequestUrl = `/PHP/api_request.php?apiType=videos&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
    tryFetch(apiRequestUrl)
    fetchResults(0, 'videos')
  });

  document.getElementById('imagesBtn').addEventListener('click', (e) => {
      if (isImageSearch) {
        return;
      }
      isImageSearch = true;
      isNewsSearch = false;
      isVideoSearch = false;
      isAllSearch = false;
      isChatSearch = false;
      if (shouldloadnewimageresults) {
      const apiRequestUrl = `/PHP/api_request.php?apiType=images&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
      tryFetch(apiRequestUrl)
      fetchResults(0, 'images')
      const imageGrid = document.getElementById('imageGrid');
      if (imageGrid) {
        imageGrid.style.display = 'block';
          }
      }
  });

  document.getElementById('newsBtn').addEventListener('click', (e) => {
    if (isNewsSearch) {
      return;
    }
    isNewsSearch = true;
    isImageSearch = false;
    isVideoSearch = false;
    isAllSearch = false;
    isChatSearch = false;
    const apiRequestUrl = `/PHP/api_request.php?apiType=news&searchTerm=${encodeURIComponent(searchTerm)}&offset=${offset}`;
    tryFetch(apiRequestUrl)
  });

  document.getElementById('searchBtn').addEventListener('click', (e) => {
      if (isAllSearch) {
        return;
      }
      clearAll();
      searchbutton.classList.add('blueunderline');
      chatbutton.classList.remove('blueunderline');
      imagebutton.classList.remove('blueunderline');
      newsbutton.classList.remove('blueunderline');
      videobutton.classList.remove('blueunderline');
      isImageSearch = false;
      isNewsSearch = false;
      isVideoSearch = false;
      isAllSearch = true;
      isChatSearch = false;
      fetchResults(0, 'web');
  });

  document.getElementById('chatBtn').addEventListener('click', (e) => {
    searchbutton.classList.remove('blueunderline');
    chatbutton.classList.add('blueunderline');
    imagebutton.classList.remove('blueunderline');
    newsbutton.classList.remove('blueunderline');
    videobutton.classList.remove('blueunderline');
    let eventSource;
  const lastSearchTerm = localStorage.getItem('lastSearchTerm');

  if (!lastSearchTerm || searchTerm !== lastSearchTerm) {
    fetch('/PHP/deletechat.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchTerm })
    });
  }

  localStorage.setItem('lastSearchTerm', searchTerm);
    if (isChatSearch) {
      return;
    }
    try {
      clearAll();
      isImageSearch = false;
      isNewsSearch = false;
      isVideoSearch = false;
      isAllSearch = false;
      isChatSearch = true;
        const chatInterface = document.getElementById('chat-interface');
        if (chatInterface) {
          chatInterface.style.display = 'flex';
          const chatContainer = document.getElementById('chatContainer');
          if (chatContainer) {
            chatContainer.style.display = 'block';
          }
          const chatInput = document.getElementById('chat-input');
          if (chatInput) {
            chatInput.style.display = 'block';
          }
          return;
        }
      } catch (error) {
        console.error('Failed to clear all:', error);
      }
      const chatInterface = document.createElement('div');
      chatInterface.id = 'chat-interface';
      document.body.appendChild(chatInterface);
      
      const chatContainer = document.createElement('div');
      chatContainer.id = 'chatContainer';
      chatInterface.appendChild(chatContainer);
      window.scrollTo(0, document.body.scrollHeight);
      
      const chatInputContainer = document.createElement('div');
      chatInputContainer.className = 'chat-input-container';
      chatInterface.appendChild(chatInputContainer);
      
      const chat = document.createElement('button');
      chat.className = 'enter-button-style';
      const chatIcon = document.createElement('img');
      chatIcon.src = '/images/arrow.webp';
      chatIcon.className = 'chat-icon';
      chat.appendChild(chatIcon);
      chatInputContainer.appendChild(chat);
      
      const chatInput = document.createElement('textarea');
      chatInput.id = 'chat-input';
      chatInput.maxLength = 20000;
      chatInputContainer.appendChild(chatInput);          
    
    chatInput.addEventListener('input', function(event) {
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight) + 'px';
      if (chatInput.scrollHeight > parseInt(chatInput.style.maxHeight.replace('rem', ''))) {
        chatInput.style.overflowY = 'auto';
      } else {
        chatInput.style.overflowY = 'hidden';
      }
    });
    
    chatInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        chat.click();
      }
    });
    
    let prevResult = "";

    document.addEventListener('DOMContentLoaded', async () => {
      await sendInitialMessages(searchTerm, assistantresponse);
  });
  
  async function sendInitialMessages(userMessage, assistantMessage) {
      const locationData = await getLocationData();
      const apiRequestUrl = `/PHP/chat.php?userMessage=${encodeURIComponent(userMessage)}&assistantMessage=${encodeURIComponent(assistantMessage)}&latitude=${locationData.latitude}&longitude=${locationData.longitude}`;
      eventSource = new EventSource(apiRequestUrl);
  }
  
  async function getLocationData() {
      let latitude = localStorage.getItem('latitude');
      let longitude = localStorage.getItem('longitude');
      let ipData = localStorage.getItem('ipData');
  
      if (!latitude || !longitude) {
          if (ipData) {
              ipData = JSON.parse(ipData);
              latitude = ipData.latitude;
              longitude = ipData.longitude;
          } else {
              const response = await fetch('https://ipinfo.io/json');
              ipData = await response.json();
              localStorage.setItem('ipData', JSON.stringify(ipData));
              latitude = ipData.latitude;
              longitude = ipData.longitude;
          }
      }
      return { latitude, longitude };
  }
  
  chat.addEventListener('click', async () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatInput.value = '';
    chatInput.style.height = '3rem';
    
    chat.className = 'enter-button-style';
    chat.style.transform = 'scale(0.9)';
    
    setTimeout(function(){
        chat.style.transform = 'scale(1)';
    }, 300);
    
    const userMsgElement = document.createElement('div');
    userMsgElement.className = 'user-msg-element';
    
    const userMsgText = document.createElement('div');
    userMsgText.textContent = userMessage;
    userMsgText.className = 'user-msg-text';
    
    userMsgElement.appendChild(userMsgText);        
    chatContainer.appendChild(userMsgElement);
    
    if (isFirstMessage) {
      const aiMsgElement = document.createElement('div');
      aiMsgElement.classList.add('ai-msg-element');
      chatContainer.appendChild(aiMsgElement);
    
      const aiMsgImage = document.createElement('img');
      aiMsgImage.src = assistantresponse ? '/images/tlog.webp' : '/images/lightningboltload.gif';
      aiMsgImage.classList.add('ai-msg-image');
      aiMsgElement.appendChild(aiMsgImage);
    
      const aiMsgText = document.createElement('div');
      aiMsgText.classList.add('ai-msg-text');
      aiMsgText.textContent = assistantresponse;
      aiMsgElement.appendChild(aiMsgText);    
    
        let prevAssistantresponse = assistantresponse;
        assistantresponseInterval = setInterval(() => {
          if (assistantresponse !== prevAssistantresponse) {
            aiMsgText.textContent = assistantresponse;
            aiMsgImage.src = assistantresponse ? '/images/tlog.webp' : '/images/lightningboltload.gif';
            prevAssistantresponse = assistantresponse;
          }
        }, 5);
    
        isFirstMessage = false;
      } else {
        sendInitialMessages(userMessage, assistantresponse);
      async function getLocationData() {
        let latitude = localStorage.getItem('latitude');
        let longitude = localStorage.getItem('longitude');
        let ipData = localStorage.getItem('ipData');
    
        if (!latitude || !longitude) {
          if (ipData) {
            ipData = JSON.parse(ipData);
            latitude = ipData.latitude;
            longitude = ipData.longitude;
          } else {
            const response = await fetch('https://ipinfo.io/json');
            ipData = await response.json();
            localStorage.setItem('ipData', JSON.stringify(ipData));
            latitude = ipData.latitude;
            longitude = ipData.longitude;
          }
        }
        return { latitude, longitude };
      }

      if (eventSource) {
        eventSource.close();
      }
    
      getLocationData().then(({ latitude, longitude }) => {
        const apiRequestUrl = `/PHP/chat.php?userMessage=${encodeURIComponent(userMessage)}&assistantMessage=${encodeURIComponent(assistantresponse)}&latitude=${latitude}&longitude=${longitude}`;
        eventSource = new EventSource(apiRequestUrl);
        let timeoutId;

      const aiMsgElement = document.createElement('div');
      aiMsgElement.classList.add('ai-msg-element');
      chatContainer.appendChild(aiMsgElement);

      const aiMsgImage = document.createElement('img');
      aiMsgImage.src = '/images/lightningboltload.gif';
      aiMsgImage.classList.add('ai-msg-image');
      aiMsgElement.appendChild(aiMsgImage);

      const aiMsgText = document.createElement('div');
      aiMsgText.style.whiteSpace = 'pre-wrap';
      aiMsgText.style.backgroundColor = '#F5F5F5';
      aiMsgText.style.borderRadius = '0.625em';
      aiMsgText.style.padding = '0.625em';
      aiMsgText.style.width = '100%';
      aiMsgElement.appendChild(aiMsgText);

      function typeMessage() {
        if (i < bufferedMessage.length) {
          aiMsgText.textContent += bufferedMessage[i];
          i++;
          const scrollValue = chatContainer.scrollHeight - chatContainer.clientHeight;
          chatContainer.scrollTop = scrollValue;
          setTimeout(typeMessage, 4.5);
        } else {
          isWaitingForData = true;
        }
      }        

      eventSource.onmessage = (event) => {
        aiMsgImage.src = '/images/tlog.webp';
        const jsonString = event.data.replace(/^data:\s*/, '');

        if (!isValidJson(jsonString)) {
          return;
        }

        let data = JSON.parse(jsonString);

        if (data.completion) {
          if (prevResult !== data.completion) {
            let newMessage = data.completion.replace(prevResult, '');
            bufferedMessage += newMessage;
            prevResult = data.completion;

            if (isNewMessage) {
              typeMessage();
              isNewMessage = false;
            } else if (isWaitingForData) {
              isWaitingForData = false;
              typeMessage();
            }
          }
        }          

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          eventSource.close();
        }, 3000);

        if (data.finished) {
          eventSource.close();
          clearTimeout(timeoutId);
          bufferedMessage = "";
          i = 0;
          isNewMessage = true;
        }
      };

      eventSource.onerror = (error) => {
        console.error('An error occurred with the EventSource:', error);
        eventSource.close();
      };
    });
    clearInterval(assistantresponseInterval);
  }
});  

  chatInput.value = searchTerm;
  chat.click();
  });

  document.getElementById('mapsBtn').addEventListener('click', () => {
  window.location.href = "https://www.google.com/maps/search/" + encodeURIComponent(searchTerm);
  });
  updateResults();
  search();
  fetchDefinitions(searchTerm);
  main(searchTerm);
  }
  fetchResults();