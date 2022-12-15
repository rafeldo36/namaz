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
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  date = new Date();
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();
  document.getElementById("current_date").innerHTML = day + "/" + month + "/" + year;

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
    })
	.catch(err => console.error(err));

}
submit.addEventListener("click",(e)=>{
    e.preventDefault()
    getTime(city.value+key.value)
})
getTime('Bhiwandi.json')