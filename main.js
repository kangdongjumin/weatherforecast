// 1. 도시 입력 후 도시에 위치 정보 불러오기
// 2. 위치 정보를 바탕으로 현재 날씨 정보 불러오기
// 3. UDT 날짜 정보를 05.26(Friday) 10:30 형식으로 변경
// 4. sunrise, sunset 시간 형식 변경
// 5. 5일간 매3시간 날씨 정보 불러오기
// 6. 3시간 별로 날씨정보 Render() 하기
// 7. 날씨 상태에 따라 날씨 아이콘 적용 (icon 정보)
// 8. 3시간별 날씨 정보에 Scroll 기능 추가
// 9. Today +1 +2 +3 +4 클릭에 따라서 backgroundColor 변경 기능 추가
// 10. Today +1 +2 +3 +4 에 따라서 해당 날짜로 이동
// 11. 도시 입력 잘못 했을 경우 에러 메세지 띄움
// 

let cityName = "울산";
let CTemp = "";
let feelsLikeCTemp = "";
let humidity = "";
let wind = "";
let visibility = "";
let windDirection = "";
let sunriseTime = "";
let sunsetTime = "";
let hourlyWeatherText = [];
let num = 0;
let todayDate = [];
let cityButton = document.getElementById("city-button");
let tabs = document.querySelectorAll(".date-button button");
let scroll = document.querySelector(".overflow-x-scroll");

const citySearch = () => {
  cityName = document.getElementById("city-name-input").value;
  currentWeatherInform();

};
tabs[num].classList.add("active");
tabs.forEach(
  (item, i) =>
    (item.onclick = function () {
      tabs[num].classList.remove("active");
      this.classList.add("active");
      num = i;
      render();
      let dateLocation = document.querySelectorAll(".date-location div");
      let dateLocationArr = [];
      for (let j = 0; j < dateLocation.length; j++) {
        if (dateLocation[j].innerHTML !== "") {
          dateLocationArr.push(dateLocation[j]);
        }
      }

      console.log(dateLocationArr[i + 1].offsetLeft);
      if (i == 0) {
        scroll.scrollLeft = 0;
      } else {
        scroll.scrollLeft = `${dateLocationArr[i + 1].offsetLeft - 8}`;
      }
    })
);

