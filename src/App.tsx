import {QuadrantChart} from './components/QuadrantChart';

import './App.css'

const data = [
  {
      "name": "Yellow",
      "color": "hsl(57, 96%, 64%)",
      "y": 88,
      "x": 6412
  },
  {
      "name": "Yellow",
      "color": "hsl(57, 96%, 64%)",
      "y": 58,
      "x": 5951
  },
  {
      "name": "Purple",
      "color": "hsl(259, 48%, 55%)",
      "y": 4,
      "x": 5904
  },
  {
      "name": "Yellow",
      "color": "hsl(57, 96%, 64%)",
      "y": 59,
      "x": 2692
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 30,
      "x": 7455
  },
  {
      "name": "Green",
      "color": "hsl(137, 68%, 61%)",
      "y": 91,
      "x": 8085
  },
  {
      "name": "Yellow",
      "color": "hsl(57, 96%, 64%)",
      "y": 35,
      "x": 152
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 32,
      "x": 9116
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 20,
      "x": 4915
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 65,
      "x": 1297
  },
  {
      "name": "Purple",
      "color": "hsl(259, 48%, 55%)",
      "y": 72,
      "x": 2301
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 34,
      "x": 5493
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 29,
      "x": 4455
  },
  {
      "name": "Yellow",
      "color": "hsl(57, 96%, 64%)",
      "y": 49,
      "x": 4639
  },
  {
      "name": "Orange",
      "color": "hsl(0, 99%, 71%)",
      "y": 68,
      "x": 2078
  }
]
const yRange = {
  min: 0,
  max: 100,
};
const xRange = {
  min: 0,
  max: 10000,
};

const quadrantsList = ['Assess', 'Adopt', 'Avoid', 'Analyze'];

function App() {

  return (
    <div style={{width: '900px', height: '900px'}}>
      {/* <h1>Gráfico de Cuadrantes</h1> */}
      <QuadrantChart
        data={data}
        quadrantsList={quadrantsList}
        xRange={xRange}
        yRange={yRange}
        xLabel="User Count!"
        yLabel="Satisfaction Percentage!"
        legendTitle="Título de leyenda"
        yLabelTop="Etiqueta X Superior"
        yLabelBottom="Etiqueta X Inferior"
        xLabelLeft="Etiqueta Y Izquierda"
        xLabelRight="Etiqueta Y Derecha"
        invertX={false} // Cambiar a true si es necesario invertir
        invertY={false} // Cambiar a true si es necesario invertir
      />
      
    </div>
  )
}

export default App