
const SearchInput = document.getElementById("SearchIn");
const SearchBtn = document.getElementById("SearchBtn");
const CelBtn = document.getElementById('CelciusBtn');
const FahBtn = document.getElementById('FahrenheitBtn');
const SearchBarContainer = document.getElementById("SearchIn-SearchBtn");
const APIKey = "1ebc6bcbf4534de884f150541260203";
const baseURL = "https://api.weatherapi.com/v1/forecast.json?"
let WeatherData;
window.addEventListener('load', (event) => {
    loadWeatherData('Seoul');
});
SearchBtn.addEventListener("click",searchBtnPressed);
CelBtn.addEventListener("click",(event)=>{
    updateTempAndWeatherCondition(true);
    updateExtraWeatherInfo(true);
});
FahBtn.addEventListener("click",(event)=>{
    updateTempAndWeatherCondition(false);
    updateExtraWeatherInfo(false);
});
SearchInput.addEventListener("input",handleInput);


function handleInput(event) {
    let value = event.target.value.trim();
    if(!event.target.value || validateCityName(value)) deleteWarningMessage();
}
function validateCityName(city) {
    const validPattern = /^[a-zA-Z\u0600-\u06FF\s\-']+$/;//allow [English Arabic space - ']
    if(city && validPattern.test(city)) return true;
    return false;
}
function showWarningMessage(message) {
    let p = SearchBarContainer.querySelector('p');
    if(!p) {
        p = document.createElement('p');
        p.textContent=message;
        p.classList.add("errorMessage");
        SearchBarContainer.append(p);
        return;
    }
    p.textContent=message;
}
function deleteWarningMessage() {
    let p = SearchBarContainer.querySelector('p');
    if(!p) return;
    p.remove();
}
function getWeatherGroup(code) {
    const groups = {
        sunny: [1000],
        cloudy: [1003, 1006, 1009],
        mist: [1030, 1135, 1147],
        rainy: [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246],
        thunder: [1087, 1273, 1276, 1279, 1282]
    };

    for (let groupName in groups) {
        if (groups[groupName].includes(code)) {
            return groupName;
        }
    }

    if (code >= 1066 && code <= 1264) return 'snowy';

    return 'sunny';
}

function updateBackground() {
    const code = WeatherData.current.condition.code;
    const groupName = getWeatherGroup(code);
    const body = document.body;
    body.classList.remove('bg-sunny','bg-clear','bg-cloudy','bg-mist','bg-rainy','bg-snowy','bg-thunder');
    if(groupName === 'sunny') {
        let isDay = WeatherData.current.is_day;
        if(!isDay){
            body.classList.add(`bg-clear`);
            return;
        }
    }
    body.classList.add(`bg-${groupName}`);
}