const currentWeatherInform = async () => {

  let url = new URL(`http://api.openweathermap.org/geo/1.0/direct?q=
    ${cityName}&limit=1&appid=d0688d56935d7270f2cea8c6ef5fecd2`);
  let response = await fetch(url);
  let data = await response.json();

  url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=d0688d56935d7270f2cea8c6ef5fecd2`
  );
  response = await fetch(url);
  let weatherData = await response.json();
  CTemp = weatherData.main.temp - 273.15;
  feelsLikeCTemp = weatherData.main.feels_like - 273.15;
  humidity = weatherData.main.humidity;
  wind = weatherData.wind.speed;
  windDirection = weatherData.wind.deg;
  visibility = weatherData.visibility / 1000;
  sunriseTime = sunRiseSet(weatherData.sys.sunrise);
  sunsetTime = sunRiseSet(weatherData.sys.sunset);

  searchResult();
  console.log(weatherData);

};

const sunRiseSet = (sunTimeUDT) => {
  let sunTimeKST = new Date(sunTimeUDT * 1000);
  let HH24 = ("00" + sunTimeKST.getHours()).slice(-2);
  let Min = ("00" + sunTimeKST.getMinutes()).slice(-2);
  return `${HH24}:${Min}`;
};

currentWeatherInform();

const currentTimeSet = () => {
  let currentTime = new Date();
  let month = ("00" + (currentTime.getMonth() + 1)).slice(-2);
  let date = ("00" + currentTime.getDate()).slice(-2);
  let hour = ("00" + currentTime.getHours()).slice(-2);
  let minn = ("00" + currentTime.getMinutes()).slice(-2);
  let day = currentTime.getDay();
  if (day == 0) {
    day = "Sunday";
  } else if (day == 1) {
    day = "Monday";
  } else if (day == 2) {
    day = "Tuesday";
  } else if (day == 3) {
    day = "Wednesday";
  } else if (day == 4) {
    day = "Thursday";
  } else if (day == 5) {
    day = "Friday";
  } else if (day == 6) {
    day = "Saturday";
  } else {
    day = "NO";
  }
  return `${month}.${date} (${day}) ${hour}:${minn}`;
};

const searchResult = () => {
  let weatherHTML = `<div class="city-box">
    <img class="city-mark"src="https://www.weather.go.kr/w/resources/image/renew/ic_sym_02.png">
    <div class="fs-2">${cityName}</div>
</div>
<div>
<div class="text-end pe-3">${currentTimeSet()}</div>
</div>

<div class="main-weather">
<h1>${CTemp.toFixed(1)}℃</h1>
<h5 class="feels-like">Feels like(${feelsLikeCTemp.toFixed(1)}℃)</h5>

</div>
<div class="other-inform row">
<div class="col-4">
    <div class="other-inform-detail"><img src="https://www.weather.go.kr/w/resources/image/renew/ic_sym_17.png"><div class="text-center">Humidity</div>
</div>
    <div class="text-center">${humidity}%</div>
</div>
<div class="col-4 wind-inform">
    <div class="other-inform-detail">
        <img src="https://www.weather.go.kr/w/resources/image/renew/ic_sym_18.png
        "><div class="text-center">Wind</div>
</div>
    <div class="text-center"><img class="wind-direction" style="transform: rotate(${windDirection}deg)" src="https://pic.onlinewebfonts.com/svg/img_251550.png">
     ${wind}m/s</div>
</div>
<div class="col-4">
    <div class="other-inform-detail" >
    <img src="https://static.thenounproject.com/png/118188-200.png"><div class="text-center">Visibility</div>
</div>
    <div class="text-center">${visibility.toFixed(1)}km</div>
</div>
<div class="sun-inform">
    <div><img class="sunrise-img" src="https://www.weather.go.kr/w/resources/image/renew/ic_sym_10.png">
    <h5>Sunrise ${sunriseTime}</h5>
    </div>
    <div><img src="https://www.weather.go.kr/w/resources/image/renew/ic_sym_11.png">
    <h5>sunset ${sunsetTime}</h5>
    </div>
    </div>
</div>`;

  document.getElementById("weather-inform").innerHTML = weatherHTML;
};

cityButton.addEventListener("click", citySearch);

const everyHour4Days = async () => {
  url = new URL(`http://api.openweathermap.org/geo/1.0/direct?q=
    ${cityName}&limit=1&appid=d0688d56935d7270f2cea8c6ef5fecd2`);
  let response = await fetch(url);
  let data = await response.json();
  url = new URL(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&exclude=hourly&appid=d0688d56935d7270f2cea8c6ef5fecd2`
  );
  response = await fetch(url);
  let everyHour4DayData = await response.json();
  hourlyWeatherText = everyHour4DayData.list;
  console.log(hourlyWeatherText);
  render();
};

const render = () => {
  let hourlyWeatherHTML = "";
  let dateBoxHTML = `<div>*</div>`;

  for (let i = 0; i < hourlyWeatherText.length; i++) {
    todayDate[i] = hourlyWeatherText[i].dt_txt.slice(5, 10);
    for (let j = 1; j < hourlyWeatherText.length; j++) {
      if (todayDate[i] == todayDate[i - j]) {
        todayDate[i] = "";
      }
    }

    dateBoxHTML += `<div>${todayDate[i]}</div>`;
    hourlyWeatherHTML += `
        <div class="col text-center each-result-box">
        <div class= "py-2 time-box">${hourlyWeatherText[i].dt_txt.slice(
          -8,
          -6
        )}</div>
        <div class= "py-2"><img width=50px src="https://openweathermap.org/img/wn/${
          hourlyWeatherText[i].weather[0].icon
        }@2x.png"></div>
        <div class= "py-2">${(hourlyWeatherText[i].main.temp - 273.15).toFixed(
          1
        )}℃</div>
        <div class= "py-2">${(
          hourlyWeatherText[i].main.feels_like - 273.15
        ).toFixed(1)}℃</div>
        <div class="wind-direction-box py-2"><div><img class="wind-direction" style="transform: rotate(${
          hourlyWeatherText[i].wind.deg
        }deg)" src="https://pic.onlinewebfonts.com/svg/img_251550.png"></div>
        <div>${hourlyWeatherText[i].wind.speed}(m/s)</div></div>
        <div class= "py-2">${hourlyWeatherText[i].main.humidity}%</div></div>`;
  }




  document.getElementById("date-box").innerHTML = dateBoxHTML;
  document.getElementById("hourly-weather-result").innerHTML =
    hourlyWeatherHTML;
};
const errorRender = () => {
    let errorMessageHTML = `<div class="error-box">
    <h2>도시명을 잘못 입력했습니다</h2></div>
    `
    document.getElementById("whole-box").innerHTML = errorMessageHTML
}

everyHour4Days();
