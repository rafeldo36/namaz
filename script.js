
// Firebase Configuration
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

// Mosque Request Form Submission
document.getElementById('mosqueRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
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
              <div class="col-md-${showEditButton ? '8' : '12'}">
                  <h5 class="card-title">${mosque.name}</h5>
                  <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${mosque.place}</p>
              </div>
              ${showEditButton ? `
              <div class="col-md-4 text-end">
                  <button class="btn btn-primary btn-sm" onclick="loadMosqueForEditing('${key}')">
                      <i class="fas fa-edit"></i> Edit
                  </button>
              </div>` : ''}
          </div>
          <div class="row mt-2">
              ${['fajr', 'zuhr', 'asr', 'maghrib', 'isha'].map(prayer => `
              <div class="col-6 col-md-2">
                  <small class="text-muted">${prayer.charAt(0).toUpperCase() + prayer.slice(1)}</small>
                  <p>${convertTo12Hour(mosque.times[prayer])}</p>
              </div>`).join('')}
          </div>
      </div>
  `;
      resultsContainer.appendChild(mosqueElement);
  });

  if (!hasResults) {
      resultsContainer.innerHTML = '<div class="alert alert-info">No mosques found matching your search</div>';
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