function updateWeatherIcon() {
    const weatherIconUI = document.getElementById('WeatherIcon');
    const baseURL = './assets/Icons/';
    const code = WeatherData.current.condition.code;
    const groupName = getWeatherGroup(code);
    const isDay = WeatherData.current.is_day;

    if(groupName === 'sunny'){
        weatherIconUI.src = isDay? `${baseURL}sunny.png`:`${baseURL}clear.png`;
    } else if(groupName === 'cloudy') {
        weatherIconUI.src = isDay?`${baseURL}CloudDay.png`:`${baseURL}CloudNight.png`;
    }else{
        weatherIconUI.src = `${baseURL}${groupName}.png`;
    }

}
function updateCityAndCountryNames() {
    const [city, country] = [WeatherData.location.name, WeatherData.location.country];
    const cityUI = document.getElementById("City");
    cityUI.textContent = city;
    const countryUI = document.getElementById("Country");
    countryUI.textContent = country;
}
function updateDateAndTime() {
    const time = WeatherData.location.localtime;
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const DateTimeUI = document.getElementById('Date-Time');
    const localtime = new Date(time);

    const DateUI = DateTimeUI.querySelector('#Date');
    const day = Days[localtime.getDay()];
    const month = Months[localtime.getMonth()]; 
    DateUI.textContent = `${day}, ${localtime.getDate()} ${month} ${localtime.getFullYear()}`;
    const TimeUI = DateTimeUI.querySelector('#Time');
    const hour = localtime.getHours();
    const minute = localtime.getMinutes();
    let newMinute = (minute >= 10)? `${minute}` : `0${minute}`;
    let newHour = (hour%12 >=10)? `${hour%12}`: `0${hour%12}`;
    if(hour > 12) {
        TimeUI.textContent = `${newHour}:${newMinute} PM`;
    } else if(hour < 12) {
        if(hour === 0) {
            newHour = `12`;
        }
        TimeUI.textContent = `${newHour}:${newMinute} AM`;
    } else {
        TimeUI.textContent = `${hour}:${newMinute} PM`;
    }
}
function updateTempAndWeatherCondition(isCel) {
    const TempWeatherConditionContainer = document.getElementById('Temp-Units-WeatherCondition');
    const TempUI = TempWeatherConditionContainer.querySelector('#Temp');
    const WeatherUI = TempWeatherConditionContainer.querySelector('#WeatherCondition');
    const FahBtnUI = TempWeatherConditionContainer.querySelector('#FahrenheitBtn');
    const CelBtnUI = TempWeatherConditionContainer.querySelector('#CelciusBtn');
    if(!isCel) {
        const currentTemp= WeatherData.current.temp_f;
        TempUI.textContent = currentTemp;
        FahBtnUI.classList.remove('deactive-unit');
        CelBtnUI.classList.add('deactive-unit');
        
    } else {
        const currentTemp= WeatherData.current.temp_c;
        TempUI.textContent = currentTemp;
        FahBtnUI.classList.add('deactive-unit');
        CelBtnUI.classList.remove('deactive-unit');
    }
    const currentWeather = WeatherData.current.condition.text;
    WeatherUI.textContent = currentWeather; 
}
function updateExtraWeatherInfo(isCel) {
    const feelsLikeUI = document.getElementById('FeelsLikeTemp');
    const maxTempUI = document.getElementById('MaxTemp');
    const minTempUI = document.getElementById('MinTemp');
    const humidityUI = document.getElementById('HumidityPercent');
    const windUI = document.getElementById('WindSpeed');
    const winddirUI = document.getElementById('windDirection');
    if(!isCel){
        feelsLikeUI.textContent = `${WeatherData.current.feelslike_f}°F`;
        maxTempUI.textContent = WeatherData.forecast.forecastday[0].day.maxtemp_f;
        minTempUI.textContent = WeatherData.forecast.forecastday[0].day.mintemp_f;
        windUI.textContent = `${WeatherData.current.wind_mph} Mile/h`;
        
    } else {
        feelsLikeUI.textContent = `${WeatherData.current.feelslike_c}°C`;
        maxTempUI.textContent = WeatherData.forecast.forecastday[0].day.maxtemp_c;
        minTempUI.textContent = WeatherData.forecast.forecastday[0].day.mintemp_c;
        windUI.textContent = `${WeatherData.current.wind_kph} Km/h`;
    }
    humidityUI.textContent = WeatherData.current.humidity;
    
    winddirUI.textContent=WeatherData.current.wind_dir;

}
async function loadWeatherData(cityName){
    WeatherData = await getWeatherData(cityName);
    if(!WeatherData) return;
    updateCityAndCountryNames();
    updateDateAndTime();
    updateTempAndWeatherCondition(true);
    updateExtraWeatherInfo(true);
    updateWeatherIcon()
    updateBackground();
    console.log(WeatherData);

}
async function searchBtnPressed(event) {
    event.preventDefault();
    let SearchInputContent = SearchInput.value.trim(); //trim all spaces from start and end
    let isValidContent = validateCityName(SearchInputContent);
    if(!isValidContent){ 
        showWarningMessage("Please input a valid city name");
        return;
    }
    deleteWarningMessage();
    
    await loadWeatherData(SearchInputContent);
    
}

async function getWeatherData(city) {
    //fetch the weather from api
    if(!city || !validateCityName(city)) return null;

    const params = new URLSearchParams({
        key: APIKey,
        q: city,
        days: 1,//fetch one day until finishing the ui
        aqi: "no"

    });
    const url = `${baseURL}${params}`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message||"Something wents wrong");
        }
        const data = await response.json();
        return data; 

    } catch (error) {
        showWarningMessage(error.message);
        return null;
    }
}

