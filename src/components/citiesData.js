//import dependencies
import React, { Component } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material'

//import json file
import city from '../data/cities.json';

//import css
import "../assets/LayoutCSS/PageContainer.css"

//import sub component
import Titile from "./subComponents/Titile";
import Search from "./subComponents/searchBar";
import OneCityData from "./subComponents/oneCityData";


//this function return weather details of all cities
export default class componentName extends Component {

    state = {
        cities: [],
        weather: [],

    }

    componentDidMount = async () => {

        var weatherArr = [];
        var localArr = [];

        //get API key from environment variable
        const API_KEY = process.env.REACT_APP_API_KEY

        //data caching mechanism
        localArr = JSON.parse(localStorage.getItem('weather'))  //get data from local storage
        var timespan = localStorage.getItem('date');

        if (localArr) {
            const res = (((new Date()).getTime()) > timespan);       
            if (res) {
                localStorage.removeItem('weather'); //delete cached
             console.log("timePassed");
            } else {
                console.log( "not timePassed");
            }

        }

        if (localArr == null || localArr.length == 0) {
            const cities = [];

            //fetch data from json file

            Object.values(city.List).map(rec => {
                cities.push(rec);
            })
            this.setState({weather:[]})
            this.setState({ cities: cities })

            //calling api
            
            for (var i = 0; i < cities.length; i++) {
           

                //convert city name to the lan and lot

                await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cities[i].CityName}&limit=1&appid=${API_KEY}`)
                    .then(async (getData) => {

                        //request weather data using lan and lot

                        await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${getData.data[0].lat}&lon=${getData.data[0].lon}&appid=${API_KEY}`)
                            .then((getData2) => {
                                weatherArr.push(getData2.data);
                            })
                    })

            }
            console.log( "API called");
            console.log( weatherArr);
            this.setState({ weather: weatherArr })
 
            if (weatherArr.length != 0) {
            //set time to expire local storage 
            var dates = new Date().setMinutes(new Date().getMinutes() + 5);
           
            //store data in local storage
            localStorage.setItem('date', dates);
            localStorage.setItem('weather', JSON.stringify(weatherArr))  //store data in localStorage
            }
        } else {
            weatherArr = localArr;
            console.log( "Not API called");
            this.setState({ weather: weatherArr })
        }       
       
    }


    //removing item function

    deleteCity = (id) => {
     
        const { weather } = this.state;
        const newWeather = weather.filter(wd => wd.id !== id);
        this.setState({ weather: newWeather });
    }

    render() {
        return (<div className="body-div">
            <br />
            {/*import title*/}
            <Titile />
            {/*import search*/}
            <Search />


            <Grid container spacing={5}>
                <Grid item xs={2.6} xl={1} lg={1.5} md={0.5} sm={0.5}>
                </Grid>
                <Grid item xs={9.2} xl={10} lg={10.5} md={11} sm={11.0}>
                    <Grid container spacing={5}>

                        {   //get Data using map
                            this.state.weather.length != 0 && this.state.weather.map((data) => {

                                return (
                                    <Grid item xs={10} xl={4} lg={5.2} md={6} sm={6}>

                                        {/*call sub component*/}
                                        <OneCityData
                                            condition={false}
                                            dataSet={data}
                                            deleteClickHandler={this.deleteCity.bind(this, data.id)} />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>
        );
    }
}

















