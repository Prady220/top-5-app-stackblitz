import React from "react";
<script
  crossorigin="anonymous"
  src="https://polyfill.io/v3/polyfill.min.js?features=fetch-polyfill"
/>;
// Got bearer apiKey from https://www.yelp.com/developers/v3/manage_app;
const API_KEY =
  "Bqw9DcGp31OLXAjRz93Rx8TqMDP6HiFQ0lxIRZMk6x53kzarAMFL8hQtatVzUCxSSSs0RvDSTJhOEO5z7IPSgqDilMifA6LliLZoGuwZRGgdUSxYGYknlk68hZGMYHYx";
const HEADER_OPTIONS = {
  Accept: "application/json",
  "x-requested-with": "xmlhttprequest",
  "Access-Control-Allow-Origin": "*",
  Authorization: `Bearer ${API_KEY}`
};
const yelp = {
  searchInYelp(term = "icecream", location = "alpharetta, ga", limit = 5) {
    return fetch(
      `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=rating&limit=${limit}`,
      {
        headers: {
          accept: "application/json",
          "x-requested-with": "xmlhttprequest",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${API_KEY}`
        }
      }
    )
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {
        if (data.businesses) {
          return data.businesses.map(business => {
            return fetch(
              `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${
                business.id
              }/reviews`,
              {
                headers: {
                  accept: "application/json",
                  "x-requested-with": "xmlhttprequest",
                  "Access-Control-Allow-Origin": "*",
                  Authorization: `Bearer ${API_KEY}`
                }
              }
            )
              .then(res => {
                return res.json();
              })
              .then(data => {
                if (data.reviews) {
                  const review = data.reviews[0];
                  const businessObj = {
                    id: business.id,
                    imageSrc: business.image_url,
                    name: business.name,
                    address: business.location.display_address.join(", "),
                    phone: business.phone,
                    rating: business.rating,
                    reviewCount: business.review_count,
                    reviewer: review.user.name,
                    reviewerComment: review.text,
                    reviewerRating: review.rating
                  };
                  return businessObj;
                }
              })
              .catch(error => {
                console.error(error);
                throw Error(error);
              });
          });
        }
      })
      .catch(error => {
        console.error(error);
        throw Error(error);
      });
  }
};

export default yelp;
