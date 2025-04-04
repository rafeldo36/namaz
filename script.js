const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '00af0390b2mshba13b381a262395p1947bajsne99840195496',
		'X-RapidAPI-Host': 'muslimsalat.p.rapidapi.com'
	}
};

function startTime() {
  const today = new Date();
  let h = today.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML = h + ":" + m + ":" + s + " " + ampm;
  setTimeout(startTime, 1000);
}
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  date = new Date();
  year = date.getFullYear();
  month = monthNames[date.getMonth()];
  day = date.getDate();
  document.getElementById("current_date").innerHTML = day + " " + month + " " + year;

const getTime = (city)=>{

fetch('https://muslimsalat.p.rapidapi.com/'+city, options)
	.then(response => response.json())
	.then(response => {console.log(response)
        cityName.innerHTML=response.query
        country.innerHTML=response.country
        sunrise.innerHTML=response.items[0].shurooq
        fajr.innerHTML=response.items[0].fajr
        zuhr.innerHTML=response.items[0].dhuhr
        asr.innerHTML=response.items[0].asr
        maghrib.innerHTML=response.items[0].maghrib
        isha.innerHTML=response.items[0].isha

        updateActivePrayer();
    })
	.catch(err => console.error(err));

}
submit.addEventListener("click",(e)=>{
    e.preventDefault()
    getTime(city.value+key.value)
})
getTime('Bhiwandi.json')  
// Add functionality to highlight current prayer time
function updateActivePrayer() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Reset all cards
  document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('active-prayer');
  });
  
  // Get prayer times
  const prayerElements = {
      fajr: document.getElementById('fajr'),
      zuhr: document.getElementById('zuhr'),
      asr: document.getElementById('asr'),
      maghrib: document.getElementById('maghrib'),
      isha: document.getElementById('isha')
  };
  
  // Convert prayer times to minutes since midnight
  const prayerTimes = {};
  for (const [name, element] of Object.entries(prayerElements)) {
      if (element && element.textContent) {
          const timeStr = element.textContent;
          const [hours, minutes] = timeStr.split(':').map(Number);
          prayerTimes[name] = hours * 60 + minutes;
      }
  }
  
  // Determine which prayer is current
  let currentPrayer = null;
  
  if (prayerTimes.fajr && currentTime >= prayerTimes.fajr && 
      (!prayerTimes.sunrise || currentTime < prayerTimes.sunrise)) {
      currentPrayer = 'fajr';
  } else if (prayerTimes.zuhr && currentTime >= prayerTimes.zuhr && 
             (!prayerTimes.asr || currentTime < prayerTimes.asr)) {
      currentPrayer = 'zuhr';
  } else if (prayerTimes.asr && currentTime >= prayerTimes.asr && 
             (!prayerTimes.maghrib || currentTime < prayerTimes.maghrib)) {
      currentPrayer = 'asr';
  } else if (prayerTimes.maghrib && currentTime >= prayerTimes.maghrib && 
             (!prayerTimes.isha || currentTime < prayerTimes.isha)) {
      currentPrayer = 'maghrib';
  } else if (prayerTimes.isha && currentTime >= prayerTimes.isha) {
      currentPrayer = 'isha';
  }
  
  // Highlight the current prayer card
  if (currentPrayer) {
      document.getElementById(`${currentPrayer}Card`).classList.add('active-prayer');
  }
}

setInterval(updateActivePrayer, 60000);
updateActivePrayer();
