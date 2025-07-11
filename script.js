
const firebaseConfig = {
    apiKey: "AIzaSyBI7kKdSE8Lo5_0THZkpyieanpeONGUehg",
    authDomain: "mosqueprayertimes-9cb56.firebaseapp.com",
    databaseURL: "https://mosqueprayertimes-9cb56-default-rtdb.firebaseio.com/",
    projectId: "mosqueprayertimes-9cb56",
    storageBucket: "mosqueprayertimes-9cb56.firebasestorage.app",
    messagingSenderId: "35036358577",
    appId: "1:35036358577:web:447ea27463d55ff1cabf90",
    measurementId: "G-SVTVNRBDB1"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Time and Date Functions
  function startTime() {
    const today = new Date();
    let h = today.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML = `${h}:${m}:${s} ${ampm}`;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    return i < 10 ? "0" + i : i;
  }
  
  // Update date display
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const date = new Date();
  document.getElementById("current_date").innerHTML = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  
  // Prayer Times API
  const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '00af0390b2mshba13b381a262395p1947bajsne99840195496',
        'X-RapidAPI-Host': 'muslimsalat.p.rapidapi.com'
    }
  };
  
  function getTime(city) {
    fetch(`https://muslimsalat.p.rapidapi.com/${city}`, options)
        .then(response => response.json())
        .then(response => {
            document.getElementById('cityName').textContent = response.query;
            document.getElementById('country').textContent = response.country;
            document.getElementById('sunrise').textContent = response.items[0].shurooq;
            document.getElementById('fajr').textContent = response.items[0].fajr;
            document.getElementById('zuhr').textContent = response.items[0].dhuhr;
            document.getElementById('asr').textContent = response.items[0].asr;
            document.getElementById('maghrib').textContent = response.items[0].maghrib;
            document.getElementById('isha').textContent = response.items[0].isha;
        })
        .catch(err => console.error(err));
  }
  
  document.getElementById('mosqueRequestForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      alert('Thank you for submitting your mosque details! We will verify and add them soon.You will now be redirected to our WhatsApp group. To update mosque timings, please send a message in the group with your mosque name. Our admin will update the details accordingly.');
      
      const whatsappGroupLink = "https://chat.whatsapp.com/H2hWPyy0ngM7Fu1UA7SZBB";
      
      window.location.href = whatsappGroupLink;
      
      var modal = bootstrap.Modal.getInstance(document.getElementById('findMosqueModal'));
      modal.hide();
      this.reset();
  });
  
  document.getElementById('mosqueRequestForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const mosqueName = document.getElementById('requestMosqueName').value;
      const mosqueLocation = document.getElementById('requestMosqueLocation').value;
      const userEmail = document.getElementById('requestUserEmail').value;
      
      // Validate required fields
      if (!mosqueName || !mosqueLocation) {
          alert('Please fill in at least the mosque name and location');
          return;
      }
      
      // Prepare prayer times object
      const prayerTimes = {
          fajr: document.getElementById('requestFajrTime').value || 'Not provided',
          zuhr: document.getElementById('requestZuhrTime').value || 'Not provided',
          asr: document.getElementById('requestAsrTime').value || 'Not provided',
          maghrib: document.getElementById('requestMaghribTime').value || 'Not provided',
          isha: document.getElementById('requestIshaTime').value || 'Not provided'
      };
      
      // Prepare email parameters
      const templateParams = {
          mosque_name: mosqueName,
          mosque_location: mosqueLocation,
          prayer_times: prayerTimes, // Now sending as object instead of string
          user_email: userEmail || 'Not provided',
          submission_date: new Date().toLocaleString()
      };
      
      // Send email using EmailJS
      emailjs.send('service_fnf7vom', 'template_a6fl1j4', templateParams)
          .then(function(response) {
              alert('Mosque request submitted successfully! We will review it soon.');
              document.getElementById('mosqueRequestForm').reset();
              // Collapse the form
              var collapse = new bootstrap.Collapse(document.getElementById('mosqueRequestForm'));
              collapse.hide();
          }, function(error) {
              console.error('Failed to send request:', error);
              alert('Failed to submit request. Please try again later.');
          });
  });
  
  // Admin control functions
  function checkAdminAccess() {
      // Check URL for admin parameter
      const urlParams = new URLSearchParams(window.location.search);
      const adminKey = urlParams.get('admin');
      
      // Check local storage for existing admin status
      const isAdmin = localStorage.getItem('isAdmin') === 'true' || adminKey === 'Noori@36';
      
      // If URL has the key but not in storage, store it
      if (adminKey === 'Noori@36' && !localStorage.getItem('isAdmin')) {
          localStorage.setItem('isAdmin', 'true');
      }
      
      // Toggle admin buttons
      const adminButtons = document.querySelectorAll('.admin-only');
      adminButtons.forEach(button => {
          button.style.display = isAdmin ? 'block' : 'none';
      });
      
      return isAdmin;
  }
  
  // Call this function when the page loads
  document.addEventListener('DOMContentLoaded', function() {
      checkAdminAccess();
      
  });
  // You might also want to add a way to logout (remove admin access)
  // Could be a hidden button that appears for admins
  function logout() {
      localStorage.removeItem('isAdmin');
      window.location.href = window.location.pathname; // Reload without params
  };
  
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    getTime(document.getElementById('city').value + '.json');
  });
  
  // Mosque Management Functions
  function displayMosqueResults(mosques, containerId, searchTerm = '', showEditButton = false) {
    const resultsContainer = document.getElementById(containerId);
    resultsContainer.innerHTML = '';
  
    if (!mosques) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No mosques found</div>';
        return;
    }
  
    let hasResults = false;
    const searchLower = searchTerm.toLowerCase();
  
    Object.entries(mosques).forEach(([key, mosque]) => {

        if (!mosque || !mosque.name || !mosque.place || !mosque.times) {
            return;
        }
        if (searchTerm && 
            !mosque.name.toLowerCase().includes(searchLower) && 
            !mosque.place.toLowerCase().includes(searchLower)) {
            return;
        }
  
        hasResults = true;
        
        const mosqueElement = document.createElement('div');
        mosqueElement.className = 'card mb-3 mosque-result';
         mosqueElement.innerHTML = `
    <div class="card-body">
        <div class="row">
            <div class="col-md-${showEditButton ? '6' : '8'}">
                <h5 class="card-title">${mosque.name}</h5>
                <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${mosque.place}</p>
            </div>
            <div class="col-md-${showEditButton ? '6' : '4'} text-end">
                ${showEditButton ? `
                <button class="btn btn-primary btn-sm me-2" onclick="loadMosqueForEditing('${key}')">
                    <i class="fas fa-edit"></i> Edit
                </button>` : ''}
                <button class="btn btn-success btn-sm save-mosque-btn" 
                        data-mosque-id="${key}"
                        data-mosque-name="${encodeURIComponent(mosque.name)}"
                        data-mosque-place="${encodeURIComponent(mosque.place)}"
                        data-fajr="${mosque.times.fajr}"
                        data-zuhr="${mosque.times.zuhr}"
                        data-asr="${mosque.times.asr}"
                        data-maghrib="${mosque.times.maghrib}"
                        data-isha="${mosque.times.isha}">
                    <i class="fas fa-home"></i> Save to Home
                </button>
            </div>
        </div>
    `;
        resultsContainer.appendChild(mosqueElement);
    });
  
    if (!hasResults) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No mosques found matching your search</div>';
    }
  }
  
  // Save mosque to localStorage and handle PWA installation
