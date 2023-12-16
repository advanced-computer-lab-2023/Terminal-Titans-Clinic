import PropTypes from 'prop-types';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import faker from 'faker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect } from 'react';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const optionsWeek = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      display: false,
    },
  },
};

export const optionsYear = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

export const labelsWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const fetchDataWeek = async () => {
  let response = await axios.get('http://localhost:7000/Admin/totalSalesReportWeek', {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token')
    }
  });
  console.log(response.data.Result.totalSales);
  let res = []
  for (let i = 0; i < response.data.Result.totalSales.length; i++) {
    res[i] = response.data.Result.totalSales[i]
  }
  return res;
}

export const labelsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fetchDataYear = async () => {
  let temp = []
  for (let i = 1; i < 13; i++) {
    try {
      let response = await axios.get('http://localhost:7000/Admin/totalSalesReport/' + i, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      console.log(response.data.Result.totalSales);
      temp[i - 1] = response.data.Result.totalSales;
    }
    catch (err) {
      temp[i - 1] = 0;
    }
  }
  return temp;
}



export let OverviewSales = (props) => {
  const { sx, salesType } = props;

  const [dataYear, setDataYear] = useState({
    labels: labelsYear,
    datasets: [
      {
        data: [], // Initially set an empty array
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  });

  const [dataWeek, setDataWeek] = useState({
    labels: labelsWeek,
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  });

  useEffect(() => {
    const fetchDataAndSetDataYear = async () => {
      const result = await fetchDataYear();
      setDataYear(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: result,
        }],
      }));
    };

    fetchDataAndSetDataYear();

    const fetchDataAndSetDataWeek = async () => {
      const result = await fetchDataWeek();
      setDataWeek(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: result,
        }],
      }));
    }

    fetchDataAndSetDataWeek();
  }, []); // Run only once on component mount

  // useEffect(() => {
  //   console.log('salesType', salesType);
  //   // if (salesType == 'year') {
  //   //   fetchDataYear();
  //   // }
  //   // else {
  //   //   fetchDataWeek();
  //   // }
  // }, []);

  // const fetchDataYear = async () => {
  //   let temp = []
  //   for (let i = 1; i < 13; i++) {
  //     try {
  //       let response = await axios.get('http://localhost:7000/Admin/totalSalesReport/' + i, {
  //         headers: {
  //           Authorization: 'Bearer ' + sessionStorage.getItem('token')
  //         }
  //       });
  //       console.log(response.data.Result.totalSales);
  //       temp[i - 1] = response.data.Result.totalSales;
  //     }
  //     catch (err) {
  //       temp[i - 1] = 0;
  //     }
  //   }
  //   setDataYear(temp)
  // }

  // const fetchDataWeek = async () => {
  //   let response = await axios.get('http://localhost:7000/Admin/totalSalesReportWeek', {
  //     headers: {
  //       Authorization: 'Bearer ' + sessionStorage.getItem('token')
  //     }
  //   });
  //   console.log(response);
  //   setDataWeek(response.data.Result.totalSales);
  // }

  return (
    <Card sx={sx}
      className="flex flex-col justify-content-between"
    >
      <CardHeader
        action={(
          <Button
            color="inherit"
            size="small"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            )}
          >
            Sync
          </Button>
        )}
        title={salesType == 'week' ? 'Sales Week' : 'Sales Year'}
      />
      <CardContent>
        <Bar options={salesType == 'week' ? optionsWeek : optionsYear} data={salesType == 'week' ? dataWeek : dataYear} />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end', display: salesType === 'week' ? 'none' : 'flex' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          Overview
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
  salesType: PropTypes.string.isRequired,
};
