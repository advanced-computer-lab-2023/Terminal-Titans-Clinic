import PropTypes from 'prop-types';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
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
  let totalSales = 0;
  for (let i = 0; i < response.data.Result.totalSales.length; i++) {
    console.log(typeof response.data.Result.totalSales[i]);
    if(typeof response.data.Result.totalSales[i] == 'object')
      res[i] = response.data.Result.totalSales[i][0]
    else
      res[i] = response.data.Result.totalSales[i]
    totalSales += Number(response.data.Result.totalSales[i]);
  }
  return [res, totalSales];
}

export const labelsYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fetchDataYear = async () => {
  let temp = []
  let totalSales = 0;
  for (let i = 1; i < 13; i++) {
    try {
      let response = await axios.get('http://localhost:7000/Admin/totalSalesReport/' + i, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      console.log(response.data.Result.totalSales);
      temp[i - 1] = response.data.Result.totalSales;
      totalSales += response.data.Result.totalSales;
    }
    catch (err) {
      temp[i - 1] = 0;
    }
  }
  return [temp, totalSales];
}



export let OverviewSales = (props) => {
  const { sx, salesType } = props;
  const navigate = useNavigate();

  const [totalSalesWeek, setTotalSalesWeek] = useState(0);
  const [totalSalesYear, setTotalSalesYear] = useState(0);

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
      setTotalSalesYear(result[1]);
      let res = result[0];
      setDataYear(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: res,
        }],
      }));
    };

    fetchDataAndSetDataYear();

    const fetchDataAndSetDataWeek = async () => {
      const result = await fetchDataWeek();
      setTotalSalesWeek(result[1]);
      let res = result[0];
      console.log(res);
      setDataWeek(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: res,
        }],
      }));
      console.log(dataWeek);
    }

    fetchDataAndSetDataWeek();
  }, []); // Run only once on component mount

  useEffect(() => {
    console.log(dataWeek);
    console.log(dataYear);
  }, [dataWeek])

  const goToSales = () => {
    const newURL = `http://localhost:4000/Health-Plus/adminSalesReport?id=${sessionStorage.getItem('token')}`;

    // Replace the current URL with the new one
    window.location.replace(newURL);
  }

  return (
    <Card sx={sx}
      className="flex flex-col justify-content-between"
    >
      <CardHeader
        action={(
          <Chip label={salesType == 'week' ? `Total Sales:${totalSalesWeek}` : `Total Sales:${totalSalesYear}`} variant="outlined" />
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
          onClick={goToSales}
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
