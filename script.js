const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '00af0390b2mshba13b381a262395p1947bajsne99840195496',
		'X-RapidAPI-Host': 'muslimsalat.p.rapidapi.com'
	}
};

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