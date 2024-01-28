let bufferedMessage = "";
let i = 0;
let isNewMessage = true;
let isWaitingForData = false;
var settingsButton = document.getElementById('settings-button');
var settingsOptions = document.getElementById('settings-options');
var searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', function(event) {
  var searchTerm = document.getElementById('search-term');

  if (!searchTerm.value.trim()) {
    event.preventDefault();
  }
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('geoDataTime', Date.now());
  });
}

settingsButton.addEventListener('click', function(event) {
  event.stopPropagation();
  if (settingsOptions.style.display != 'flex') {
    if (!settingsButton.classList.contains('spinning')) {
      settingsButton.classList.add('spinning');

      setTimeout(function() {
        settingsButton.classList.remove('spinning');
      }, 2500);
    }

    settingsOptions.style.display = 'flex';
  } else {
    settingsOptions.style.display = 'none';
  }
});

document.addEventListener('click', function(event) {
  if (!settingsButton.contains(event.target) && settingsOptions.style.display === 'flex') {
    settingsOptions.style.display = 'none';
  }
});

window.onload = function() {
  var isChromium = window.chrome;
  var winNav = window.navigator;
  var vendorName = winNav.vendor;
  var isOpera = typeof window.opr !== "undefined";
  var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
  var isIOSChrome = winNav.userAgent.match("CriOS");
  var isBrave = 'brave' in window.navigator;

  if ((isIOSChrome || isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && isOpera === false && isIEedge === false) && !isBrave) {
  } else {
    var chromeExtensionLink = document.getElementById('chrome-extension-link');
    if (chromeExtensionLink) {
      chromeExtensionLink.style.display = 'none';
    }
  }
}

// Start of the chat feature

document.getElementById('chatBtn').addEventListener('click', (e) => {
  let existingChatInterface = document.getElementById('chat-interface');
  if (existingChatInterface) {
    existingChatInterface.remove();
    fetch('deletechat.php');
    return;
  }  
  const chromeExtensionLink = document.getElementById('chrome-extension-link');
  chromeExtensionLink && (chromeExtensionLink.style.display = 'none');
  
  const chatInterface = document.createElement('div');
  chatInterface.id = 'chat-interface';
  document.body.appendChild(chatInterface);

  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatContainer';
  chatInterface.appendChild(chatContainer);
  window.scrollTo(0,document.body.scrollHeight);

  const chatInputContainer = document.createElement('div');
  chatInputContainer.className = 'chat-input-container';
  chatInterface.appendChild(chatInputContainer);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.className = 'close-button-style';
  closeButton.addEventListener('click', () => {
    closeButton.style.transition = 'transform 0.25s ease';
    closeButton.style.transform = 'scale(0.9)';

    setTimeout(() => {
      closeButton.style.transform = 'scale(1)';
      let existingChatInterface = document.getElementById('chat-interface');
      if (existingChatInterface) {
        existingChatInterface.remove();
        fetch('deletechat.php');
      }
    }, 250);
  });  

  closeButton.addEventListener('click', () => {
    chromeExtensionLink && (chromeExtensionLink.style.display = 'block');
    let existingChatInterface = document.getElementById('chat-interface');
    existingChatInterface && existingChatInterface.remove();
    fetch('deletechat.php');
  });

  const chat = document.createElement('button');
  chat.className = 'enter-button-style';

  const chatIcon = document.createElement('img');
  chatIcon.src = 'arrow.webp';
  chatIcon.style.width = '100%';
  chatIcon.style.height = '100%';
  chat.appendChild(chatIcon);

  chatInputContainer.appendChild(chat);

  const chatInput = document.createElement('textarea');
  chatInput.id = 'chat-input';
  chatInput.maxLength = 20000;
  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(closeButton);

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

  chat.addEventListener('click', async () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) {
      return;
    }
    chatInput.value = '';
    chatInput.style.height = '3rem';
  
    chat.style.transition = 'transform 0.3s ease';
    chat.style.transform = 'scale(0.9)';
  
    setTimeout(function() {
      chat.style.transform = 'scale(1)';
    }, 300);
  
    const userMsgElement = document.createElement('div');
    userMsgElement.classList.add('user-msg-element');
  
    const userMsgText = document.createElement('div');
    userMsgText.textContent = userMessage;
    userMsgText.classList.add('user-msg-text');
  
    userMsgElement.appendChild(userMsgText);
    chatContainer.appendChild(userMsgElement);
  
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
  
    const apiRequestUrl = `chat.php?userMessage=${encodeURIComponent(userMessage)}&latitude=${latitude}&longitude=${longitude}`;
    const eventSource = new EventSource(apiRequestUrl);
    let timeoutId;
  
    const aiMsgElement = document.createElement('div');
    aiMsgElement.classList.add('ai-msg-element');
  
    const aiMsgImage = document.createElement('img');
    aiMsgImage.src = 'lightningboltload.gif';
    aiMsgImage.classList.add('ai-msg-image');
  
    aiMsgElement.appendChild(aiMsgImage);
  
    const aiMsgText = document.createElement('div');
    aiMsgText.classList.add('ai-msg-text');
  
    aiMsgElement.appendChild(aiMsgText);
    chatContainer.appendChild(aiMsgElement);  
  
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
      aiMsgImage.src = 'tlog.webp';
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
      eventSource.close();
    };
  });
});

function isValidJson(str) {
try {
    JSON.parse(str);
} catch (e) {
    return false;
}
return true;
}