// Update the saveMosqueToHome function
function saveMosqueToHome(e) {
    e.preventDefault();
    const button = e.target.closest('.save-mosque-btn');
    if (!button) return;
    
    const mosqueData = {
        id: button.dataset.mosqueId,
        name: button.dataset.mosqueName,
        place: button.dataset.mosquePlace,
        times: {
            fajr: button.dataset.fajr,
            zuhr: button.dataset.zuhr,
            asr: button.dataset.asr,
            maghrib: button.dataset.maghrib,
            isha: button.dataset.isha
        }
    };
    
    // Save to localStorage
    const savedMosques = JSON.parse(localStorage.getItem('savedMosques')) || {};
    savedMosques[mosqueData.id] = mosqueData;
    localStorage.setItem('savedMosques', JSON.stringify(savedMosques));
    
    // Show appropriate prompt based on device
    showInstallPrompt(mosqueData.name);
}

// New improved prompt function
function showInstallPrompt(mosqueName) {
    // For Android/Chrome
    if (window.deferredPrompt) {
        const installConfirm = confirm(`Would you like to install ${mosqueName} prayer times as an app on your home screen?`);
        if (installConfirm) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install');
                }
                window.deferredPrompt = null;
            });
        }
    } 
    // For iOS
    else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.navigator.standalone) {
        showIosInstallPrompt(mosqueName);
    }
    // For other browsers
    else {
        alert(`${mosqueName} has been saved to your favorites!`);
    }
}

