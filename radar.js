const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
            'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
            'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
            'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
]

const chartData = document.querySelector('#chartdata')

const url = 'http://127.0.0.1:5000'
let year1 = ''
let year2 = ''
let team1 = ''
let team2 = ''

let color1Main = null
let color1Secondary = null
let color2Main = null
let color2Secondary = null

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
    
    const teamCon = document.querySelector('.teamCon')
    let fragment = document.createDocumentFragment()
    let teamCount = 0
    let prevTeam = null
    
    for (let i = 0; i < teams.length; i++) {
        
        let div = document.createElement('div')
        div.classList = 'teamGrid'
        div.id = `${teams[i]}Grid`
        
        let img = document.createElement('img')
        img.src = `logos/${teams[i]}.png`
        img.classList = 'teamGrid'
        img.id = teams[i]
        
        div.appendChild(img)
        
        div.addEventListener('click', e => {
            
            if (team1 && team2) {
            
                if (e.target.parentElement.classList.contains('clickedT1')) {
                    let prevTeamDiv = document.getElementById(`${team2}`)
                    prevTeamDiv.parentElement.classList.remove('clickedT2')
                    team2 = e.target.id
                    e.target.parentElement.classList.add('clickedT2')
                                        
                } else if (e.target.parentElement.classList.contains('clickedT2')) {
                    let prevTeamDiv = document.getElementById(`${team1}`)
                    prevTeamDiv.parentElement.classList.remove('clickedT1')
                    team1 = e.target.id
                    e.target.parentElement.classList.add('clickedT1')
                    
                } else {
                    if (prevTeam === 'team1') {
                        let prevTeamDiv = document.getElementById(`${team2}`)
                        prevTeamDiv.parentElement.classList.remove('clickedT2')
                        team2 = e.target.id
                        e.target.parentElement.classList.add('clickedT2')
                        prevTeam = 'team2'
                        console.log(prevTeam)
                    } else {
                        let prevTeamDiv = document.getElementById(`${team1}`)
                        prevTeamDiv.parentElement.classList.remove('clickedT1')
                        team1 = e.target.id
                        e.target.parentElement.classList.add('clickedT1')
                        prevTeam = 'team1'
                        console.log(prevTeam)
                    }
                }
                
                return 
            } 
            
            if (teamCount < 2) {
                
                if (team1) {
                    team2 = e.target.id
                    e.target.parentElement.classList.add('clickedT2')
                    teamCount++
                    prevTeam = 'team2'
                    console.log(prevTeam)
                } else {
                    team1 = e.target.id
                    e.target.parentElement.classList.add('clickedT1')
                    teamCount++
                    prevTeam = 'team1'
                    console.log(prevTeam)
                }
            }
            // console.log(`T1: ${team1}, T2: ${team2}, TC: ${teamCount}`)
        })
        fragment.appendChild(div)
    }
    teamCon.appendChild(fragment)
}

function generateYear() {
    const season1Selector = document.querySelector('#season1Selector')
    const season2Selector = document.querySelector('#season2Selector')
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
    })
    season2Selector.addEventListener('change', e => {
        year2 = e.target.value
    })
}

async function giveData() {
    
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

    return [data]
}

async function getData() {
    
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
        color1Main = json1['team_color']
        color1Secondary = json1['team_color2']
        color2Main = json2['team_color']
        color2Secondary = json2['team_color2']
    
    
    return [amounts1, amounts2]
}

async function makeChart() {
    const [data1, data2] = await Promise.all([await giveData(), getData()]);
        
    let options = {
        chart: {
            width: '100%',
            height: '100%',
            fontFamily: 'Roboto Condensed, sans-serif',
            type: 'radar',
            toolbar: {
            //   offsetX: -20,  
            },
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
        stroke: {
          colors: [color1Main, color2Main],  
        },
        markers: {
            colors: [color1Main, color2Main]
        },
        fill: {
            opacity: 0.1,
            colors: [color1Secondary, color2Secondary],
        },
        xaxis: {
            labels: {
                style: {
                    colors: ['#000000','#000000','#000000','#000000','#000000','#000000'],
                },
            }
        },
        yaxis: {
            show: false,
            min: 0,
            max: 32,
            tickAmount: 8,
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val) {
                    let num = 33 - val
                    
                    if ([1, 21, 31].includes(num)) {
                        return num + 'st'
                    } else if ([2, 22, 32].includes(num)) {
                        return num + 'nd' 
                    } else if ([3, 23].includes(num)) {
                        return num + 'rd'
                    } else {
                        return num + 'th'
                    }
                }
            }
        },
        legend: {
            markers: {
                strokeWidth: 2,
                strokeColor: [color1Main, color2Main],
                fillColors: [color1Secondary, color2Secondary],
                useSeriesColors: false
            },
        },
    }
    
    if (chart) {
        chart.updateOptions(options)
    } else {
        chart = await new ApexCharts(document.querySelector("#chart"), options);  
        chart.render();    
    }

}

generateTeams()
generateYear()

chartdata.addEventListener('click', () => {
    
    makeChart()
    
})

