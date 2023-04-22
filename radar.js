const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
            'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
            'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
            'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
]

const height = 250
const width = 500
const teamCon = document.querySelector('.teamCon')
const season1Selector = document.querySelector('#season1Selector')
const season2Selector = document.querySelector('#season2Selector')
const chartData = document.querySelector('#chartdata')

const url = 'http://127.0.0.1:5000'
let year1 = ''
let year2 = ''
let team1 = ''
let team2 = ''

const categories = [
    'PF Rank', 
    'Passing Yds Rank', 
    'Def Rushing Yds Rank', 
    'PA Rank', 
    'Def Passing Yds Rank', 
    'Rushing Yds Rank',
]

const amounts1 = []
const amounts2 = []
let chart = null


function generateTeams() {
    let fragment = document.createDocumentFragment()
    
    for (let i = 0; i < teams.length; i++) {
        
        let div = document.createElement('div')
        div.classList = 'teamGrid'
        div.id = `${teams[i]}Grid`
        div.style.height = `${height / 4}px`
        div.style.width = `${width / 8}px`
        
        let img = document.createElement('img')
        img.src = `logos/${teams[i]}.png`
        
        img.classList = 'teamGrid'
        img.id = teams[i]
        
        div.appendChild(img)
        
        img.addEventListener('click', e => {
            
            if (team1) {
                team2 = e.target.id
                e.target.parentElement.classList.add('clicked')
                console.log(year1, year2, team1, team2)
            } else {
                team1 = e.target.id
                e.target.parentElement.classList.add('clicked')
                console.log(year1, year2, team1, team2)
            }
        })
        
        fragment.appendChild(div)
        
    }
    teamCon.appendChild(fragment)
}

function generateYear() {
    let fragment = document.createDocumentFragment()
    
    for (let i = 1; i < 3; i++) {
        let option = document.createElement('option')
        option.text = `Team ${i} Season`
        option.selected = true;
        fragment.appendChild(option)
        
        for (let j = 2022; j > 2001; j--) {
            let option = document.createElement('option')            
            option.value = j
            option.text = `${j}`
            
            fragment.appendChild(option)
        }
        if (i == 1){
            season1Selector.appendChild(fragment)
        } else {
            season2Selector.appendChild(fragment)
        }
    }
    
    season1Selector.addEventListener('change', e => {
        year1 = e.target.value
        console.log(year1, year2, team1, team2)
    })
    season2Selector.addEventListener('change', e => {
        year2 = e.target.value
        console.log(year1, year2, team1, team2)
    })
}

async function giveData() {
    console.log(year1, year2, team1, team2)
    
    const response = await fetch(url + '/postmethod', {
        method: 'POST',
        body: JSON.stringify({
            Team1: team1,
            Team2: team2,
            Season1: year1,
            Season2: year2,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    
    const data = await response.json()
    
    console.log(year1, year2, team1, team2)
    console.log(data)
    return [data]
}

async function getData() {
    
    console.log(year1, year2, team1, team2)
    
    const response = await fetch(url + '/getmethod')
    const data = await response.json()
    
    let string = data.split('/')
    let json1 = JSON.parse(string[0].replaceAll("'",'"'))
    let json2 = JSON.parse(string[1].replaceAll("'",'"'))
    
        for (let i = 0; i < categories.length; i++) {
            amounts1[i] = 33 - json1[`${categories[i]}`]
            amounts2[i] = 33 - json2[`${categories[i]}`]
        }  
        
        year1 = json1['season']
        year2 = json2['season']
        team1 = json1['team']
        team2 = json2['team']
    
    console.log(year1, year2, team1, team2)
    console.log(amounts1)
    console.log(amounts2)
    console.log(json1.team_color)
    console.log(json2['Key Player'])
    return [amounts1, amounts2]
}

async function makeChart() {
    const [data1, data2] = await Promise.all([await giveData(), getData()]);
    console.log(data1)
    console.log(data2)
    
    let options = {
        chart: {
            width: '100%',
            height: '100%',
            type: 'radar',
        },
        series: [
          {
            name: `${year1} ${team1}`,
            data: amounts1
          },
          {
            name: `${year2} ${team2}`,
            data: amounts2
          }
        ],
        labels: categories,
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val.toFixed(0)
                }
            },
            min: 0,
            max: 32,
            tickAmount: 8,
        }
    }
    
    if (chart) {
        chart.updateOptions(options)
    } else {
        chart = await new ApexCharts(document.querySelector("#chart"), options);  
        chart.render();    
    }
    
    // chart = await new ApexCharts(document.querySelector("#chart"), options);  
    // chart.render();
    
    team1 = team2 = year1 = year2 = ''
}

generateTeams()
generateYear()

chartdata.addEventListener('click', () => {
    
    makeChart()
    
})