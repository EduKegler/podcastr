# Podcastr

Demo: https://podcastr-edukegler.vercel.app/

![Podcastr](https://user-images.githubusercontent.com/30960212/118411699-3a8d6400-b66c-11eb-91bf-ed284e11320e.gif)

# What is this?

This is simple SPA to listen too a list of all the podcast episodes, for it was created an audio player.
It was created using the React / Typescript / NextJS stack, with SCSS preprocessor.

The SPA consumes the https://www.themoviedb.org/ API and saves the bookmark and Watch Later List in LocalStorage, 
so that each user can have their own list without the need to create a new token.

# How to run?

Just follow the steps:
Clone this project and run `npm install`.

The project consume an API, you can see it here https://edukegler-podcastr-api.herokuapp.com/.
If you want to consume your own api, you can change the .env file and set the API url. e.g.

```
REACT_APP_URL=https://edukegler-podcastr-api.herokuapp.com/
```

After that will can run `npm run start` and see the project in `localhost:3000`.

