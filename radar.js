const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
            'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
            'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
            'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS']
const height = 250
const width = 500
let fragment = document.createDocumentFragment();
const teamCon = document.querySelector('.teamCon')
const yearSlider = document.querySelector('#yearSlider')

const categories = ['test1', 'test2', 'test3', 'test4', 'test5']
const amounts = [1, 2, 3, 4, 5]

const dummyData = {
    datasets: [{
        label: 'Payment',
        borderColor: 'rgb(1, 206, 145)',
        backgroundColor: 'rgba(1, 206, 145, 0.2)',
        data: amounts
    }], 
    labels: categories
}

const Polar = document.getElementById('mychart').getContext('2d')
const PolarChart = new Chart (Polar, { type: 'radar', data: dummyData})
console.log(Polar)


function generateTeams() {
    for (let i = 0; i < teams.length; i++) {
        let div = document.createElement('div')
        div.classList = 'teamGrid'
        div.style.height = `${height / 4}px`
        div.style.width = `${width / 8}px`
        
        let img = document.createElement('img')
        img.src = `/nflRadarCharts/logos/${teams[i]}.png`
        img.classList = 'teamGrid'
        img.id = teams[i]
        
        div.appendChild(img)
        
        img.addEventListener('click', e => {
            console.log(e.target.id)
        })
        
        fragment.appendChild(div)
        
    }
    teamCon.appendChild(fragment)
}

function generateYear() {
    yearSlider.addEventListener('change', e => {
        console.log(e.target.value)
    })
}

generateTeams()
generateYear()
