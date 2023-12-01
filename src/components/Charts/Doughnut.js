import { Doughnut } from 'react-chartjs-2';
const DoughnutChart = () => {
  const dataD = {
    labels: ['processed', 'pending'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['rgb(220,20,60)', 'rgb(204, 223, 243)'],
        borderWidth: 2,
        radius: '40%'
      }
    ]
  };
  return <Doughnut data={dataD} />;
};

export default DoughnutChart;
