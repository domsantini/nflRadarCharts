const url = 'http://127.0.0.1:5000'

let year1 = null
let year2 = null
let team1 = null
let team2 = null

let chart = null
let table = null


function generateTeams() {
    
    const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 
            'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 
            'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 
            'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
    ]
    
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
                    } else {
                        let prevTeamDiv = document.getElementById(`${team1}`)
                        prevTeamDiv.parentElement.classList.remove('clickedT1')
                        team1 = e.target.id
                        e.target.parentElement.classList.add('clickedT1')
                        prevTeam = 'team1'
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
                } else {
                    team1 = e.target.id
                    e.target.parentElement.classList.add('clickedT1')
                    teamCount++
                    prevTeam = 'team1'
                }
            }
        })
        div.addEventListener('click', () => {
            if (chart && team1 && team2) {
                const modalButton = document.querySelector('[data-modal-target]')
                modalButton.setAttribute('hidden', true)
                chartData.removeAttribute('hidden')
            }
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
        if (chart) {
            const modalButton = document.querySelector('[data-modal-target]')
            modalButton.setAttribute('hidden', true)
            chartData.removeAttribute('hidden')
        } 
        year1 = e.target.value
    })
    season2Selector.addEventListener('change', e => {
        if (chart) {
            const modalButton = document.querySelector('[data-modal-target]')
            modalButton.setAttribute('hidden', true)
            chartData.removeAttribute('hidden')
        }
        year2 = e.target.value
    })
}

async function getData() {
    
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
    
    let data = await response.json()
    data = transformData(data)

    return data
}

function transformData(data) {
    // Pull in data and split into two json objects for each team
    let string = data.split('/')
    let json1 = JSON.parse(string[0].replaceAll("'",'"'))
    let json2 = JSON.parse(string[1].replaceAll("'",'"'))
    
    // Transform Chart Data
    let ranks1 = []
    let ranks2 = []
    let season1 = null
    let season2 = null
    let color1Main = null
    let color1Secondary = null
    let color2Main = null
    let color2Secondary = null
    
    const chartCategories = [
        'PF Rank', 
        'Passing Yds Rank', 
        'Def Rushing Yds Rank', 
        'PA Rank', 
        'Def Passing Yds Rank', 
        'Rushing Yds Rank',
    ]
    
    for (let i = 0; i < chartCategories.length; i++) {
        ranks1[i] = 33 - json1[`${chartCategories[i]}`]
        ranks2[i] = 33 - json2[`${chartCategories[i]}`]
    }  
    
    // Transform Table Data
    let stats1 = []
    let stats2 = []
    
    const tableCategories = [
        'Record',
        'PF',
        'PA',
        'Passing Yds',
        'Def Passing Yds',
        'Rushing Yds',
        'Def Rushing Yds',
        'Key Player'
    ]
    
    for (let i = 0; i < tableCategories.length; i++) {
        stats1[i] = json1[`${tableCategories[i]}`]
        stats2[i] = json2[`${tableCategories[i]}`]
    }

    return {
        chartCategories: chartCategories,
        ranks1: ranks1,
        ranks2: ranks2,
        season1: json1['season'],
        season2: json2['season'],
        team1: json1['team'],
        team2: json2['team'],
        color1Main: json1['team_color'],
        color1Secondary: json1['team_color2'],
        color2Main: json2['team_color'],
        color2Secondary: json2['team_color2'],
        stats1: stats1,
        stats2: stats2,
    }
}

async function makeChart() {
    const data = await getData()
        
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
            name: `${data.season1} ${data.team1}`,
            data: data.ranks1
          },
          {
            name: `${data.season2} ${data.team2}`,
            data: data.ranks2
          }
        ],
        labels: data.chartCategories,
        stroke: {
          colors: [data.color1Main, data.color2Main],  
        },
        markers: {
            colors: [data.color1Main, data.color2Main]
        },
        fill: {
            opacity: 0.1,
            colors: [data.color1Secondary, data.color2Secondary],
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
                strokeColor: [data.color1Main, data.color2Main],
                fillColors: [data.color1Secondary, data.color2Secondary],
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

async function makeTable() {
    let data = await getData()
    
    let table = document.querySelector('table')
    let header = true;
    const tableLabels = [
        'Record',
        'Points For',
        'Points Allowed',
        'Passing Yards',
        'Passing Yards Allowed',
        'Rushing Yards',
        'Rushing Yards Allowed',
        'Team MVP'
    ]
    if (table) {
        table.innerHTML = ''
    }
    for (let i = 0; i < tableLabels.length; i++) {
        if (header) {
            let row = 
                `
                <tr class='top'>
                    <th> ${data.season1} ${data.team1} </th>
                    <th class='middle'> </th>
                    <th> ${data.season2} ${data.team2} </th>
                </tr>
                `
            table.innerHTML += row
            header = false;
        }
        let row = 
            `
            <tr>
                <td> ${data.stats1[i]} </th>
                <td class='middle'> ${tableLabels[i]} </td>
                <td> ${data.stats2[i]} </td>
            </tr>
            `
        table.innerHTML += row
    }
    table = true;
}

generateTeams()
generateYear()

const chartData = document.querySelector('#chartdata')
chartdata.addEventListener('click', () => {
    
    makeChart()
    const openModalButtons = document.querySelector('[data-modal-target]')
    openModalButtons.removeAttribute('hidden')
    chartData.setAttribute('hidden', true)

})

// Modal popup

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    makeTable()
    openModal(modal)
    
    let tableData = getData()
    console.log(tableData)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}