// iOS specific prompt
function showIosInstallPrompt(mosqueName) {
    const iosPrompt = document.createElement('div');
    iosPrompt.className = 'ios-prompt';
    iosPrompt.innerHTML = `
        <span>Add ${mosqueName} to your home screen for quick access</span>
        <button id="closeIosPrompt">✕</button>
        <div class="ios-instructions">
            Tap <i class="fas fa-share"></i> then "Add to Home Screen"
        </div>
    `;
    
    document.body.appendChild(iosPrompt);
    
    document.getElementById('closeIosPrompt').addEventListener('click', () => {
        iosPrompt.remove();
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => iosPrompt.remove(), 10000);
}

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
});

// Load saved mosques on page load
function loadSavedMosques() {
    const savedMosques = JSON.parse(localStorage.getItem('savedMosques')) || {};
    if (Object.keys(savedMosques).length > 0) {
        // You could display these in a "Favorites" section if you want
        console.log('Saved mosques:', savedMosques);
    }
}

  function convertTo12Hour(time24) {
      if (!time24) return '';
      
      let [hours, minutes] = time24.split(':');
      hours = parseInt(hours, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      return `${hours}:${minutes} ${ampm}`;
  }
  
  function loadMosqueForEditing(mosqueId) {
    database.ref(`mosques/${mosqueId}`).once('value')
        .then(snapshot => {
            const mosque = snapshot.val();
            document.getElementById('editMosqueId').value = mosqueId;
            document.getElementById('editMosqueName').value = mosque.name;
            document.getElementById('editMosquePlace').value = mosque.place;
            document.getElementById('editFajrTime').value = mosque.times.fajr;
            document.getElementById('editZuhrTime').value = mosque.times.zuhr;
            document.getElementById('editAsrTime').value = mosque.times.asr;
            document.getElementById('editMaghribTime').value = mosque.times.maghrib;
            document.getElementById('editIshaTime').value = mosque.times.isha;
            
            document.getElementById('editMosqueResults').style.display = 'none';
            document.getElementById('editMosqueFormContainer').style.display = 'block';
            document.getElementById('updateMosqueBtn').style.display = 'inline-block';
            document.getElementById('deleteMosqueBtn').style.display = 'inline-block';
        })
        .catch(error => console.error('Error loading mosque:', error));
  }
  
  function saveMosque() {
    const form = document.getElementById('mosqueForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
  
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
  
    if (isValid) {
        const mosqueData = {
            name: document.getElementById('mosqueName').value.trim(),
            place: document.getElementById('mosquePlace').value.trim(),
            times: {
                fajr: document.getElementById('fajrTime').value,
                zuhr: document.getElementById('zuhrTime').value,
                asr: document.getElementById('asrTime').value,
                maghrib: document.getElementById('maghribTime').value,
                isha: document.getElementById('ishaTime').value
            },
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
  
        database.ref('mosques').push().set(mosqueData)
            .then(() => {
                alert('Mosque added successfully!');
                bootstrap.Modal.getInstance(document.getElementById('addMosqueModal')).hide();
                form.reset();
            })
            .catch(error => console.error('Error saving mosque:', error));
    }
  }
  
  function updateMosque() {
    const form = document.getElementById('editMosqueForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
  
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
  
    if (isValid) {
        const mosqueId = document.getElementById('editMosqueId').value;
        const mosqueData = {
            name: document.getElementById('editMosqueName').value.trim(),
            place: document.getElementById('editMosquePlace').value.trim(),
            times: {
                fajr: document.getElementById('editFajrTime').value,
                zuhr: document.getElementById('editZuhrTime').value,
                asr: document.getElementById('editAsrTime').value,
                maghrib: document.getElementById('editMaghribTime').value,
                isha: document.getElementById('editIshaTime').value
            },
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
  
        database.ref(`mosques/${mosqueId}`).update(mosqueData)
            .then(() => {
                alert('Mosque updated successfully!');
                resetEditModal();
                fetchMosquesForEdit();
            })
            .catch(error => console.error('Error updating mosque:', error));
    }
  }
  
  function deleteMosque() {
    if (confirm('Are you sure you want to delete this mosque? This action cannot be undone.')) {
        const mosqueId = document.getElementById('editMosqueId').value;
        database.ref(`mosques/${mosqueId}`).remove()
            .then(() => {
                alert('Mosque deleted successfully!');
                resetEditModal();
                fetchMosquesForEdit();
            })
            .catch(error => console.error('Error deleting mosque:', error));
    }
  }
  
  function resetEditModal() {
    document.getElementById('editMosqueResults').style.display = 'block';
    document.getElementById('editMosqueFormContainer').style.display = 'none';
    document.getElementById('updateMosqueBtn').style.display = 'none';
    document.getElementById('deleteMosqueBtn').style.display = 'none';
    document.getElementById('editMosqueForm').reset();
  }
  
  function fetchMosquesForEdit(searchTerm = '') {
    database.ref('mosques').once('value')
        .then(snapshot => {
            displayMosqueResults(snapshot.val(), 'editMosqueResults', searchTerm, true);
        })
        .catch(error => console.error('Error fetching mosques:', error));
  }
  
  function fetchMosquesForDisplay(searchTerm = '') {
    database.ref('mosques').once('value')
        .then(snapshot => {
            displayMosqueResults(snapshot.val(), 'searchResults', searchTerm);
        })
        .catch(error => console.error('Error fetching mosques:', error));
  }
  
  // Event Listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize with default city
    getTime('Bhiwandi.json');
    
    
    // Mosque form submissions
    document.getElementById('saveMosqueBtn').addEventListener('click', saveMosque);
    document.getElementById('updateMosqueBtn').addEventListener('click', updateMosque);
    document.getElementById('deleteMosqueBtn').addEventListener('click', deleteMosque);
    
    // Modal events
    document.getElementById('findMosqueModal').addEventListener('shown.bs.modal', () => {
        fetchMosquesForDisplay();
    });
      document.getElementById('searchResults').addEventListener('click', function(e) {
        if (e.target.closest('.save-mosque-btn')) {
            saveMosqueToHome(e);
        }
    });
    document.getElementById('editMosqueResults').addEventListener('click', saveMosqueToHome);
     loadSavedMosques();
    document.getElementById('editMosqueModal').addEventListener('shown.bs.modal', () => {
        fetchMosquesForEdit();
    });
    
    // Search functionality
    document.getElementById('searchMosqueBtn').addEventListener('click', () => {
        fetchMosquesForDisplay(document.getElementById('mosqueSearch').value);
    });
    
    document.getElementById('searchEditMosqueBtn').addEventListener('click', () => {
        fetchMosquesForEdit(document.getElementById('editMosqueSearch').value);
    });
    
    // Clear validation on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
  });
  // Register Service Worker
// Update service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}