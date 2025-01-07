document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = 'ce8c6b84bc9b74c804f5c84a9ac1b53b';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.cod === 200) {
        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
        });
        fetchHourlyWeather(cityName);
    } else {
        document.querySelector("#weather").classList.remove('show');
        showAlert(`
            Não foi possível localizar...

            <img src="src/images/404.svg"/>
        `);
    }
});

async function fetchHourlyWeather(cityName) {
    const apiKey = 'ce8c6b84bc9b74c804f5c84a9ac1b53b';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.cod === "200") {
        displayHourlyWeather(json.list);
    }
}

function displayHourlyWeather(hourlyData) {
    const hourlyInfo = document.querySelector('#hourly_info');
    hourlyInfo.innerHTML = '';

    const today = new Date();
    const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Adiciona uma variável para contar quantos horários foram exibidos
    let displayedHours = 0;

    hourlyData.forEach((data) => {
        const date = new Date(data.dt * 1000);
        
        // Verifica se a data é do mesmo dia
        if (date.getDate() === targetDate.getDate() && date.getMonth() === targetDate.getMonth() && date.getFullYear() === targetDate.getFullYear()) {
            const hour = date.getHours();
            const temp = data.main.temp.toFixed(1).replace('.', ',');
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;

            // Exibe apenas a cada 3 horas
            if (hour % 3 === 0) {
                hourlyInfo.innerHTML += `
                    <div class="hourly_item">
                        <p>${hour}:00</p>
                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                        <p>${temp} <sup>C°</sup></p>
                        <p>${description}</p>
                    </div>
                `;
                displayedHours++; // Incrementa o contador de horários exibidos
            }
        }
    });
}

function showInfo(json) {
    showAlert('');

    document.querySelector("#weather").classList.add('show');

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`;
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}

function moveCarousel(direction) {
    const carouselContainer = document.querySelector('.carousel-container');
    const itemWidth = document.querySelector('.hourly_item').offsetWidth + 10; // Largura do item + margem
    const scrollAmount = itemWidth * 4; // Mover 4 itens de cada vez

    // Calcula a nova posição de rolagem
    const newScrollPosition = carouselContainer.scrollLeft + (direction * scrollAmount);
    carouselContainer.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
}
